# Pinia

> Pinia 是 Vue 的存储库，是一个全新的状态管理库

# 优势

1. 支持 Vue2，Vue3，TS
2. 抛弃传统的`Mutation`，简化了数据流转过程，只有`store，state,getters,actuibs`四个核心概念
3. 不需要嵌套模块，符合 Vue3 的 Composition api，让代码扁平化
4. 代码简洁，代码自动分割

# 基本使用

**初始化项目**：

```shell
npm init vite@latest
```

**安装 Pinia**：

```shell
yarn add pinia
# 或者使用 npm
npm install pinia
```

**挂载 Pinia**:

```js
// src/main.js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");
```

# Store

## 什么是 Store？

> 一个 Store 是一个实体，换句话来说它托管全局状态，它始终存在且每个人都可以读取和写入组件，它有三个概念 state、getters 和 actions。

## 什么时候用 Store？

> 存储应该包含可以在整个应用程序中访问的数据，比如导航栏中显示用户信息，需要通过页面保留的数据，一个复杂的多步骤表格等等

## 定义一个 Store

> _defineStore()_ 第一个参数是 _storeId_ ，第二个参数是一个选项对象

```js
//src/store/index.js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

> 也可以使用以下方法，第二个参数传入一个函数来定义 Store

```js
//src/store/index.js
import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});
```

## 使用 Store

```js
//src/components/HelloWorld.vue
<script setup>
import { useCounterStore } from '../store/index'

const counterStore = useCounterStore()

// 以下三种方式都会被devtools跟踪
counterStore.count++
counterStore.$patch({ count: counterStore.count + 1 })
counterStore.increment()
</script>

<template>
  <div>count is :{{ counterStore.count }}</div>
  <div>doubleCount is :{{ counterStore.doubleCount }}</div>
</template>

<style scoped></style>

```

# State

> State 是 Store 的核心部分

## 解构 Store

> store 是一个用 _reactive_ 包裹的对象，如果直接解构会失去响应性。我们可以使用 _storeToRefs()_ 对其进行解构

```js
//src/components/Deconstruction.vue
<script setup>
import { storeToRefs } from "pinia";
import { useCounterStore } from "../store/index"

const counterStore = useCounterStore()
const { count, doubleCount } = storeToRefs(counterStore)
</script>
<template>
    <div>count is :{{ count }}</div>
    <div>doubleCount is : {{ doubleCount }}</div>
</template>
<style scoped lang='less'></style>
```

## 修改 Store

> 除了可以直接用 store.count++来修改 store，还可以调用`$patch`方法进行修改，`$patch`性能更高，还可以同时修改多个状态

```js
//src/components/UpdateStore.vue
<script setup>
import { storeToRefs } from 'pinia';
import { useCounterStore } from '../store/index';

const counterStore = useCounterStore()
counterStore.$patch({
    count:counterStore.count+1,
    name:'Miruna'
})
const {count,name} = storeToRefs(counterStore)
</script>

<template>
  <div>count is :{{ count }}</div>
  <div>name is :{{ name }}</div>
</template>

<style scoped lang='less'>
</style>
```

![image-20230511111803005](/Users/miruna/Documents/study/Vue/images/image-20230511111803005.png)

## 重置 Store

> 可以通过调用 store 上的`$reset`方法将状态重置到初始值

```js
<script setup>
  import {storeToRefs} from 'pinia'; import {useCounterStore} from
  '../store/index'; const counterStore = useCounterStore() counterStore.$reset()
</script>
```

## 监听 Store

> 通过`$subscribe()`监听 Store 状态的变化，与`Watch()`相比，使用`$subscribe()`的优势是 Store 多个状态发生变化后回调函数只会执行一次。

```js
import { createApp } from "vue";
import { watch } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";

const pinia = createPinia();

watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将所有 state 持久化到本地存储
    localStorage.setItem("piniaState", JSON.stringify(state));
  },
  { deep: true }
);

const app = createApp(App);

app.use(pinia);
app.mount("#app");
```

# Getters

> Getter 完全等同于 Store 状态的计算值

## 访问 Store 实例

```js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 0 }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

