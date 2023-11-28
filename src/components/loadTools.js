/*
 * @Author: 陈巧龙
 * @Date: 2023-11-28 11:04:04
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-28 11:05:58
 * @FilePath: \three-project\src\components\loadTools.js
 * @Description: 加载three.js模型的方法
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

//初始纹理加载器
const textureLoader = new THREE.TextureLoader();
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
export function loadGLTFModel(modelPath, position, scale) {
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