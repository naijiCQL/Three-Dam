/*
 * @Author: 陈巧龙
 * @Date: 2023-11-10 16:27:36
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-12-02 20:45:10
 * @FilePath: \three-project\src\components\initScene.js
 * @Description: 初始化three的场景以及将三维物体进行添加
 */
import bus from '@/utils/bus'
import * as THREE from 'three';
import store from '@/store/index'
import { initBall } from './createBall'
import { getPressVal } from "@/api/home"
import { loadAndAddTreeModels } from './loadTools'
import { createPressureSensors } from './createSyj'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";  // 导入轨道控制器
import { getTreePosition1, getTreePosition3, getTreePosition4 } from './positionData'
import { jpRiverBed, jpFrontDam, jpMiddleDam, jpBehindDam, jpDrawLadder, jpCreateRail, jpCreateCorridors, createJpWaterSurface } from './createJpRes'
import { riverBed, frontDam, middleDam, behindDam, tranDam, drawLadder, createWater, createWaterSurface, crossLine, createRail, createCorridors } from './createYsyRes'

const renderer = new THREE.WebGLRenderer({ antialias: true }); // 创建渲染器
const scene = new THREE.Scene();// 创建场景
const group = new THREE.Group();// 创建一个组将3D物体放入其中
const shortSensors = [];//保存短的圆柱体
const axesHelper = new THREE.AxesHelper(400)//添加坐标轴辅助器。参数：坐标轴长，红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
let camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 5000); //创建相机
let isUpdateActive = true; // 标志变量，控制更新状态
let font = null; //保存加载的字体
let rotationY = true;//开启自转

/**
 * @description: 初始化三维场景
 * @return {*}
 */
export function initScene() {
    // 创建一个纹理图片加载器加载图片
    var textureLoader = new THREE.TextureLoader();
    // 加载背景图片
    var texture = textureLoader.load('/bg.jpg');
    // 纹理对象Texture赋值给场景对象的背景属性.background
    scene.background = texture
    // 设置相机视角参数
    camera.position.set(300, 300, 300)
    //添加轨道控制器
    new OrbitControls(camera, renderer.domElement)

    renderer.setSize(window.innerWidth, window.innerHeight);

    const loader = new FontLoader();
    //记载支持中文的字体
    loader.load('/SimHei_Regular.json', function (loadFont) {
        font = loadFont;
    });

    initBall(group)
    // 将组添加到场景中
    scene.add(group);

    // 创建性能监视器
    let stats = new Stats()
    // 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
    stats.setMode(0)
    // 设置监视器位置
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'

    // 将监视器添加到页面中
    document.body.appendChild(stats.domElement)
    //渲染函数
    function animate() {
        // 地球旋转
        if (rotationY) { ballRotationY() }
        // 更新帧数
        stats.update()
        //渲染页面
        renderer.render(scene, camera);
        // 渲染下一帧的时候就会调用animate函数
        requestAnimationFrame(animate);
    }
    //进行渲染
    animate();

    return { renderer }
}
/**
 * @description: 地球自动旋转
 * @return {*}
 */
function ballRotationY() {
    scene.rotation.y += 0.003
}

/**
 * @description: 获取各渗压计的数值
 * @param {*} params1
 * @param {*} param2
 * @param {*} param3
 * @return {*}
 */