## 访问其他 store 的 getter

```js
import { defineStore } from "pinia";
import { useCartStore } from "./usecartStore";

export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 0 }),
  // 访问其他getter
  getters: {
    composeGetter(state) {
      const otherStore = useCartStore();
      return state.count + otherStore.count;
    },
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
```

## 将参数传递给 getter

```js
//src/store/user.js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [
      { id: 1, name: "Tom" },
      { id: 2, name: "Jack" },
    ],
  }),
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId);
    },
  },
});
```

```js
//src/components/SendGetters.vue
<script setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '../store/user'

const userStore = useUserStore()
const { getUserById } = storeToRefs(userStore)
</script>

<template>
    <p>User: {{ getUserById(2) }}</p>
</template>
```

> `注意：如果这样使用，getter 不会缓存，它只会当作一个普通函数使用。一般不推荐这种用法，因为在组件中定义一个函数，可以实现同样的功能。`

# Actions

> Actions 相当于组件中的 [methods](https://v3.vuejs.org/guide/data-methods.html#methods)。 它们可以使用 `defineStore()` 中的 `actions` 属性定义

## 访问 Store 实例

```js
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({ userData: null }),
  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password });
      } catch (error) {
        return error;
      }
    },
  },
});
```

## 访问其他 Store 的 action

```js
import { defineStore } from "pinia";
import { useAuthStore } from "./authStore";

export const useSettingStore = defineStore("setting", {
  state: () => ({ preferences: null }),
  actions: {
    async fetchUserPreferences(preferences) {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated()) {
        this.preferences = await fetchPreferences();
      } else {
        throw new Error("User must be authenticated!");
      }
    },
  },
});
```

# Plugins

> 由于是底层 API，Pania Store 可以完全扩展。 以下是可以执行的操作列表：
>
> - 向 Store 添加新属性
> - 定义 Store 时添加新选项
> - 为 Store 添加新方法
> - 包装现有方法
> - 更改甚至取消操作
> - 实现本地存储等副作用
> - **仅**适用于特定 Store

## 使用方法

> Pinia 插件是一个函数，接受一个可选`context`，`context` 包含四个属性：_app_ 实例、_pinia_ 实例、当前 _store_ 和选项对象。函数也可以返回一个对象，对象的属性和方法会分别添加到 state 和 actions 中。

```js
export function myPiniaPlugin(context) {
  context.app; // 使用 createApp() 创建的 app 实例（仅限 Vue 3）
  context.pinia; // 使用 createPinia() 创建的 pinia
  context.store; // 插件正在扩展的 store
  context.options; // 传入 defineStore() 的选项对象（第二个参数）
  // ...
  return {
    hello: "world", // 为 state 添加一个 hello 状态
    changeHello() {
      // 为 actions 添加一个 changeHello 方法
      this.hello = "pinia";
    },
  };
}
```

```js
// src/main.js
import { createPinia } from "pinia";

const pinia = createPinia();
pinia.use(myPiniaPlugin);
```

## 向 Store 添加新状态

```js
//通过返回一个对象来为每个store添加状态
pinia.use(() => ({ hello: "Pinia" }));

// 直接在store上设置属性添加状态
import { ref, toRef } from "vue";
pinia.use(({ store }) => {
  const hello = ref("word");
  store.$state.hello = hello; //为了可以在devtools中使用
  store.hello = toRef(store.$state, "hello");
});

//也可以在use方法外面定义一个状态，共享全局的ref或computed
import { ref } from "vue";
const globalSecret = ref("secret");
pinia.use(({ store }) => {
  store.$state.secret = globalSecret;
  store.secret = globalSecret;
});
```

## 定义 Store 时添加新选项

添加一个*debounce*选项，允许对所有操作进行防抖`

```js
import { defineStore } from "pinia";
export const useSearchStore = defineStore("search", {
  actions: {
    searchContacts() {},
    searchContent() {},
  },
  debounce: {
    searchContacts: 300,
    searchContent: 500,
  },
});
```

```js
// src/main.js
import { createPinia } from "pinia";
import { debounce } from "lodash";

const pinia = createPinia();
pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 我们正在用新的 action 覆盖原有的 action
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      );
      return debouncedActions;
    }, {});
  }
});
```

## 实现本地存储

Vuex 实现本地存储比较麻烦，需要把状态一个一个存储到本地，取数据时也要进行处理，而 Pinia 可以用一个插件实现。

```shell
npm i pinia-plugin-persist
```

引入插件

```js
// src/main.js
import { createPinia } from "pinia";
import piniaPluginPersist from "pinia-plugin-persist";

