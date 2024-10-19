<template>
  <el-popover
    trigger="click"
    @hide="hidePopover"
    :width="300"
    placement="bottom"
    :disabled="props.navType !== NavType.button"
  >
    <el-input
      v-model="inputValueRef"
      @keyup.enter="handleConfirm"
      :placeholder="props.placeholder"
    />
    <div style="text-align: right; margin-top: 10px">
      <el-button size="small" type="primary" @click="handleConfirm">确认</el-button>
    </div>
    <template #reference>
      <slot name="item" />
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import { addNewAnimeDate } from "@/service/api";
import { NavType } from "../types";
import { NavQueryType, type INavPopover } from "../types";
import { ElLoading } from "element-plus";

const props = defineProps<INavPopover>();

const isActiveRef = ref(false);
const valueRef = ref("");
const inputValueRef = ref("");

const hidePopover = () => {
  isActiveRef.value = false;
  valueRef.value = "";
};

const handleConfirm = async () => {
  const loading = ElLoading.service({ fullscreen: true });
  console.log(inputValueRef.value);
  try {
    switch (props.queryType) {
      case NavQueryType.addNewAnimeDate:
        const res = await addNewAnimeDate(inputValueRef);
        const { status, data } = res;
        break;
      case NavQueryType.checkPermission:
        break;
      default:
        break;
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.close();
    hidePopover();
  }
};
</script>

<style scoped lang="less"></style>
