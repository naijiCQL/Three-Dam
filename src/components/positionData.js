/*
 * @Author: 陈巧龙
 * @Date: 2023-11-28 14:13:54
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-28 14:16:10
 * @FilePath: \three-project\src\components\positionData.js
 * @Description: 保存各gltf的位置数据
 */

import * as THREE from 'three';

//定义树1gltf模型的位置
const tree1Positions = [
    new THREE.Vector3(30, 20, 15),
    new THREE.Vector3(30, 20, 45),
    new THREE.Vector3(55, 16, 55),
    new THREE.Vector3(55, 16, 42),
    new THREE.Vector3(55, 16, 20),
    new THREE.Vector3(55, 16, 30),
    new THREE.Vector3(55, 16, 10),
];

//定义树2gltf模型的位置
const tree2Positions = [
    new THREE.Vector3(43, 18, 50),
    new THREE.Vector3(43, 18, 30),
    new THREE.Vector3(43, 18, 13),
];

//定义树1gltf模型的位置
const tree3Positions = [
    new THREE.Vector3(7, 31, 10),
    new THREE.Vector3(7, 31, 50),
    new THREE.Vector3(7, 31, 5),
    new THREE.Vector3(7, 31, 55),
    new THREE.Vector3(13, 28, 3),
    new THREE.Vector3(13, 28, 8),
    new THREE.Vector3(13, 28, 13),
    new THREE.Vector3(13, 28, 48),
    new THREE.Vector3(13, 28, 53),
    new THREE.Vector3(13, 28, 58),
];

export function getTreePosition1() {
    return tree1Positions
}

export function getTreePosition2() {
    return tree2Positions
}

export function getTreePosition3() {
    return tree3Positions
}

