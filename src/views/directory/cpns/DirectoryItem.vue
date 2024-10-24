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
          <el-popover ref="elPopoverRef" placement="top" trigger="click">
            <template #reference>
              <el-button type="primary" text>上传预览图片</el-button>
            </template>
            <el-upload
              drag
              :http-request="
                (options: UploadRequestOptions) => handleUploadImage(options, scope.row)
              "
              :show-file-list="false"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">拖拽图片或者<em>点击上传</em></div>
              <template #tip>
                <div class="el-upload__tip">基于picgo上传到个人github仓库</div>
              </template>
            </el-upload>
          </el-popover>
        </template>
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
import { deleteAnime, getAnimeRecordByDateId, uploadImage } from "@/service/api";
import type { IAnimeDate, IAnimeRecord } from "@/service/types";
import { ElMessage, ElPopover, type UploadRequestOptions } from "element-plus";

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

const handleUploadImage = async (options: UploadRequestOptions, row: IAnimeRecord) => {
  loading.value = true;
  const { file } = options;
  try {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("recordId", row.record_id);
    formData.append("dateId", row.date_id);
    const res = await uploadImage(formData);
    const { status, msg } = res.data;
    if (status === 200) {
      // 处理响应
      ElMessage.success(`上传成功`);
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
</script>

<style scoped lang="less"></style>
