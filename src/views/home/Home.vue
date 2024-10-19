<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="home" v-loading="loading">
    <el-empty class="empty-center" description="暂无追番记录" v-if="anime_date.length == 0" />
    <Waterfall v-else :list="sortedAnimeDates" :width="400" align="left" background-color="#f5f7f8">
      <template #default="{ item }">
        <card-item :date="item" :key="item.date_id" />
      </template>
    </Waterfall>
  </div>
</template>

<script setup lang="ts">
import { getAnimeDate } from "@/service/api";
import { ElMessage } from "element-plus";
import { Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";

const loading = ref(false);
const anime_date = ref<any[]>([]);

const sortedAnimeDates = computed(() => {
  return anime_date.value.sort((a, b) => {
    const [a_year, a_month] = a.date_name.split(".");
    const [b_year, b_month] = b.date_name.split(".");
    if (a_year > b_year) return 1;
    else if (a_year < b_year) return -1;
    else {
      return a_month - b_month;
    }
  });
});

const getData = async () => {
  loading.value = true;
  try {
    const res = await getAnimeDate();
    const { status, msg, data } = res.data;
    if (status === 200) {
      anime_date.value = data;
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

onMounted(() => {
  getData();
});
</script>

<style scoped lang="less">
.home {
  box-sizing: border-box;
  padding: 20px 40px 0 20px;
  width: 100%;

  .empty-center {
    margin: auto;
    width: 100%;
  }
}
</style>
