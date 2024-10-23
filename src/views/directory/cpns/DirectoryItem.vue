<template>
  <el-card v-loading="loading">
    <el-empty v-if="record.length <= 0" description="暂无记录捏" />
    <el-table
      v-else
      :data="record"
      border
      style="width: 100%"
      :show-header="false"
      :cell-style="cellStyle"
    >
      <el-table-column prop="anime_name" label="anime_name" width="auto"> </el-table-column>
      <el-table-column prop="watch_status" label="watch_status" width="90" align="center">
      </el-table-column>
      <el-table-column width="90" align="center">
        <template #default="scope">
          <el-popover ref="elPopoverRef" placement="top" trigger="click">
            <template #reference>
              <el-button type="danger" text>删除</el-button>
            </template>
            <el-text tag="p" type="danger">确认删除?</el-text>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="small" type="primary" @click="delAnime(scope.row)">确认</el-button>
            </div>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import { deleteAnime, getAnimeRecordByDateId } from "@/service/api";
import type { IAnimeDate } from "@/service/types";
import { ElMessage, ElPopover } from "element-plus";

const props = defineProps<{
  date: IAnimeDate;
}>();

const record = ref<any[]>([]);
const loading = ref(false);
const elPopoverRef = ref<InstanceType<typeof ElPopover>>();

onMounted(() => {
  getAnimeRecord();
});

const getAnimeRecord = async () => {
  loading.value = true;
  try {
    const res = await getAnimeRecordByDateId(props.date.date_id);
    const { status, msg, data } = res.data;
    if (status === 200) {
      record.value = data;
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    const { msg } = err.response.data;
    ElMessage.error(msg);
  } finally {
    loading.value = false;
  }
};

const cellStyle = ({ row, columnIndex }: any) => {
  switch (row.watch_status) {
    case "待看":
      if (columnIndex === 1) return { background: "yellow" };
    case "看完":
      if (columnIndex === 1) return { background: "red", color: "white" };
    default:
      if (columnIndex === 1) return { background: "" };
  }
};

const delAnime = async (row: any) => {
  const { record_id, date_id, anime_name } = row;
  loading.value = true;
  try {
    const res = await deleteAnime(record_id, date_id, anime_name);
    const { status, msg } = res.data;
    if (status === 200) {
      record.value.splice(record.value.indexOf(row), 1);
      ElMessage.success(`已删除 ${anime_name}`);
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    const { msg } = err.response.data;
    ElMessage.error(msg);
  } finally {
    loading.value = false;
    elPopoverRef.value?.hide();
  }
};
</script>

<style scoped lang="less"></style>
