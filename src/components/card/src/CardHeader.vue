<template>
  <div class="card-header">
    <span v-if="isUpdateDateName" style="width: 80px">
      <el-input
        v-model="tempModelValue"
        ref="dateNameInputRef"
        @blur="hideUpdateDateName"
        @keyup.enter="updateDateName"
      ></el-input>
    </span>
    <span v-else @dblclick="dblClick">{{ props.date.date_name }}</span>
    <div style="text-align: right">
      <el-popover ref="elPopoverRef" placement="top" trigger="click">
        <template #reference>
          <el-button class="button" type="danger" text>删除记录表</el-button>
        </template>
        <el-text tag="p" type="danger">确认删除?</el-text>
        <div style="text-align: right; margin-top: 10px">
          <el-button size="small" type="primary" @click="delRecord">确认</el-button>
        </div>
      </el-popover>
      <el-button v-if="props.recordLength > 10" class="button" text @click="export2Image"
        >导出为图片</el-button
      >
      <el-button class="button" text @click="addRecord">添加追番</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IAnimeDate } from "@/service/types";
import type { ElInput, ElPopover } from "element-plus";
import { deleteAnimeRecord, updateRecordDateName } from "@/service/api";
import { handleError } from "@/utils";

const props = defineProps<{
  date: IAnimeDate;
  recordLength: number;
}>();

const emits = defineEmits(["updateLoading", "updateDate", "export2Image", "addRecord"]);

const waterfallRerender = inject<() => void>("waterfallRerender"); // 注入父组件方法

const isUpdateDateName = ref(false);
const dateNameInputRef = ref<InstanceType<typeof ElInput>>();
const elPopoverRef = ref<InstanceType<typeof ElPopover>>();
const tempModelValue = ref("");

const dblClick = () => {
  isUpdateDateName.value = true;
  tempModelValue.value = props.date.date_name;
  nextTick(() => {
    dateNameInputRef.value?.focus();
    waterfallRerender?.();
  });
};

const hideUpdateDateName = () => {
  isUpdateDateName.value = false;
  waterfallRerender?.();
};

const updateDateName = async () => {
  emits("updateLoading", true);
  try {
    if (tempModelValue.value === props.date.date_name) {
      return;
    }
    const res = await updateRecordDateName(props.date.date_id, tempModelValue.value);
    const { status, msg } = res.data;
    if (status === 200) {
      isUpdateDateName.value = false;
      ElMessage.success(`修改日期成功`);
      emits("updateDate", props.date, tempModelValue.value);
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    handleError(err);
  } finally {
    emits("updateLoading", false);
    isUpdateDateName.value = false;
    waterfallRerender?.();
  }
};

const export2Image = async () => {
  emits("export2Image");
};

const addRecord = () => {
  emits("addRecord");
};

const delRecord = async () => {
  try {
    emits("updateLoading", true);
    const res = await deleteAnimeRecord(props.date.date_id);
    const { status, msg } = res.data;
    if (status === 200) {
      ElMessage.success(`已删除记录 ${props.date.date_name}`);
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    handleError(err);
  } finally {
    emits("updateLoading", false);
    elPopoverRef.value?.hide();
  }
};
</script>

<style lang="less" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .button {
    margin: 0;
    padding: 0 12px;
  }
}
</style>
