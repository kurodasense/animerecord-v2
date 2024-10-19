<template>
  <div class="nav-item">
    <nav-popover
      :placeholder="props.placeholder || ''"
      :queryType="props.queryType || 0"
      :navType="props.type"
    >
      <template #item>
        <nav-base :path="props.path" :name="props.name" :activeColor="props.activeColor">
          <template #item-icon>
            <slot name="item-icon" />
          </template>
        </nav-base>
      </template>
    </nav-popover>
  </div>
</template>

<script setup lang="ts">
import { type INavItem } from "../types";

const props = defineProps<INavItem>();
</script>

<style scoped lang="less"></style>
