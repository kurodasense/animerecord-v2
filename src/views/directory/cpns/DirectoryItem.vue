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
      <el-table-column width="140" align="center">
        <template #default="scope">
          <UploadPopover :scope="scope">
            <template #reference>
              <el-button type="primary" text>上传预览图片</el-button>
            </template>
          </UploadPopover>
        </template>
      </el-table-column>
      <el-table-column width="90" align="center">
        <template #default="scope">
          <DeletePopover :scope="scope" @update="updateRecord">
            <template #reference>
              <el-button type="danger" text>删除</el-button>
            </template>
          </DeletePopover>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import UploadPopover from "./UploadPopover.vue";
import DeletePopover from "./DeletePopover.vue";
import { getAnimeRecordByDateId } from "@/service/api";
import type { IAnimeDate } from "@/service/types";
import { ElMessage } from "element-plus";
import { handleError } from "@/utils";

const props = defineProps<{
  date: IAnimeDate;
}>();

const record = ref<any[]>([]);
const loading = ref(false);

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
    handleError(err);
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

const updateRecord = (row: any) => {
  record.value.splice(record.value.indexOf(row), 1);
};

getAnimeRecord();
</script>

<style scoped lang="less"></style>
