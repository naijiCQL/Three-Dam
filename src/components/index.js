/*
 * @Author: 陈巧龙
 * @Date: 2023-11-10 16:27:36
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-21 14:38:47
 * @FilePath: \three-project\src\components\index.js
 * @Description: 初始化three的场景以及将三维物体进行添加
 */
import bus from '@/utils/bus'
import * as THREE from 'three';
import { getSYParams, getPressVal } from "@/api/home"
import { createWall, createDam, createTranDam, createWater, createWaterSurface, createLeftWall, createRightWall, createText } from './create3DObjects'

// 创建一个组将立方体放入其中
const group = new THREE.Group();
//定义保存显示的文字对象
const textLabelArray = {}
//定义保存显示内部实体对象
const shortEntityArray = {}
//保存长的圆柱体
const longSensors = [];
//保存短的圆柱体
const shortSensors = []
//保存射线
const lineSensors = []
//保存断面线
const crossSensors = []
//记录渗压计管的数量
let totalCount = 0

/**
 * @description: 初始化三维场景
 * @return {*}
 */
export function initScene() {
    // 创建场景
    const scene = new THREE.Scene();
    // 创建一个纹理图片加载器加载图片
    var textureLoader = new THREE.TextureLoader();
    // 加载背景图片
    var texture = textureLoader.load('/bg.jpg');
    // 纹理对象Texture赋值给场景对象的背景属性.background
    scene.background = texture

    //  添加坐标轴辅助器。参数：坐标轴长，红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
    const axesHelper = new THREE.AxesHelper(25)
    scene.add(axesHelper)

    // 创建相机
    const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 10;

    //将绘制的物体添加进场景中
    group.add(createWall())
    group.add(createDam())
    group.add(createWater())
    group.add(createWaterSurface())
    group.add(createLeftWall())
    group.add(createRightWall())
    group.add(createTranDam())

    //读取后端接口的内容，进行绘制渗压计的个数与样式
    createPressureSensors('42011640018').then(sensors => {
        const { longSensors, shortSensors, lineSensors } = sensors;

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

    // 创建渲染器
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // 渲染函数
    function animate() {
        renderer.render(scene, camera);
        // 渲染下一帧的时候就会调用animate函数
        requestAnimationFrame(animate);
    }
    //进行渲染
    animate();

    return { renderer, camera }
}

/**
 * @description: 创建渗压计三维体
 * @param {*} params
 * @return {*}
 */
function createPressureSensors(params) {
    return getSYParams(params).then(res => {
        const data = res.resultList
        //将渗压计管数量记录
        totalCount = res.totalCount

        // 按照 ch 字段分组渗压计数据
        const groupedByCh = data.reduce((acc, sensor) => {
            const { mpcd, dvcd, ch } = sensor;
            if (!acc[ch]) {
                acc[ch] = [];
            }
            acc[ch].push({ mpcd, dvcd, ch }); // 只保留 mpcd、dvcd、ch 字段
            return acc;
        }, {});

        //根据横断面的数量确定各横断面的间距
        const length = Math.floor(5 / Object.keys(groupedByCh).length);

        // 创建渗压计，定义基本参数
        let x = 0.55
        let yLong = 0.6
        let yShort = 0.3
        let labelY = 0.3
        let z = -0.5

        for (const ch in groupedByCh) {
            const sensorsInSection = groupedByCh[ch];

            // 根据 mpcd 对渗压计进行排序
            sensorsInSection.sort((a, b) => a.mpcd - b.mpcd);

            /* 创建断面线 */
            //创建断面线路径
            const path = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0.2, 1.2, z),
                new THREE.Vector3(0.55, 0.8, z),
                new THREE.Vector3(0.85, 0.75, z),
                new THREE.Vector3(1.15, 0.74, z),
                new THREE.Vector3(2, 0.25, z),
                new THREE.Vector3(1.15, 0.74, z),
                new THREE.Vector3(0.85, 0.75, z),
                new THREE.Vector3(0.55, 0.8, z),
                new THREE.Vector3(0.2, 1.2, z),
            ]);
            //定义材质与生成断面线
            const crossGeometry = new THREE.TubeGeometry(path, 64, 0.002, 8, true); // 修改这里的 0.02 可以改变线的宽度
            const crossMaterial = new THREE.MeshBasicMaterial({ color: 0x27B7EE }); // 和水深一个颜色
            const crossCylinder = new THREE.Mesh(crossGeometry, crossMaterial);
            //将创建的断面线进行保存
            crossSensors.push(crossCylinder)

            sensorsInSection.forEach((sensor) => {
                /* 创建外部空心圆柱体 */
                const longGeometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 32);
                const longMaterial = new THREE.MeshBasicMaterial({ color: 0xEBF3FB, transparent: true, opacity: 0.4, depthWrite: false });
                const longCylinder = new THREE.Mesh(longGeometry, longMaterial);
                //改变空心圆柱体的位置
                longCylinder.position.x = x;
                longCylinder.position.y = yLong;
                longCylinder.position.z = z;

                /* 创建内部实体圆柱体 */
                const shortGeometry = new THREE.CylinderGeometry(0.008, 0.008, 0.05, 32);
                // 创建材质
                const shortMaterial = new THREE.MeshBasicMaterial({ color: 0x27B7EE });
                // 创建圆柱体网格
                const shortCylinder = new THREE.Mesh(shortGeometry, shortMaterial);
                //改变实心圆柱体的位置
                shortCylinder.position.x = x;
                shortCylinder.position.y = yShort;
                shortCylinder.position.z = z;

                //将测站编码与相应的实体圆柱进行绑定
                const dvcd = sensor.dvcd;
                if (!shortEntityArray[dvcd]) {
                    shortEntityArray[dvcd] = []; // 如果尚未存在，则创建一个数组
                }
                // 将实体圆柱体保存到对应的dvcd的数组中
                shortEntityArray[dvcd].push(shortCylinder);

                /* 创建内部绿色射线 */
                const path = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(x, yShort, z),
                    new THREE.Vector3(x, yShort + 0.75, z)
                ]);

                const lineGeometry = new THREE.TubeGeometry(path, 64, 0.002, 8, true); // 修改这里的 0.02 可以改变线的宽度
                const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 }); // 绿色
                const lineCylinder = new THREE.Mesh(lineGeometry, lineMaterial);

                /* 创建文字标识 */
                const textLabel = createText(group, x, labelY + 0.75, z - 0.05)

                //将测站编码与相应的标签样式进行绑定
                if (!textLabelArray[dvcd]) {
                    textLabelArray[dvcd] = [];
                }
                // 将 textLabel 保存到对应的 dvcd 的数组中
                textLabelArray[dvcd].push(textLabel);

                longSensors.push(longCylinder);
                shortSensors.push(shortCylinder);
                lineSensors.push(lineCylinder)

                x += 0.3
                labelY -= 0.2
            });
            x = 0.55
            yLong = 0.6
            yShort = 0.3
            labelY = 0.3
            z += length
        }

        return { longSensors, shortSensors, lineSensors };
    })
        .catch(error => {
            console.log(error);
        });
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

        console.log(pressData);
        console.log(textLabelArray)
        console.log(shortEntityArray)

        //定义一个对象用于保存以日期作为key，其中包括各渗压计的数值以及标注样式
        const dataPressArr = {}
        //标注文字对象与上述处理的对象通过渗压计编号进行连接，按照每个时间最为key，其中包含每个渗压计的标注样式以及渗压计数值
        for (const key in pressData) {
            const updArr = pressData[key];
            const textLabelArr = textLabelArray[key][0];
            const shortEntityArr = shortEntityArray[key][0]

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
            if (keys.length !== totalCount) {
                delete dataPressArr[date];
            }
        }
        console.log(dataPressArr)
        // 调用异步函数
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
            textLabel.updateTextLabel(pressVal)

            let height = (pressVal / 100) - 0.25

            /* 获取初始mesh的各参数 */
            const shortEntityHeight = values[upd][2].geometry.parameters.height;
            const shortEntityX = values[upd][2].position.x;
            const shortEntityY = values[upd][2].position.y;
            const shortEntityZ = values[upd][2].position.z;

            // 使用 heightDifference 计算高度差
            const geometry = new THREE.CylinderGeometry(0.008, 0.008, shortEntityHeight + height, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0x27B7EE });
            const cube = new THREE.Mesh(geometry, material);

            cube.position.x = shortEntityX;
            cube.position.y = shortEntityY + height / 2;
            cube.position.z = shortEntityZ;

            shortEntity.push(cube)
        }
        /* 将创建新的水柱进行添加，再将之前已经创建的进行删除 */
        if (shortEntity.length > 6) {
            //旧水柱
            const oldShortEntityArray = shortEntity.slice(0, 6);
            //新水柱
            const newShortEntityArray = shortEntity.slice(6)

            shortEntity.splice(0, 6);

            //遍历添加新的水柱
            newShortEntityArray.forEach((mesh) => {
                group.add(mesh);
            });

            //遍历删去旧的水柱
            oldShortEntityArray.forEach((mesh) => {
                group.remove(mesh)
            })

            //将原来存在的水柱进行移除
            if (shortSensors.length) {
                shortSensors.forEach((mesh) => {
                    group.remove(mesh)
                })
            }
        } else {
            shortEntity.forEach((mesh) => {
                group.add(mesh)
            })
        }
        // 使用setTimeout延迟5秒钟
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

//接收时间，并且发送请求获取渗水计的数值
bus.$on('dateTime', value => {
    //对选择的日期进行处理
    const result = value.map(date => {
        let d = new Date(date);
        return d.toISOString().split('T')[0];
    });
    //获取各渗压计数值
    receivePressVal('42011640018', result[0], result[1])
})