const pinia = createPinia();
pinia.use(piniaPluginPersist);
```

在定义 store 时开启 persist

```js
// src/store/index.js
import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
  state: () => ({ count: 1 }),
  // 开启数据缓存
  persist: {
    enabled: true,
    strategies: [
      {
        key: "myCounter", // 存储的 key 值，默认为 storeId
        storage: localStorage, // 存储的位置，默认为 sessionStorage
        paths: ["name", "age"], // 需要存储的 state 状态，默认存储所有的状态
      },
    ],
  },
});
```

# 案例

实现登录功能

## 初始化

```shell
pnpm create vite pinia-login
cd vite pinia-login
pnpm install
```

## Mock

使用插件[vite-plugin-mock](https://www.npmjs.com/package/vite-plugin-mock) ，它提供了开发环境和生产环境下的数据 mock 服务

```shell
pnpm add -D vite-plugin-mock mockjs
```

```js
//vite.config.js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { viteMockServe } from "vite-plugin-mock";

export default defineConfig((config) => {
  const { command } = config;
  return {
    plugins: [
      vue(),
      viteMockServe({
        // 只在开发阶段开启 mock 服务
        mockPath: "./src/mock",
        localEnabled: command === "serve",
      }),
    ],
  };
});
```

## 编写 mock server

```js
// /mock/user.js

export default [
  // 用户登录
  {
    // 请求地址
    url: "/api/user/login", // 请求方法
    method: "post", // 响应数据
    response: () => {
      return {
        code: 0,
        message: "success",
        data: {
          token: "Token",
          username: "Miruna",
        },
      };
    },
  },
];
```

## 使用 Pinia

```shell
pnpm add pinia axios
```

## 创建 Pinia

```js
// store/index.js
import { createPinia } from "pinia";
const pinia = createPinia();
export default pinia;
```

## 注册 Pinia

```js
//main.js
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import pinia from "./store";

const app = createApp(App);
app.use(pinia).mount("#app");
```

## 创建用户 Store

```js
// store/user.js
import axios from "axios";
import { defineStore } from "pinia";

// 创建 store
const useUserStore = defineStore("user", {
  // 定义状态：一个函数，返回一个对象
  state: () => ({
    username: "",
    token: "",
  }),

  // 定义 getters，等同于组件的计算属性
  getters: {
    // getter 函数接收 state 作为参数，推荐使用箭头函数
    hello: (state) => "Hello!" + state.username,
  },

  // 定义 actions，有同步和异步两种类型
  actions: {
    // 异步 action，一般用来处理异步逻辑
    async login(userData) {
      const result = await axios.post("/api/user/login", userData);
      const { data, code } = result.data;
      if (code === 0) {
        // action 中修改状态
        this.username = data.username;
        this.token = data.token;
      }
    },

    // 同步 action
    logout() {
      this.token = "";
      this.username = "";
    },
  },
});

export default useUserStore;
```

```js
//App.vue
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
```

> 运行项目时报错
>
> `ReferenceError: require is not defined`
>
> 解决：从 node.js 14 版及以上版本中，require 作为 COMMONJS 的一个命令已不再直接支持使用，所以我们需要导入 createRequire 命令才可以，在对应的提示文件加如下代码
>
> ```js
> import { createRequire } from "module";
> const require = createRequire(import.meta.url);
> ```

## Pinia 状态持久化

```shell
pnpm add pinia-plugin-persistedstate
```

```js
//src/store/index.js
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

export default pinia;
```

```js
//src/store/user.js
//状态持久化
    persist: {
        key: "USER",
        storage: localStorage,
        paths: ["token"]
    },
```