export function receivePressVal(params1, param2, param3) {
    getPressVal(params1, param2, param3).then(res => {
        const press = res.data.press
        /* 将每个渗压计作为key，时间、数值作为值 */
        const pressData = press.reduce((acc, entry) => {
            const key = entry.cd_nm;
            if (!acc[key]) {
                acc[key] = [];
            }
            const pressEntry = {
                "ch": entry.ch,
                "dt": entry.dt,
                "press_val": entry.press_val
            };
            acc[key].push(pressEntry);
            return acc;
        }, {});

        //定义一个对象用于保存以日期作为key，其中包括各渗压计的数值以及标注样式
        const dataPressArr = {}
        //标注文字对象与上述处理的对象通过渗压计编号进行连接，按照每个时间最为key，其中包含每个渗压计的标注样式以及渗压计数值
        for (const key in pressData) {
            const updArr = pressData[key];
            const textLabelArr = store.state.textLabelArray[key][0];
            const shortEntityArr = store.state.shortEntityArray[key][0]

            updArr.forEach(entry => {
                const { dt, press_val } = entry;

                if (!dataPressArr[dt]) {
                    dataPressArr[dt] = {};
                }

                dataPressArr[dt][key] = [textLabelArr, press_val, shortEntityArr];
            });
        }
        //将缺乏的日期进行删除
        for (let date in dataPressArr) {
            let keys = Object.keys(dataPressArr[date]);
            if (keys.length !== store.state.totalCount) {
                delete dataPressArr[date];
            }

            const values = dataPressArr[date];
            let allNull = true;

            //如果某一天中每一个管道的数值都为null，将其进行删除
            for (const key in values) {
                const pressVal = values[key][1];
                // 检查pressVal是否为null
                if (pressVal) {
                    allNull = false;
                    break; // 如果有一个pressVal不为null，则跳出循环
                }
            }
            // 如果一整天内所有管道的press_val都为null，则删除该天的数据项
            if (allNull) {
                delete dataPressArr[date];
            }
        }
        console.log(dataPressArr)
        //调用异步函数
        updateTextLabels(dataPressArr);
    })
        .catch(error => {
            console.log(error);
        });
}

/**
 * @description: 延迟显示每个时刻各渗压计的数值
 * @param {*} dataPressArr
 * @return {*}
 */
async function updateTextLabels(dataPressArr) {
    //用于储存新的水柱
    const shortEntity = []
    for (const date in dataPressArr) {
        const values = dataPressArr[date];
        for (const upd in values) {
            //各渗压计的样式
            const textLabel = values[upd][0];
            //各渗压计的数值
            const pressVal = values[upd][1];
            //将渗压计的数值进行更新
            textLabel.updateTextLabel(pressVal, store.state.totalCount)

            let height = pressVal / 10

            /* 获取初始mesh的各参数 */
            const shortEntityHeight = values[upd][2].geometry.parameters.height;
            const shortEntityX = values[upd][2].position.x;
            const shortEntityY = values[upd][2].position.y;
            const shortEntityZ = values[upd][2].position.z;

            // 使用 heightDifference 计算高度差
            const geometry = new THREE.CylinderGeometry(0.08, 0.08, shortEntityHeight + height, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x27B7EE });
            const cube = new THREE.Mesh(geometry, material);

            cube.position.x = shortEntityX;
            cube.position.y = shortEntityY + height / 2;
            cube.position.z = shortEntityZ;

            shortEntity.push(cube)
        }
        //将第一组值作为绘制绘制水柱的值
        if (shortEntity.length === store.state.totalCount) {
            shortEntity.forEach((mesh) => {
                group.add(mesh)
            })
        }
        //如果更新被停止，则跳出循环
        if (!isUpdateActive) {
            break;
        }
        // 使用setTimeout延迟5秒钟
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    //将原来存在的水柱进行移除
    if (shortSensors.length) {
        shortSensors.forEach((mesh) => {
            group.remove(mesh)
        })
    }
}

/**
 * @description: 清空场景内创建的物体
 * @return {*}
 */
function remove3DObject() {
    // 释放几何体和材质
    const clearCache = (item) => {
        item.geometry.dispose();
        item.material.dispose();
    };

    // 递归释放物体下的 几何体 和 材质
    const removeObj = (obj) => {
        let arr = obj.children.filter((x) => x);
        arr.forEach((item) => {
            if (item.children.length) {
                removeObj(item);
            } else {
                clearCache(item);
                item.clear();
            }
        });
        obj.clear();
        arr = null;
    };
    // 移除 group
    removeObj(group);
    //将坐标辅助器添加进场景中
    scene.add(axesHelper)
}
/**
 * @description: 接受水库编码，用于显示水库
 * @return {*}
 */
