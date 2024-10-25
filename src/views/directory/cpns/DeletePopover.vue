<template>
  <el-popover ref="elDeletePopoverRef" placement="top" trigger="click">
    <template #reference>
      <slot name="reference"></slot>
    </template>
    <div v-loading="loading">
      <el-text tag="p" type="danger">确认删除?</el-text>
      <div style="text-align: right; margin-top: 10px">
        <el-button size="small" type="primary" @click="delAnime(props.scope.row)">确认</el-button>
      </div>
    </div>
  </el-popover>
</template>

<script setup lang="ts">
import { deleteAnime } from "@/service/api";
import { handleError } from "@/utils";
import type { ElPopover } from "element-plus";

const props = defineProps<{ scope: any }>();
const emits = defineEmits(["update"]);
const elDeletePopoverRef = ref<InstanceType<typeof ElPopover>>();

const loading = ref(false);

const delAnime = async (row: any) => {
  const { record_id, date_id, anime_name } = row;
  loading.value = true;
  try {
    const res = await deleteAnime(record_id, date_id, anime_name);
    const { status, msg } = res.data;
    if (status === 200) {
      emits("update", row);
      ElMessage.success(`删除 ${anime_name} 成功`);
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    handleError(err);
  } finally {
    loading.value = false;
    elDeletePopoverRef.value?.hide();
  }
};
</script>
