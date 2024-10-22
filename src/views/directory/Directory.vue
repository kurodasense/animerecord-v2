<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="directory" v-loading="loading">
    <el-empty v-if="animeDate.length <= 0" class="empty-center" description="暂无追番记录" />
    <el-timeline v-else :reverse="true">
      <el-timeline-item
        class="el-timeline-item"
        v-for="date in animeDate"
        :key="date.date_id"
        type="primary"
        :hollow="true"
        :timestamp="date.date_name"
        :hide-timestamp="true"
        placement="top"
        size="large"
      >
        <div class="timestamp">
          {{ date.date_name }}
        </div>
        <DirectoryItem :date="date" />
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script setup lang="ts">
import DirectoryItem from "./cpns/DirectoryItem.vue";

import { getAnimeDate } from "@/service/api";
import type { IAnimeDate } from "@/service/types";
import { ElMessage } from "element-plus";

const animeDate = ref<IAnimeDate[]>([]);
const loading = ref(false);

onMounted(() => {
  getData();
});

const getData = async () => {
  loading.value = true;
  try {
    const res = await getAnimeDate();
    const { status, msg, data } = res.data;
    if (status === 200) {
      animeDate.value = data;
      animeDate.value.sort((a, b) => {
        const [a_year, a_month] = a.date_name.split(".").map(parseInt);
        const [b_year, b_month] = b.date_name.split(".").map(parseInt);
        if (a_year > b_year) return 1;
        else if (a_year < b_year) return -1;
        else {
          return a_month - b_month;
        }
      });
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

<style scoped lang="less">
.directory {
  margin-top: 20px;
  .timestamp {
    text-align: left;
    font-size: var(--timestamp-title-font-size);
    font-weight: var(--font-weight);
    color: var(--timestamp-title-color);
    margin-bottom: 8px;
    padding-top: 4px;
  }
}
</style>
