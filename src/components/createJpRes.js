/*
 * @Author: 陈巧龙
 * @Date: 2023-11-29 14:12:15
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-29 16:56:37
 * @FilePath: \three-project\src\components\createJpRes.js
 * @Description: 创建金盆水库三维基础模型
 */
import * as THREE from 'three';
import { loadTexture } from './loadTools'

/**
 * @description: 定义几何体参数设置
 * @param {*} depth
 * @return {*}
 */
function extrudeSettings(depth) {
    const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelThickness: 0,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1
    }

    return extrudeSettings
}

/**
 * @description: 创建河床
 * @return {*}
 */
export function jpRiverBed() {
    const shape = new THREE.Shape();

    shape.moveTo(-100, 0);
    shape.lineTo(-100, 15);
    shape.lineTo(-7, 11);
    shape.lineTo(-7, 10);
    shape.lineTo(7, 10);
    shape.lineTo(7, 11);
    shape.lineTo(62, 10);
    shape.lineTo(62, 0);
    shape.moveTo(-100, 0);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings(212));
    //大坝实体材质
    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/gravel.png', 0.1, 0.1),
    });

    const riverBed = new THREE.Mesh(extrudeGeometry, material);

    riverBed.position.z = -62

    return riverBed;
}

/**
 * @description: 创建坝体（前）
 * @return {*}
 */
export function jpFrontDam() {

    const shape = new THREE.Shape();

    shape.moveTo(-100, 15);
    shape.lineTo(-100, 20);
    shape.lineTo(-42, 20);
    shape.lineTo(-22, 27.5);
    shape.lineTo(-20, 27.5);
    shape.lineTo(-2, 35);
    shape.lineTo(-7, 11);
    shape.moveTo(-100, 15);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings(150));

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/floor.jpg', 0.1, 0.1),
    });

    const frontDam = new THREE.Mesh(extrudeGeometry, material);

    return frontDam;
}

/**
 * @description: 创建坝体（中）
 * @return {*}
 */
export function jpMiddleDam(depth, picture, z, rotation) {
    const shape = new THREE.Shape();

    shape.moveTo(-2, 35);
    shape.lineTo(-7, 11);
    shape.lineTo(-7, 10);
    shape.lineTo(7, 10);
    shape.lineTo(7, 11);
    shape.lineTo(2, 35);
    shape.moveTo(-2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings(depth));

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture(picture, 0.1, 0.1),
    });

    const middleDam = new THREE.Mesh(extrudeGeometry, material);

    // 将 middleDam 对象绕 Y 轴进行旋转
    middleDam.rotation.y = THREE.MathUtils.degToRad(rotation);

    middleDam.position.z = z

    return middleDam;
}

/**
 * @description: 创建坝体（后透明）
 * @return {*}
 */
export function jpBehindDam(depth, isTrue, z, rotation, x) {
    const shape = new THREE.Shape();

    shape.moveTo(2, 35);
    shape.lineTo(23, 21);
    shape.lineTo(62, 15);
    shape.lineTo(62, 10);
    shape.lineTo(7, 11);
    shape.moveTo(2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings(depth));

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/floor.jpg', 0.1, 0.1),
        transparent: isTrue, // 开启透明
        opacity: 0.4, // 设置透明度
        depthWrite: false,
    });

    const behindDam = new THREE.Mesh(extrudeGeometry, material);

    behindDam.position.z = z
    // 将 middleDam 对象绕 Y 轴进行旋转
    behindDam.rotation.y = THREE.MathUtils.degToRad(rotation);
    behindDam.position.x = x

    return behindDam;
}
/**
 * @description: 创建围栏
 * @return {*}
 */
export function jpCreateRail(depth, rotation,z) {
    const shape = new THREE.Shape();

    shape.moveTo(-2, 35);
    shape.lineTo(-2, 36);
    shape.lineTo(-1.7, 36);
    shape.lineTo(-1.7, 35);
    shape.moveTo(-2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings(depth));

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/wall.jpg', 0.1, 0.1),
    });

    const leftRail = new THREE.Mesh(extrudeGeometry, material);

    leftRail.rotation.y = THREE.MathUtils.degToRad(rotation);
    leftRail.position.z=z

    return leftRail;
}

/**
 * @description: 创建过道
 * @return {*}
 */
export function jpCreateCorridors(depth, rotation) {
    const shape = new THREE.Shape();

    shape.moveTo(-2, 35);
    shape.lineTo(2, 35);
    shape.moveTo(-2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings(depth));

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/road.png', 0.5, 0.1),
    });

    const corridors = new THREE.Mesh(extrudeGeometry, material);

    corridors.rotation.y = THREE.MathUtils.degToRad(rotation);

    return corridors;
}


/**
 * @description: 绘制后坝体
 * @return {*}
 */
export function jpDrawLadder() {
    const geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        2, 35, 10,
        23, 21, 20,
        23, 21, 40,
        2, 35, 50,

    ]);

    // itemSize = 3 因为每个顶点都是一个三元组。
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const indexs = new Uint16Array([
        0, 1, 2,
        0, 2, 3,
    ]);

    //设置画面的索引
    geometry.index = new THREE.BufferAttribute(indexs, 1);

    const uvs = new Uint16Array([
        0, 1,
        1, 1,
        1, 0,
        0, 0,
    ]);
    //设置UV
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));

    const grassMaterial = new THREE.MeshBasicMaterial({
        map: loadTexture('/dam.png', 4, 4),
        vertexColors: THREE.VertexColors, //使用缓存中的颜色
        side: THREE.DoubleSide,
        transparent: true, // 开启透明
        opacity: 0.7, // 设置透明度
        depthWrite: false,
    });

    const surface = new THREE.Mesh(geometry, grassMaterial);

    surface.position.y = 0.3

    return surface;
}
