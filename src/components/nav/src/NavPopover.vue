<template>
  <el-popover
    trigger="click"
    @hide="handleHidePopover"
    @show="showPopover"
    :width="300"
    placement="bottom"
    :disabled="props.navType !== NavType.button"
    ref="elPopoverRef"
  >
    <el-input
      v-model="inputValueRef"
      @keyup.enter="handleConfirm"
      :placeholder="props.placeholder"
      ref="elInputRef"
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
import { addNewAnimeDate, getPermission } from "@/service/api";
import { NavType } from "../types";
import { NavQueryType, type INavPopover } from "../types";
import { ElInput, ElLoading, ElMessage, ElPopover } from "element-plus";
import useRootState from "@/stores";

const props = defineProps<INavPopover>();
const rootStore = useRootState();

const inputValueRef = ref("");
const elInputRef = ref<InstanceType<typeof ElInput>>();
const elPopoverRef = ref<InstanceType<typeof ElPopover>>();

const showPopover = () => {
  elInputRef.value?.focus();
};

const handleHidePopover = () => {
  inputValueRef.value = "";
};

const handleConfirm = async () => {
  const loading = ElLoading.service({ fullscreen: true });
  switch (props.queryType) {
    case NavQueryType.addNewAnimeDate:
      try {
        const res = await addNewAnimeDate(inputValueRef.value);
        const { status, msg } = res.data;
        if (status === 200) {
          ElMessage.success(`添加记录 ${inputValueRef.value} 成功`);
          // todo: 重新获取追番数据
        } else {
          ElMessage.error(`添加记录 ${inputValueRef.value} 失败`);
          ElMessage.error(`失败原因: ${msg}`);
        }
      } catch (err: any) {
        const { msg } = err.response.data;
        ElMessage.error(`${msg}`);
      } finally {
        loading.close();
        elPopoverRef.value?.hide();
        handleHidePopover();
      }
      break;
    case NavQueryType.checkPermission:
      try {
        const res = await getPermission(inputValueRef.value);
        const { status, msg, data } = res.data;
        if (status === 200) {
          const { token } = data;
          ElMessage.success(`权限验证成功`);
          rootStore.setToken(token);
        } else {
          ElMessage.success(msg);
        }
      } catch (err: any) {
        const { msg } = err.response.data;
        ElMessage.error(`${msg}`);
      } finally {
        loading.close();
        elPopoverRef.value?.hide();
        handleHidePopover();
      }
      break;
    default:
      break;
  }
};
</script>

<style scoped lang="less"></style>
