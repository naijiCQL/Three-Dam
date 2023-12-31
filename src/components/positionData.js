/*
 * @Author: 陈巧龙
 * @Date: 2023-11-28 14:13:54
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-12-01 09:13:48
 * @FilePath: \three-project\src\components\positionData.js
 * @Description: 保存各gltf的位置数据
 */
import * as THREE from 'three';

//定义树1gltf模型的位置
const tree1Positions = [
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

/**
 * @description: 批量规则生成树模型位置
 * @param {*} x
 * @param {*} y
 * @param {*} intervals
 * @param {*} start
 * @param {*} end
 * @return {*}
 */
function getTreePositions(x, y, intervals, start, end) {
    const result = []
    //根据坐标的正负进行判断
    if (start > end) {
        for (let i = start; i >= end; i -= intervals) {
            const element = new THREE.Vector3(x, y, i);
            result.push(element)
        }
    } else {
        for (let i = start; i <= end; i += intervals) {
            const element = new THREE.Vector3(x, y, i);
            result.push(element)
        }
    }
    return result
}

export function getTreePosition1() {
    return tree1Positions
}

export function getTreePosition2() {
    return tree2Positions
}

export function getTreePosition3() {
    return tree3Positions
}

//定义树1gltf模型的位置
const tree4Positions = [];

/**
 * @description: 导出金盆水库的gltf装饰模型
 * @return {*}
 */
export function getTreePosition4() {

    getTreePositions(7, 31, 5, -5, -55).forEach((e) => {
        tree4Positions.push(e)
    })

    getTreePositions(13, 28, 5, -10, -50).forEach((e) => {
        tree4Positions.push(e)
    })

    getTreePositions(18, 26, 5, -20, -40).forEach((e) => {
        tree4Positions.push(e)
    })

    getTreePositions(25, 24, 5, -25, -35).forEach((e) => {
        tree4Positions.push(e)
    })

    return tree4Positions
}

