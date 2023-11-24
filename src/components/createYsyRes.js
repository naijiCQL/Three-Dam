/*
 * @Author: 陈巧龙
 * @Date: 2023-11-12 13:51:16
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-24 16:41:14
 * @FilePath: \three-project\src\components\createYsyRes.js
 * @Description: 创建杨树堰水库三维模型
 */
import * as THREE from 'three';

//定义几何体参数设置
const extrudeSettings = {
    steps: 1,
    depth: 60,
    bevelThickness: 0,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1
};

//初始纹理加载器
const textureLoader = new THREE.TextureLoader();

/* 添加大坝坝体的纹理 */
const damTexture = textureLoader.load('/wood.jpg')
// 根据需要调整重复的次数。水平重复1次，垂直重复0.25次
damTexture.repeat.set(1, 1);
damTexture.wrapS = THREE.RepeatWrapping // 水平重复
damTexture.wrapT = THREE.MirroredRepeatWrapping // 垂直镜像重复

//大坝实体材质
const damMaterial = new THREE.MeshBasicMaterial({
    map: damTexture,
});

//大坝透明材质
const damTranMaterial = new THREE.MeshBasicMaterial({
    map: damTexture,
    transparent: true, // 开启透明
    opacity: 0.3, // 设置透明度
    depthWrite: false
});

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

    const riverBed = new THREE.Mesh(extrudeGeometry, damMaterial);

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

    const frontDam = new THREE.Mesh(extrudeGeometry, damMaterial);

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

    const damMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

    const middleDam = new THREE.Mesh(extrudeGeometry, damMaterial);

    // // 旋转角度转换为弧度
    // const angleInRadians = THREE.MathUtils.degToRad(270); // 如果是角度制的旋转
    // // 将对象 `middleDam` 绕 y 轴旋转 90 度
    // middleDam.rotation.x = angleInRadians;
    // middleDam.position.z = 50

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
    shape.lineTo(62, 0);
    shape.lineTo(7, 11);
    shape.moveTo(2, 35);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const behindDam = new THREE.Mesh(extrudeGeometry, damMaterial);

    return behindDam;
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

    const behindDam = new THREE.Mesh(extrudeGeometry, damTranMaterial);

    return behindDam;
}

export function drawLadder() {
    const geometry = new THREE.BufferGeometry();
    // 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
    // 因为在两个三角面片里，这两个顶点都需要被用到。
    const vertices = new Float32Array([
        23, 21, 10,
        2, 35, 10,
        2, 35, 0,

        23, 21, 10,
        2, 35, 10,
        23, 21, 30,

        2, 35, 30,
        2, 35, 10,
        23, 21, 30,

        2, 35, 30,
        2, 35, 40,
        23, 21, 30,

        23, 21, 10,
        36, 19, 15,
        23, 21, 15,

        36, 19, 15,
        23, 21, 15,
        36, 19, 25,

        23, 21, 25,
        23, 21, 15,
        36, 19, 25,

        23, 21, 25,
        23, 21, 30,
        36, 19, 25,
    ]);

    // itemSize = 3 因为每个顶点都是一个三元组。
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.MeshBasicMaterial({ color: 0x7B7E66, side: THREE.DoubleSide });

    const lines = new THREE.Mesh(geometry, material);

    lines.position.x = 0
    lines.position.y = 0.3
    lines.position.z = 10

    return lines;
}
