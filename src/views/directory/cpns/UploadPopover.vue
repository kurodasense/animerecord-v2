<template>
  <el-popover ref="elUploadPopoverRef" placement="bottom" trigger="click" width="250">
    <template #reference>
      <slot name="reference"></slot>
    </template>
    <el-upload
      drag
      :http-request="(options: UploadRequestOptions) => handleUploadImage(options, props.scope.row)"
      :show-file-list="false"
      v-loading="loading"
    >
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text">拖拽图片或者<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip">基于picgo上传到个人github仓库</div>
      </template>
    </el-upload>
  </el-popover>
</template>

<script setup lang="ts">
import { uploadImage } from "@/service/api";
import type { IAnimeRecord } from "@/service/types";
import { handleError } from "@/utils";
import type { ElPopover, UploadRequestOptions } from "element-plus";

const props = defineProps<{ scope: any }>();
const loading = ref(false);
const elUploadPopoverRef = ref<InstanceType<typeof ElPopover>>();

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
      ElMessage.success(`上传成功`);
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    handleError(err);
  } finally {
    loading.value = false;
    elUploadPopoverRef.value?.hide();
  }
};
</script>
