<!--
 * @Author: 陈巧龙
 * @Date: 2023-11-10 15:48:43
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-20 16:51:54
 * @FilePath: \three-project\src\components\HelloWorld.vue
 * @Description: 
-->
<template>
  <div class="main">
    <div id="container" ref="webgl">
    </div>
    <div class="control">
      <div class="block">
        <span class="demonstration">日期：</span>
        <el-date-picker v-model="value1" type="daterange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" size="small">
        </el-date-picker>
      </div>
      <div class="select-button">
        <el-button type="primary" icon="el-icon-search" size="small" @click="select">查询</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { initScene } from "./index";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import bus from '@/utils/bus'
export default {
  data() {
    return {
      value1: '',
    };
  },
  mounted() {
    this.initThree()
  },
  methods: {
    //初始化three场景
    initThree() {
      const { renderer, camera } = initScene()

      this.$refs.webgl.appendChild(renderer.domElement)
      // 添加轨道控制器
      new OrbitControls(camera, renderer.domElement);
    },
    //通过日期进行查询
    select() {
      bus.$emit('dateTime', this.value1);
    }
  }
}
</script>

<style scoped>
.main {
  width: 100%;
  height: 100vh;
}

#container {
  width: 100%;
  height: 100%;
}

.control {
  position: absolute;
  display: flex;
  top: 3%;
  right: 3%;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
}

.demonstration {
  margin-left: 5px;
  font-size: 15px;              
}

.select-button {
  margin-left: 7px;
}
</style>
