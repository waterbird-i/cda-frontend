<script setup lang="ts">
</script>

<template>
  <div id="userLayout">
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img class="logo" src="../assets/logo.png" alt="logo" />
          <div> cda AI 答题应用平台</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://github.com/Knight777777777777" target="_blank"> Created by Knight </a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
  0% 0% / 100% 100%;
}
#userLayout .logo{
  height: 72px;
}
.footer {
  text-decoration: none;
  padding: 16px;
  text-align: center;
  background: #efefef;
}
</style>
