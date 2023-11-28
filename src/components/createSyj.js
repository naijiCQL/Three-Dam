/*
 * @Author: 陈巧龙
 * @Date: 2023-11-28 13:53:40
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-28 17:28:58
 * @FilePath: \three-project\src\components\createSyj.js
 * @Description: 为各个水库创建渗水计以及显示渗水计数值
 */
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

//定义数组来保存各文字标签的mesh
const textMeshArray = []

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
                size: 0.3,
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
