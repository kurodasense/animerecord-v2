<template>
  <div class="nav-base" @click="itemClick" :class="{ active: isActive, nonActive: !isActive }">
    <div class="item">
      <span class="item-icon">
        <el-icon :size="25" :color="iconColor">
          <slot name="item-icon" />
        </el-icon>
      </span>
      <span class="item-text" :style="textColor">{{ props.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import type { INavBase } from "../types";
const route = useRoute();
const router = useRouter();
const props = defineProps<INavBase>();

const isActive = computed(() => {
  return route.path.indexOf(props.path!) !== -1;
});

const iconColor = computed(() => {
  return isActive.value ? props.activeColor : "black";
});

const textColor = computed(() => {
  return isActive.value ? { color: props.activeColor } : {};
});

const itemClick = () => {
  if (route.path === props.path) {
    return;
  } else {
    router.replace(props.path!);
  }
};
</script>

<style scoped lang="less">
.nav-base {
  box-sizing: border-box;
  border-radius: 38px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 20px 20px 20px 10px;
  padding: 10px 20px 10px 10px;

  .item {
    display: flex;
    align-items: center;
    width: 100%;
    font-size: var(--nav-font-size);
    font-weight: var(--nav-font-weight);
    margin-left: 10px;
  }
  .item-icon {
    position: relative;
    margin-left: 10px;
    top: 2.5px;
  }
  .item-text {
    width: 100%;
    text-align: center;
  }
}
.active {
  background-color: var(--nav-active-background-color);
}

.nonActive {
  &:hover {
    background-color: var(--nav-hover-background-color);
    transition: background-color 0.2s;
  }
}
</style>
