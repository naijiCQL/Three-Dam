<!--
 * @Author: 陈巧龙
 * @Date: 2023-11-10 15:48:43
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-16 16:55:57
 * @FilePath: \three-project\src\components\HelloWorld.vue
 * @Description: 
-->
<template>
  <div id="container" ref="webgl">
  </div>
</template>

<script>
import { initScene } from "./index";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  mounted() {
    this.initThree()
  },
  methods: {
    initThree() {
      const { renderer, camera } = initScene()
      
      this.$refs.webgl.appendChild(renderer.domElement)
      // 添加轨道控制器
      new OrbitControls(camera, renderer.domElement);
    }
  }
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
}
</style>
