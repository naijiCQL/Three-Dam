/*
 * @Author: 陈巧龙
 * @Date: 2023-11-28 11:04:04
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-29 17:02:00
 * @FilePath: \three-project\src\components\loadTools.js
 * @Description: 加载three.js模型的方法
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

//初始纹理加载器
const textureLoader = new THREE.TextureLoader();
//定义数组来保存各文字标签的mesh
const textMeshArray = []
/**
 * @description: 添加图片作为纹理
 * @param {*} path
 * @param {*} num1
 * @param {*} num2
 * @return {*}
 */
export function loadTexture(path, num1, num2) {
    const texture = textureLoader.load(path)
    // 根据需要调整重复的次数。
    texture.repeat.set(num1, num2);
    texture.wrapS = THREE.RepeatWrapping // 水平重复
    texture.wrapT = THREE.MirroredRepeatWrapping // 垂直镜像重复

    return texture
}

/**
 * @description:  添加3Dgltf模型
 * @param {*} modelPath
 * @param {*} position
 * @param {*} scale
 * @return {*}
 */
function loadGLTFModel(modelPath, position, scale) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(modelPath, function (gltf) {
            gltf.scene.scale.copy(scale);

            gltf.scene.position.copy(position); // 设置树木的位置

            //解决gltf模型加载出来无颜色的问题
            gltf.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.frustumCulled = false;
                    child.castShadow = true;
                    child.material.emissive = child.material.color;
                    child.material.emissiveMap = child.material.map;
                }
            });
            resolve(gltf.scene); // 成功加载，将gltf.scene作为Promise的结果返回
        }, undefined, function (error) {
            reject(error); // 加载失败，将错误信息作为Promise的reject返回
        });
    });
}

/**
 * @description: 创建函数来加载树木模型并将其添加到指定组中
 * @param {*} modelPath
 * @param {*} positions
 * @param {*} scale
 * @param {*} group
 * @return {*}
 */
export function loadAndAddTreeModels(modelPath, positions, scale, group) {
    positions.forEach(position => {
        loadGLTFModel(modelPath, position, scale)
            .then((scene) => {
                group.add(scene); // 将加载的scene添加到指定的group中
            })
            .catch((error) => {
                console.error('Error loading GLTF model:', error); // 加载失败的处理
            });
    });
}
/**
 * @description: 创建文字标注并且可修改文字标注内容
 * @param {*} group
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @return {*}
 */
export function createText(group, x, y, z) {
    let textMesh = null;

    const loader = new FontLoader();

    loader.load('/SimHei_Regular.json', function (font) {

        const textGeometry = new TextGeometry(``, {
            font: font,
            size: 0.1,
            height: 0,
            curveSegments: 12,
            bevelEnabled: false,
            bevelThickness: 0,
            bevelSize: 0,
        });

        // 创建文字材质
        const textMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        // 创建文字网格
        textMesh = new THREE.Mesh(textGeometry, textMaterial);

        // 设置文字的位置
        textMesh.position.set(x, y, z);
        // 将文本网格绕 Y 轴旋转 90 度
        textMesh.rotateY(Math.PI / 2);

        group.add(textMesh)
    });

    // 实时更新标签内容和位置
    function updateTextLabel(newH, totalCount) {

        loader.load('/SimHei_Regular.json', function (font) {

            let updatedText = null;

            if (newH) {
                updatedText = `渗压计高度:${newH.toFixed(3)}m`;
            } else {
                updatedText = `渗压计高度:${newH}m`;
            }

            const textGeometry = new TextGeometry(updatedText, {
                font: font,
                size: 0.6,
                height: 0,
                curveSegments: 12,
                bevelEnabled: false,
                bevelThickness: 0,
                bevelSize: 0,
            });

            // 创建文字材质
            const textMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
            // 创建文字网格
            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            //将mesh进行保存
            textMeshArray.push(textMesh)
            // 设置文字的位置
            textMesh.position.set(x, y, z);
            // 将文本网格绕 Y 轴旋转 90 度
            textMesh.rotateY(Math.PI / 2);

            //为了避免切换时会出现闪烁，先加载再进行删除
            if (textMeshArray.length > 0) {
                group.add(textMeshArray[textMeshArray.length - 1])

                // 当数组长度达到第7组时，删除前六组
                if (textMeshArray.length === totalCount + 1) {
                    const newTextMeshArray = textMeshArray.slice(0, totalCount);
                    textMeshArray.splice(0, totalCount);
                    newTextMeshArray.forEach((mesh) => {
                        group.remove(mesh)
                    })
                }
            } else {
                group.add(textMeshArray[0])
            }
        });
    }

    return { updateTextLabel };
}