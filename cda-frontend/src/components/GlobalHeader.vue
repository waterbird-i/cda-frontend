<script setup lang="ts">
import { routes } from '@/router/routes'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const selectedKeys = ref(["/"])
const router = useRouter();
router.afterEach((to, from) => {
  selectedKeys.value = [to.path];
})
const visiableRoutes = computed(()=>{
  return routes.filter((item)=>{
    // 如果路由的meta中设置了hideInMenu，则不显示在菜单中
    return !item.meta?.hideInMenu;
  })
})
const doMenuClick = (key: string) => {
  router.push(key);
}
</script>

<template>
  <a-row class="global-header" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu mode="horizontal" :selected-keys="selectedKeys" @menu-item-click="doMenuClick">
        <a-menu-item key="0" :style="{ padding: 0, marginRight: '38px' }" disabled>
          <div class="titleBar">
            <img class="logo" src="../assets/logo.png" alt="logo" />
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visiableRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <a-button type="primary" href="">登录</a-button>
    </a-col>
  </a-row>
</template>

<style scoped>
.titleBar {
  display: flex;
  align-items: center;
}
.logo {
  height: 72px;
}
</style>
