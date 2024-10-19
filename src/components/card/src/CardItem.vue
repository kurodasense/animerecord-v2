<template>
  <el-card ref="cardItemRef" class="box-card" v-loading="loading">
    <template #header>
      <div class="card-header">
        <span v-if="isUpdateDateName" style="width: 80px">
          <el-input
            v-model="props.date.date_name"
            ref="dateNameInputRef"
            @blur="hideUpdateDateName"
            @change="updateDateName"
          ></el-input>
        </span>
        <span v-else @dblclick="dblClick">{{ props.date.date_name }}</span>
        <div style="text-align: right">
          <el-popover placement="top" trigger="click">
            <template #reference>
              <el-button class="button" type="danger" text>删除记录表</el-button>
            </template>
            <el-text tag="p" type="danger">确认删除?</el-text>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="small" type="primary" @click="delRecord">确认</el-button>
            </div>
          </el-popover>
          <el-button class="button" text @click="addRecord">添加追番</el-button>
        </div>
      </div>
    </template>
    <el-empty v-if="record.length <= 0" description="暂无记录捏" />
    <el-table
      v-else
      :data="record"
      border
      style="width: 100%"
      :show-header="false"
      :cell-style="cellStyle"
      :row-class-name="tableRowClassName"
      @cell-dblclick="tabClick"
    >
      <el-table-column prop="anime_name" label="anime_name" width="auto">
        <template #default="scope">
          <span v-if="scope.row.index === tabClickIndex && tabClickLabel === 'anime_name'">
            <el-input
              v-model="scope.row.anime_name"
              autosize
              ref="elInputRef"
              @blur="inputBlur"
              @change="updateAnimeName(scope.row)"
            />
          </span>
          <span v-else>{{ scope.row.anime_name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="watch_status" label="watch_status" width="80" align="center">
        <template #default="scope">
          <span v-if="scope.row.index === tabClickIndex && tabClickLabel === 'watch_status'">
            <el-input
              v-model="scope.row.watch_status"
              ref="elinput"
              @blur="inputBlur"
              @change="updateWatchStatus(scope.row)"
            />
          </span>
          <span v-else>{{ scope.row.watch_status }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import {
  deleteAnimeRecord,
  getAnimeRecordByDateId,
  updateNewAnimeRecord,
  updateNewAnimeWatchStatus,
  updateRecordDateName
} from "@/service/api";
import { ElInput, ElMessage } from "element-plus";
import moment from "moment";
import type { IRecordType } from "../types";

const props = defineProps<{
  date: any;
}>();

const record = ref<IRecordType[]>([]);
const tabClickIndex = ref(null);
const tabClickLabel = ref("");
const isUpdateDateName = ref(false);
const loading = ref(false);
const elInputRef = ref<InstanceType<typeof ElInput>>();
const dateNameInputRef = ref<InstanceType<typeof ElInput>>();

onMounted(async () => {
  try {
    loading.value = true;
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
});

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

const tableRowClassName = ({ row, rowIndex }: any) => {
  row.index = rowIndex;
  return "";
};

const tabClick = (row: any, column: any) => {
  tabClickIndex.value = row.index;
  tabClickLabel.value = column.label;
  nextTick(() => {
    elInputRef.value?.focus();
  });
};

const inputBlur = () => {
  tabClickIndex.value = null;
  tabClickLabel.value = "";
};

const updateAnimeName = async (row: any) => {
  loading.value = true;
  try {
    tabClickIndex.value = null;
    tabClickLabel.value = "";
    let recordId = row.recordId;
    if (!recordId) {
      recordId = moment().format("YYYYMMDDHHmms");
    }
    const res = await updateNewAnimeRecord(
      recordId,
      props.date.date_id,
      row.anime_name,
      row.watch_status
    );
    const { status, msg } = res.data;
    if (status === 200) {
      row.record_id = recordId;
      loading.value = false;
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    const { msg } = err.response.data;
    ElMessage.error(msg);
    row.anime_name = "";
  } finally {
    loading.value = false;
  }
};

const updateWatchStatus = async (row: any) => {
  tabClickIndex.value = null;
  tabClickLabel.value = "";
  let { record_id, anime_name, watch_status } = row;
  loading.value = true;
  try {
    const res = await updateNewAnimeWatchStatus(
      record_id,
      props.date.date_id,
      anime_name,
      watch_status
    );
    const { status, msg } = res.data;
    if (status === 200) {
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

const addRecord = () => {
  record.value.push({ anime_name: "new anime", watch_status: "待看" });
};

const delRecord = async () => {
  try {
    loading.value = true;
    const res = await deleteAnimeRecord(props.date.date_id);
    const { status, msg } = res.data;
    if (status === 200) {
      ElMessage.success(`已删除记录 ${props.date.date_name}`);
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

const dblClick = () => {
  isUpdateDateName.value = true;
  nextTick(() => {
    dateNameInputRef.value?.focus();
  });
};

const hideUpdateDateName = () => {
  isUpdateDateName.value = false;
};

const updateDateName = async () => {
  loading.value = true;
  try {
    const res = await updateRecordDateName(props.date.date_id, props.date.date_name);
    const { status, msg } = res.data;
    if (status === 200) {
      isUpdateDateName.value = false;
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
.box-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
