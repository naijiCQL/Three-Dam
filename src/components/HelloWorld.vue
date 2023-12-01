<!--
 * @Author: 陈巧龙
 * @Date: 2023-11-10 15:48:43
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-12-01 11:40:13
 * @FilePath: \three-project\src\components\HelloWorld.vue
 * @Description: 
-->
<template>
  <div class="main">
    <div id="container" ref="webgl">
    </div>
    <div class="control">
      <div style="margin: 5px;">
        <span class="demonstration">水库：</span>
        <el-select v-model="value" placeholder="请选择" size="small" @change="selectRes">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div style="margin: 5px;">
        <span class="demonstration">日期：</span>
        <el-date-picker v-model="formInline.value1" type="daterange" range-separator="至" start-placeholder="开始日期"
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
import bus from '@/utils/bus'
import store from '@/store/index'
import { Message } from 'element-ui';
import { initScene } from "./initScene";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";  // 导入轨道控制器

export default {
  data() {
    return {
      formInline: {
        value1: this.getDateTime() //methods优先级高于data  (props==>methods==>data==>computed==>watch)
      },
      options: [{
        value: '42128140006',
        label: '金盆水库'
      },
      {
        value: '42011640018',
        label: '杨树堰水库'
      }],
      value: '',
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
      if (!store.state.totalCount) {
        Message.error('请等待渗压计模型添加！');
      } else {
        bus.$emit('dateTime', this.formInline.value1);
      }
    },
    //设置默认显示的时间
    getDateTime() {
      let endDate = new Date();
      // 获取当前日期的时间戳
      let currentTime = endDate.getTime();
      // 计算七天前的时间戳（毫秒为单位）
      let sevenDays = currentTime - 7 * 24 * 60 * 60 * 1000;
      // 创建七天前的日期对象
      let sevenDaysAgoDate = new Date(sevenDays);

      return [sevenDaysAgoDate.getTime(), endDate.getTime()];
    },
    //选择水库，并将水库编码进行传输
    selectRes() {
      this.$store.commit('updateResCode', this.value)
      bus.$emit('resCode', this.value);
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
  top: 2%;
  right: 1%;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
  flex-direction: column;
}

.demonstration {
  margin: 5px;
  font-size: 15px;

}

.select-button {
  margin: 5px;
  display: flex;
  justify-content: center;
  /* 在水平方向上居中对齐 */
}
</style>
