import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // 跨域
  // server:{
  //   proxy:{
  //     '/api':{//获取路径中包含了/api的请求
  //       target:'https://localhost:8011',//后台服务所在的源
  //       changeOrigin: true,//修改源
  //       secure: false,//https
  //       rewrite:(path)=>path.replace(/^\/api/,'')//'/api'替换为''
  //    }
  //   },
  // }
})
