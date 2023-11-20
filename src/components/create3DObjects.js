/*
 * @Author: 陈巧龙
 * @Date: 2023-11-12 13:51:16
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-17 15:06:41
 * @FilePath: \three-project\src\components\create3DObjects.js
 * @Description: 创建三维坝体与水面
 */
import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water2.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

//定义数组来保存各文字标签的mesh
const textMeshArray = []

//定义几何体参数设置
const extrudeSettings = {
    steps: 1,
    depth: 1,
    bevelThickness: 1,
    bevelSize: 0,
    bevelOffset: 0,
    bevelSegments: 1
};

//初始纹理加载器
const textureLoader = new THREE.TextureLoader();

/* 添加大坝坝体的纹理 */
const damTexture = textureLoader.load('/floor.jpg')
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
    opacity: 0.6, // 设置透明度
    depthWrite: false
});

/* 添加围墙的纹理 */
const woodTexture = textureLoader.load('/wall.jpg')

woodTexture.repeat.set(2, 1);
woodTexture.wrapS = THREE.RepeatWrapping // 水平重复
woodTexture.wrapT = THREE.MirroredRepeatWrapping // 垂直镜像重复

const woodMaterial = new THREE.MeshBasicMaterial({
    map: woodTexture,
});

/**
 * @description: 创建河床
 * @return {*}
 */
export function createWall() {
    const shape = new THREE.Shape();
    shape.moveTo(-4, 0);
    shape.lineTo(-4, 0.25);
    shape.lineTo(2, 0.25);
    shape.lineTo(2, 0);
    shape.moveTo(-4, 0);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const sideWall = new THREE.Mesh(extrudeGeometry, damMaterial);

    return sideWall;
}

/**
 * @description: 创建大坝(实体)，存储水的一面
 * @return {*}
 */
export function createDam() {
    const shape = new THREE.Shape();
    shape.moveTo(-2, 0.25);
    shape.lineTo(-0.2, 1.2);
    shape.lineTo(0.2, 1.2);
    shape.lineTo(0.2, 0.25)
    shape.moveTo(-2, 0.25);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const sideWall = new THREE.Mesh(extrudeGeometry, damMaterial);

    return sideWall;
}

/**
 * @description: 创建大坝（透明），放置渗压计的一面
 * @return {*}
 */
export function createTranDam() {
    const shape = new THREE.Shape();
    shape.moveTo(0.2, 1.2);
    shape.lineTo(0.5, 1);
    shape.lineTo(0.65, 1);
    shape.lineTo(0.75, 0.8);
    shape.lineTo(0.9, 0.8);
    shape.lineTo(1, 0.6);
    shape.lineTo(2, 0.6);
    shape.lineTo(2, 0.25);
    shape.lineTo(0.2, 0.25)
    shape.moveTo(0.2, 1.2);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const sideWall = new THREE.Mesh(extrudeGeometry, damTranMaterial);

    return sideWall;
}

//创建水体
export function createWater() {
    const shape = new THREE.Shape();
    shape.moveTo(-4, 0.25);
    shape.lineTo(-4, 0.87);
    shape.lineTo(-0.8, 0.87);
    shape.lineTo(-2, 0.25);
    shape.moveTo(-4, 0.25);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color("rgb(74,198,237)"), transparent: true, opacity: 0.65 });

    const sideWall = new THREE.Mesh(extrudeGeometry, material);

    return sideWall;
}
/**
 * @description: 创建水体动态水面
 * @return {*}
 */
export function createWaterSurface() {
    const shape = new THREE.Shape();

    shape.moveTo(-4, 0.87);
    shape.lineTo(-0.8, 0.87);
    shape.moveTo(-4, 0.87);

    const extrudeGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    //创建动态水面材质
    const sideWall = new Water(
        extrudeGeometry,
        {
            flowSpeed: 0.25,//定义流速
            color: new THREE.Color("rgb(74,198,237)"),
            normalMap0: new THREE.TextureLoader().load('/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            normalMap1: new THREE.TextureLoader().load('/waternormals.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
        }
    );
    return sideWall;
}

/**
 * @description: 创建左边围墙
 * @return {*}
 */
export function createLeftWall() {
    const shape = new THREE.Shape();

    shape.moveTo(-0.2, 1.2);
    shape.lineTo(-0.2, 1.3);
    shape.lineTo(-0.18, 1.3);
    shape.lineTo(-0.18, 1.2);
    shape.moveTo(-0.2, 1.2);

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const leftWall = new THREE.Mesh(geometry, woodMaterial);

    return leftWall
}

/**
 * @description: 创建右边围墙
 * @return {*}
 */
export function createRightWall() {
    const shape = new THREE.Shape();

    shape.moveTo(0.2, 1.2);
    shape.lineTo(0.2, 1.3);
    shape.lineTo(0.18, 1.3);
    shape.lineTo(0.18, 1.2);
    shape.moveTo(0.2, 1.2);

    //挤压缓冲几何体参数设置
    const extrudeSettings = {
        steps: 1,
        depth: 0.8,
        bevelThickness: 1,
        bevelSize: 0,
        bevelOffset: 0,
        bevelSegments: 1
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const rightWall = new THREE.Mesh(geometry, woodMaterial);

    return rightWall
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
            size: 0.03,
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
    function updateTextLabel(newH) {

        loader.load('/SimHei_Regular.json', function (font) {

            let updatedText = null;

            if (newH) {
                updatedText = `渗压计高度:${newH.toFixed(3)}m`;
            } else {
                updatedText = `渗压计高度:${newH}m`;
            }

            const textGeometry = new TextGeometry(updatedText, {
                font: font,
                size: 0.03,
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
                if (textMeshArray.length === 7) {
                    const newTextMeshArray = textMeshArray.slice(0, 6);
                    textMeshArray.splice(0, 6);
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