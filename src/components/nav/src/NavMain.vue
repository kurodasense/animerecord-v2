<template>
  <div class="nav-main">
    <!-- 主页 -->
    <NavItem :type="NavType.menu" path="/home" name="首页" activeColor="#2a5caa">
      <template #item-icon>
        <HomeFilled />
      </template>
    </NavItem>
    <!-- 归档 -->
    <NavItem :type="NavType.menu" class="item" path="/directory" name="归档" activeColor="#2a5caa">
      <template #item-icon>
        <Management />
      </template>
    </NavItem>
    <!-- 添加追番日期 -->
    <NavItem
      :type="NavType.button"
      :queryType="NavQueryType.addNewAnimeDate"
      class="item"
      name="添加追番日期"
      activeColor="#2a5caa"
      placeholder="请输入追番日期"
    >
      <template #item-icon>
        <Ticket />
      </template>
    </NavItem>
    <!-- 权限验证 -->
    <NavItem
      :type="NavType.button"
      :queryType="NavQueryType.checkPermission"
      class="item"
      name="权限验证"
      activeColor="#2a5caa"
      placeholder="请输入权限指令"
    >
      <template #item-icon>
        <UploadFilled />
      </template>
    </NavItem>
  </div>
</template>

<script setup lang="ts">
import { NavType, NavQueryType } from "../types";
</script>

<style scoped lang="less">
.nav-main {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  box-shadow: 0 7px 10px 5px rgba(134, 140, 146, 0.3);
  margin: 0 auto;
  width: 250px;
}
</style>
