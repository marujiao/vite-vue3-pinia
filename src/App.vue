<script setup>
import { reactive } from 'vue'
import useUserStore from "./store/user"

const userData = reactive({
  username: '',
  password: '',
})

// 实例化 store
const userStore = useUserStore()

const onLogin = async () => {
  // 使用 actions，当作函数一样直接调用
  // login action 定义为了 async 函数，所以它返回一个 Promise
  await userStore.login(userData)
  userData.username = ''
  userData.password = ''
}

const onLogout = () => {
  userStore.logout()
}
</script>
<template>
  <div>
    <!-- state：通过 store 直接访问 -->
    <template v-if="userStore.token">
      {{ userStore.hello }}
      <br />
      <el-button @click="onLogout">退 出</el-button>
    </template>
    <template v-else>
      <el-form label-width="120px">
        <el-form-item label="用户名:">
          <el-input v-model="userData.username" />
        </el-form-item>
        <el-form-item label="密码:">
          <el-input v-model="userData.password" type="password" />
        </el-form-item>
      </el-form>
      <el-button @click="onLogin">登 录</el-button>
    </template>
  </div>
</template>