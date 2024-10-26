<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="main">
    <div class="left-nav">
      <nav-main />
    </div>
    <div class="right-content">
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
.main {
  display: flex;
  margin-left: 10px;
  margin-right: 40px;

  .left-nav {
    flex-basis: 400px;
    flex-shrink: 1;
    height: 100vh;
    top: 0;
    position: sticky;
  }

  .right-content {
    width: 100%;
    height: 100%;
    flex-grow: 1;
  }
}
</style>
