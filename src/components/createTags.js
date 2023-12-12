import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

/**
 * @description: 创建一个html标签并且设置其样式
 * @param {*} text
 * @param {*} url
 * @param {*} x
 * @param {*} y
 * @param {*} z
 * @return {*}
 */
export function tag(text, url, x, y, z) {
    const div = document.createElement('div');
    div.className = 'label'
    div.style.color = 'white';
    div.style.fontSize = '14px';
    div.style.width = '15%'
    div.style.height = '10%'
    div.style.position = 'absolute';

    // 创建并配置 span 元素
    const span = document.createElement('span');
    span.textContent = text; // 替换为你的实际文本

    span.style.marginLeft = '45%'
    div.style.paddingTop = '3px'

    // 将 span 添加到 div 中
    div.appendChild(span);

    // 设置背景图片
    div.style.backgroundImage = `url(${url})`;
    div.style.backgroundSize = '100% 100%';  // 可选，设置背景图片大小适应元素
    // div元素包装成为css2模型对象CSS2DObject
    const label = new CSS2DObject(div);
    //避免HTML标签遮挡三维场景的鼠标事件
    div.style.pointerEvents = 'none';
    // 设置HTML元素标签在three.js世界坐标中位置
    label.position.set(x, y, z);

    return label;
}