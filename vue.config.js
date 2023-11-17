/*
 * @Author: 陈巧龙
 * @Date: 2023-11-10 15:48:43
 * @LastEditors: 陈巧龙
 * @LastEditTime: 2023-11-15 13:49:04
 * @FilePath: \three-project\vue.config.js
 * @Description: 
 */
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: true, //关闭sourcemap
  chainWebpack: (config) => {
    //添加部分webpack设置
    // title修改
    config.plugin("html").tap((args) => {
      args[0].title = " ";
      return args;
    });
    // 路径别名添加
    config.resolve.alias
      .set("components", "@/components")
      .set("assets", "@/assets")
      .set("utils", "@/utils")
      .set("api", "@/api");
  },
  outputDir: "dist",
  assetsDir: "./static",
  configureWebpack: {
    output: {
      sourcePrefix: " ",
    },
    amd: {
      toUrlUndefined: true,
    },
  },
  devServer: {
    historyApiFallback: {
      index: "dist/index.html", //与output的publicPath
    },
    proxy: {
      "/api/list": {
        target: 'https://sk.hubeishuiyi.cn/services/1234567890ABCDEFGHIJKLMN/dsm_spg_spprmp_list/api',
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api/list': ''
        }
      },
      "/api/press": {
        target: 'https://sk.hubeishuiyi.cn/services/1234567890ABCDEFGHIJKLMN/press/analyze/v1/api',
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/api/press': ''
        }
      },
    },
  },
})
