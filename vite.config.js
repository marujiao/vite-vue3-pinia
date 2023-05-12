import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig((config) => {
  const { command } = config
  return {
    plugins: [
      vue(),
      viteMockServe({
        // 只在开发阶段开启 mock 服务
        mockPath: './src/mock',
        localEnabled: command === 'serve'
      })
    ]
  }
})