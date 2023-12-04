/*
 * @Author: 陈巧龙
 * @Date: 2023-12-01 17:21:52
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-12-02 21:09:58
 * @FilePath: \three-project\src\components\createBall.js
 * @Description: 添加地球模型
 */
import * as THREE from 'three';

/**
 * @description: 构建地球模型
 * @return {*}
 */
export function initBall(group) {
    // 纹理贴图
    let textureLoader = new THREE.TextureLoader();
    //加载纹理
    textureLoader.load('/map.jpg', function (texture) {
        // 创建球
        let geometry = new THREE.SphereGeometry(40, 100, 100);
        //设置颜色贴图属性值
        let material = new THREE.MeshBasicMaterial({
            map: texture,
        });
        //网格模型对象Mesh
       let mesh = new THREE.Mesh(geometry, material);
        // 唯一标识
        mesh.name = "ballMain";
        // 添加到场景中
        group.add(mesh);
    });
}