/*
 * @Author: 陈巧龙
 * @Date: 2023-11-12 13:51:16
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-28 17:42:05
 * @FilePath: \three-project\src\components\createYsyRes.js
 * @Description: 创建杨树堰水库三维基础模型
 */
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water2.js';
import { loadTexture } from './loadTools'

//定义几何体参数设置
const extrudeSettings = {
    steps: 1,
    depth: 60,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1
};

/**
 * @description: 创建河床
 * @return {*}
 */
export function riverBed() {
    const shape = new THREE.Shape();

    shape.moveTo(-63.02, 0);
    shape.lineTo(-63.02, 15);
    shape.lineTo(-7, 11);
    shape.lineTo(-7, 10);
    shape.lineTo(7, 10);
    shape.lineTo(7, 11);
    shape.lineTo(62, 10);
    shape.lineTo(62, 0);
    shape.moveTo(-63.02, 0);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    //大坝实体材质
    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/gravel.png', 0.1, 0.1),
    });

    const riverBed = new THREE.Mesh(extrudeGeometry, material);

    return riverBed;
}

/**
 * @description: 创建坝体（前）
 * @return {*}
 */
export function frontDam() {

    const shape = new THREE.Shape();

    shape.moveTo(-63.02, 15);
    shape.lineTo(-63.02, 20);
    shape.lineTo(-42, 20);
    shape.lineTo(-22, 27.5);
    shape.lineTo(-20, 27.5);
    shape.lineTo(-2, 35);
    shape.lineTo(-7, 11);
    shape.moveTo(-63.02, 15);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

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
export function middleDam() {
    const shape = new THREE.Shape();

    shape.moveTo(-2, 35);
    shape.lineTo(-7, 11);
    shape.lineTo(-7, 10);
    shape.lineTo(7, 10);
    shape.lineTo(7, 11);
    shape.lineTo(2, 35);
    shape.moveTo(-2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/dam.png', 0.1, 0.1),
    });

    const middleDam = new THREE.Mesh(extrudeGeometry, material);

    return middleDam;
}

/**
 * @description: 创建坝体（后）
 * @return {*}
 */
export function behindDam() {
    const shape = new THREE.Shape();

    shape.moveTo(2, 35);
    shape.lineTo(23, 21);
    shape.lineTo(62, 15);
    shape.lineTo(62, 10);
    shape.lineTo(7, 11);
    shape.moveTo(2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/floor.jpg', 0.1, 0.1),
        transparent: true, // 开启透明
        opacity: 0.4, // 设置透明度
        depthWrite: false,
    });

    const behindDam = new THREE.Mesh(extrudeGeometry, material);

    return behindDam;
}

/**
 * @description: 创建围栏
 * @return {*}
 */
export function createRail() {
    const shape = new THREE.Shape();

    shape.moveTo(-2, 35);
    shape.lineTo(-2, 36);
    shape.lineTo(-1.7, 36);
    shape.lineTo(-1.7, 35);
    shape.moveTo(-2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/wall.jpg', 0.1, 0.1),
    });

    const leftRail = new THREE.Mesh(extrudeGeometry, material);

    return leftRail;
}

/**
 * @description: 创建过道
 * @return {*}
 */
export function createCorridors() {
    const shape = new THREE.Shape();

    shape.moveTo(-2, 35);
    shape.lineTo(2, 35);
    shape.moveTo(-2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const material = new THREE.MeshBasicMaterial({
        map: loadTexture('/road.png', 0.5, 0.1),
    });

    const corridors = new THREE.Mesh(extrudeGeometry, material);

    return corridors;
}

/**
 * @description: 建造透明色大坝
 * @return {*}
 */
export function tranDam() {
    const shape = new THREE.Shape();

    shape.moveTo(-63.02, 20);
    shape.lineTo(-63.02, 33);
    shape.lineTo(-2, 33);
    shape.lineTo(-20, 27.5);
    shape.lineTo(-22, 27.5);
    shape.lineTo(-42, 20);
    shape.moveTo(-63.02, 20);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    //大坝透明材质
    const tranMaterial = new THREE.MeshBasicMaterial({
        map: loadTexture('/floor.jpg', 0.1, 0.1),
        transparent: true, // 开启透明
        opacity: 0.75, // 设置透明度
    });

    const behindDam = new THREE.Mesh(extrudeGeometry, tranMaterial);

    return behindDam;
}

/**
 * @description: 创建水体
 * @return {*}
 */
export function createWater() {
    const geometry = new THREE.CylinderGeometry(31, 31, 25, 5);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgb(74,198,237)"), transparent: true, opacity: 0.65 });
    const resWater = new THREE.Mesh(geometry, material);

    resWater.position.y = 21
    resWater.position.z = 30
    resWater.position.x = -30
    resWater.rotation.y = THREE.MathUtils.degToRad(55);

    return resWater;
}

/**
 * @description: 创建水体动态水面
 * @return {*}
 */
export function createWaterSurface() {
    const geometry = new THREE.CylinderGeometry(31, 31, 0.1, 5);
    //创建动态水面材质
    const runWaterSurface = new Water(
        geometry,
        {
            flowSpeed: 0.1,//定义流速
            color: new THREE.Color("rgb(74,198,237)"),
            normalMap0: new THREE.TextureLoader().load('/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            normalMap1: new THREE.TextureLoader().load('/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
        }
    );

    runWaterSurface.position.y = 33.6
    runWaterSurface.position.z = 30
    runWaterSurface.position.x = -30
    runWaterSurface.rotation.y = THREE.MathUtils.degToRad(55);

    return runWaterSurface;
}

/**
 * @description: 创建横截面线
 * @return {*}
 */
export function crossLine() {
    const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-39, 33.2, 1),
        new THREE.Vector3(-39, 32, 10),
        new THREE.Vector3(-39, 26, 20),
        new THREE.Vector3(-39, 23, 25),
        new THREE.Vector3(-39, 22, 30),
        new THREE.Vector3(-39, 23, 35),
        new THREE.Vector3(-39, 26, 40),
        new THREE.Vector3(-39, 32, 50),
        new THREE.Vector3(-39, 33.2, 59),
    ]);
    //定义材质与生成断面线
    const crossGeometry = new THREE.TubeGeometry(path, 64, 0.2, 8, false); // 修改这里的 0.02 可以改变线的宽度
    const crossMaterial = new THREE.MeshBasicMaterial({ color: 'black' }); // 和水深一个颜色
    const crossLine = new THREE.Mesh(crossGeometry, crossMaterial);

    return crossLine
}

/**
 * @description: 绘制后坝体
 * @return {*}
 */
export function drawLadder() {
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
        opacity: 0.8, // 设置透明度
        depthWrite: false,
    });

    const surface = new THREE.Mesh(geometry, grassMaterial);

    surface.position.y = 0.3

    return surface;
}
