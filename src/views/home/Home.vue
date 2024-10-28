<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="home" v-loading="loading">
    <el-empty class="empty-center" description="暂无追番记录" v-if="anime_date.length == 0" />
    <Waterfall
      v-else
      ref="waterfallRef"
      :list="sortedAnimeDates"
      :width="410"
      align="center"
      background-color="#f5f7f8"
    >
      <template #default="{ item }">
        <card-item :date="item" :key="item.date_id" @updateDate="handleUpdateDate" />
      </template>
    </Waterfall>
  </div>
</template>

<script setup lang="ts">
import { getAnimeDate } from "@/service/api";
import type { IAnimeDate } from "@/service/types";
import { ElMessage } from "element-plus";
import { Waterfall } from "vue-waterfall-plugin-next";
import "vue-waterfall-plugin-next/dist/style.css";
import { retryRequest, handleError } from "@/utils";

const loading = ref(false);
const anime_date = ref<IAnimeDate[]>([]);
const waterfallRef = ref<InstanceType<typeof Waterfall>>();

const sortedAnimeDates = computed(() => {
  return anime_date.value.toSorted((a, b) => {
    const [a_year, a_month] = a.date_name.split(".").map(parseInt);
    const [b_year, b_month] = b.date_name.split(".").map(parseInt);
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
    const res = await retryRequest(getAnimeDate, 5000, () =>
      ElMessage.warning("网络错误，正在重新获取中")
    );
    const { status, msg, data } = res.data;
    if (status === 200) {
      anime_date.value = data;
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    handleError(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getData();
});

const handleUpdateDate = (date: IAnimeDate, value: string) => {
  const index = anime_date.value.findIndex((item) => item.date_id === date.date_id);
  anime_date.value[index].date_name = value;
  waterfallRerender();
};

const waterfallRerender = () => {
  waterfallRef.value?.renderer();
};

provide("waterfallRerender", waterfallRerender);
</script>

<style scoped lang="less">
.home {
  box-sizing: border-box;
  width: 100%;

  .empty-center {
    margin: auto;
    width: 100%;
  }
}
</style>
