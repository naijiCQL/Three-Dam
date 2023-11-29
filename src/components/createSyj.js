/*
 * @Author: 陈巧龙
 * @Date: 2023-11-28 13:53:40
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-29 11:27:11
 * @FilePath: \three-project\src\components\createSyj.js
 * @Description: 为两个水库创建渗压计
 */
import * as THREE from 'three';
import store from '@/store/index'
import { getSYParams } from "@/api/home"
import { createText } from './loadTools'

//保存显示的文字对象
const textLabelArray = {}
//保存显示内部实体对象
const shortEntityArray = {}
//保存长的圆柱体
const longSensors = [];
//保存短的圆柱体
const shortSensors = []
//保存射线
const lineSensors = []
//保存断面线
const crossSensors = []

/**
 * @description: 创建杨树堰水库的渗压计三维体
 * @param {*} params
 * @param {*} group
 * @return {*}
 */
export function createPressureSensors(params, group) {
    return getSYParams(params).then(res => {
        const data = res.resultList
        //将渗压计管数量进行保存
        store.commit('updataTotalCount', res.totalCount)

        // 按照 ch 字段分组渗压计数据
        const groupedByCh = data.reduce((acc, sensor) => {
            const { mpcd, dvcd, ch } = sensor;
            if (!acc[ch]) {
                acc[ch] = [];
            }
            acc[ch].push({ mpcd, dvcd, ch }); // 只保留 mpcd、dvcd、ch 字段
            return acc;
        }, {});

        //根据横断面的数量确定各横断面的间距
        const length = Math.floor(35 / Object.keys(groupedByCh).length - 1);

        // 创建渗压计，定义基本参数
        let x = 8
        let yLong = 11
        let yShort = 11.5
        let labelY = 11.5
        let z = 22

        for (const ch in groupedByCh) {
            const sensorsInSection = groupedByCh[ch];

            // 根据 mpcd 对渗压计进行排序
            sensorsInSection.sort((a, b) => a.mpcd - b.mpcd);

            /* 创建断面线 */
            //创建断面线路径
            const path = new THREE.CatmullRomCurve3([
                new THREE.Vector3(2, 35, z),
                new THREE.Vector3(8, 19, z),
                new THREE.Vector3(14, 18.5, z),
                new THREE.Vector3(20, 18, z),
                new THREE.Vector3(23, 10, z),
                new THREE.Vector3(20, 18, z),
                new THREE.Vector3(14, 18.5, z),
                new THREE.Vector3(8, 19, z),
                new THREE.Vector3(2, 35, z),
            ]);
            //定义材质与生成断面线
            const crossGeometry = new THREE.TubeGeometry(path, 64, 0.02, 8, true); // 修改这里的 0.02 可以改变线的宽度
            const crossMaterial = new THREE.MeshBasicMaterial({ color: 0x27B7EE }); // 和水深一个颜色
            const crossCylinder = new THREE.Mesh(crossGeometry, crossMaterial);
            //将创建的断面线进行保存
            crossSensors.push(crossCylinder)

            sensorsInSection.forEach((sensor) => {
                /* 创建外部空心圆柱体 */
                const longGeometry = new THREE.CylinderGeometry(0.15, 0.15, 20, 32);
                const longMaterial = new THREE.MeshBasicMaterial({ color: 0xEBF3FB, transparent: true, opacity: 0.4, depthWrite: false });
                const longCylinder = new THREE.Mesh(longGeometry, longMaterial);
                //改变空心圆柱体的位置
                longCylinder.position.x = x;
                longCylinder.position.y = yLong;
                longCylinder.position.z = z;

                /* 创建内部实体圆柱体 */
                const shortGeometry = new THREE.CylinderGeometry(0.08, 0.08, 0.5, 32);
                // 创建材质
                const shortMaterial = new THREE.MeshBasicMaterial({ color: 0x27B7EE });
                // 创建圆柱体网格
                const shortCylinder = new THREE.Mesh(shortGeometry, shortMaterial);
                //改变实心圆柱体的位置
                shortCylinder.position.x = x;
                shortCylinder.position.y = yShort;
                shortCylinder.position.z = z;

                //将测站编码与相应的实体圆柱进行绑定
                const dvcd = sensor.dvcd;
                if (!shortEntityArray[dvcd]) {
                    shortEntityArray[dvcd] = []; // 如果尚未存在，则创建一个数组
                }
                // 将实体圆柱体保存到对应的dvcd的数组中
                shortEntityArray[dvcd].push(shortCylinder);

                /* 创建内部绿色射线 */
                const path = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(x, yShort, z),
                    new THREE.Vector3(x, yShort + 9, z)
                ]);

                const lineGeometry = new THREE.TubeGeometry(path, 64, 0.02, 8, true); // 修改这里的 0.02 可以改变线的宽度
                const lineMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 }); // 绿色
                const lineCylinder = new THREE.Mesh(lineGeometry, lineMaterial);

                /* 创建文字标识 */
                const textLabel = createText(group, x, labelY, z)

                //将测站编码与相应的标签样式进行绑定
                if (!textLabelArray[dvcd]) {
                    textLabelArray[dvcd] = [];
                }
                // 将 textLabel 保存到对应的 dvcd 的数组中
                textLabelArray[dvcd].push(textLabel);

                longSensors.push(longCylinder);
                shortSensors.push(shortCylinder);
                lineSensors.push(lineCylinder)

                x += 6
            });
            x = 8
            yLong = 11
            yShort = 11.5
            labelY = 11.5
            z += length
        }
        //将显示的文字对象进行保存
        store.commit('updateTextLabelArray', textLabelArray)
        //将显示内部实体对象进行保存
        store.commit('updateShortEntityArray', shortEntityArray)

        return { longSensors, shortSensors, lineSensors, crossSensors };
    })
        .catch(error => {
            console.log(error);
        });
}