bus.$on('resCode', value => {
    //跳出循环
    isUpdateActive = false;
    //从场景移除已经创建的物体
    setTimeout(() => {
        //停止自转
        rotationY = false
        //复原位置
        scene.rotation.y = 0
        //清空场景内物体
        remove3DObject()
        //调用函数以加载和添加树木模型
        loadAndAddTreeModels('/tree1.gltf', getTreePosition1(), new THREE.Vector3(1, 1, 1), group);
        loadAndAddTreeModels('/tree1.gltf', getTreePosition3(), new THREE.Vector3(0.5, 0.5, 0.5), group);

        //根据所选择的水库进行展示模型
        if (value === '42128140006') {
            isUpdateActive = true;
            //设置相机视角
            camera.position.set(200, 200, 400)

            group.add(jpRiverBed())
            group.add(jpFrontDam())
            group.add(jpMiddleDam(60, '/dam.png', 0, 0, -7))
            group.add(jpMiddleDam(62, '/dam.png', -62, 0, -35))
            group.add(jpMiddleDam(100, '/dam.png', 0, 270, -7))
            group.add(jpMiddleDam(90, '/floor.jpg', 60, 0, -7))
            group.add(jpBehindDam(60, true, 0, 0, 0))
            group.add(jpBehindDam(90, false, 60, 0, 0))
            group.add(jpBehindDam(60, false, -62, 0, 0))
            group.add(jpBehindDam(100, false, 0, 90, -100))
            group.add(jpCreateRail(150, 0, 0))
            group.add(jpCreateRail(100, 270, 3.7))
            group.add(jpCreateCorridors(150, 0))
            group.add(jpCreateCorridors(100, 270))
            group.add(jpDrawLadder(0, 0))
            group.add(jpDrawLadder(90, -90))
            group.add(createJpWaterSurface())

            loadAndAddTreeModels('/tree1.gltf', getTreePosition4(), new THREE.Vector3(0.5, 0.5, 0.5), group);

            //读取后端接口的内容，进行绘制渗压计的个数与样式
            createPressureSensors(value, group, font).then(sensors => {
                const { longSensors, shortSensors, lineSensors, crossSensors } = sensors;

                //遍历长的圆柱体
                longSensors.forEach(mesh => {
                    group.add(mesh);
                });
                //遍历短的圆柱体
                shortSensors.forEach(mesh => {
                    group.add(mesh);
                });
                //遍历射线
                lineSensors.forEach(mesh => {
                    group.add(mesh)
                })
                //遍历断面线
                crossSensors.forEach((mesh) => {
                    group.add(mesh)
                })
            })
                .catch(error => {
                    console.error('Error:', error);
                });

            // 将组添加到场景中
            scene.add(group);
        } else {
            isUpdateActive = true;
            //设置相机视角
            camera.position.set(80, 100, 200)

            //将绘制的物体添加进场景中
            group.add(riverBed())
            group.add(frontDam())
            group.add(middleDam())
            group.add(behindDam())
            group.add(tranDam())
            group.add(drawLadder())
            group.add(createWater())
            group.add(createWaterSurface())
            group.add(crossLine())
            group.add(createRail())
            group.add(createCorridors())

            //读取后端接口的内容，进行绘制渗压计的个数与样式
            createPressureSensors(value, group, font).then(sensors => {
                const { longSensors, shortSensors, lineSensors, crossSensors } = sensors;

                //遍历长的圆柱体
                longSensors.forEach(mesh => {
                    group.add(mesh);
                });
                //遍历短的圆柱体
                shortSensors.forEach(mesh => {
                    group.add(mesh);
                });
                //遍历射线
                lineSensors.forEach(mesh => {
                    group.add(mesh)
                })
                //遍历断面线
                crossSensors.forEach((mesh) => {
                    group.add(mesh)
                })
            })
                .catch(error => {
                    console.error('Error:', error);
                });

            // 将组添加到场景中
            scene.add(group);
        }
    }, 5000);

})

/**
 * @description: 接收时间，并且发送请求获取渗水计的数值
 * @return {*}
 */
bus.$on('dateTime', value => {
    //对选择的日期进行处理
    const result = value.map(date => {
        let d = new Date(date);
        return d.toISOString().split('T')[0];
    });
    //将存在文字标签进行删除
    store.state.textMeshArray.forEach((mesh) => {
        group.remove(mesh)
        mesh.geometry.dispose();
        mesh.material.dispose();
    })
    //获取各渗压计数值
    receivePressVal(store.state.resCode, result[0], result[1])
})
