<!--
 * @Author: 陈巧龙
 * @Date: 2023-11-10 15:48:43
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-13 15:29:52
 * @FilePath: \three-project\src\App.vue
 * @Description: 
-->
<template>
  <div id="app">
    <HelloWorld />
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style >
#app {
  overflow: hidden;
  height: 100%;
  width: 100%;
}

body {
  padding: 0;
  margin: 0;
}
</style>
