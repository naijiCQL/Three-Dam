/*
 * @Author: 陈巧龙
 * @Date: 2023-11-10 16:27:36
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-24 14:39:36
 * @FilePath: \three-project\src\components\initScene.js
 * @Description: 初始化three的场景以及将三维物体进行添加
 */
import * as THREE from 'three';
import { riverBed, frontDam, middleDam,behindDam,tranDam ,drawLadder} from './createYsyRes'

// 创建一个组将立方体放入其中
const group = new THREE.Group();

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
    const axesHelper = new THREE.AxesHelper(500)

    scene.add(axesHelper)

    // 创建相机
    const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 5000);
    camera.position.x = -100;
    camera.position.y = 150;
    camera.position.z = 600;

    //将绘制的物体添加进场景中
    group.add(riverBed())
    group.add(frontDam())
    group.add(middleDam())
    group.add(behindDam())
    group.add(tranDam())
    group.add(drawLadder())

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
