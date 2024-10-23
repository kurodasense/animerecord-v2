<template>
  <div ref="cardItemRef" v-loading="loading" class="box-card">
    <el-card>
      <template #header>
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
            <el-popover placement="top" trigger="click">
              <template #reference>
                <el-button class="button" type="danger" text>删除记录表</el-button>
              </template>
              <el-text tag="p" type="danger">确认删除?</el-text>
              <div style="text-align: right; margin-top: 10px">
                <el-button size="small" type="primary" @click="delRecord">确认</el-button>
              </div>
            </el-popover>
            <el-button v-if="record.length > 10" class="button" text @click="export2Image"
              >导出为图片</el-button
            >
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
                v-model="tempModelValue"
                autosize
                ref="elInputRef"
                @blur="inputBlur"
                @keyup.enter="updateAnimeName(scope.row)"
              />
            </span>
            <span v-else>{{ scope.row.anime_name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="watch_status" label="watch_status" width="80" align="center">
          <template #default="scope">
            <span v-if="scope.row.index === tabClickIndex && tabClickLabel === 'watch_status'">
              <el-input
                v-model="tempModelValue"
                ref="elInputRef"
                @blur="inputBlur"
                @keyup.enter="updateWatchStatus(scope.row)"
              />
            </span>
            <span v-else>{{ scope.row.watch_status }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  deleteAnimeRecord,
  getAnimeRecordByDateId,
  updateNewAnimeRecord,
  updateNewAnimeWatchStatus,
  updateRecordDateName
} from "@/service/api";
import { ElCard, ElInput, ElMessage } from "element-plus";
import moment from "moment";
import html2canvas from "html2canvas";
import type { IDateType, IRecordType } from "../types";

const props = defineProps<{
  date: IDateType;
}>();

const waterfallRerender = inject<() => void>("waterfallRerender"); // 注入父组件方法

const record = ref<IRecordType[]>([]);
const tabClickIndex = ref(null);
const tabClickLabel = ref("");
const isUpdateDateName = ref(false);
const loading = ref(false);
const elInputRef = ref<InstanceType<typeof ElInput>>();
const dateNameInputRef = ref<InstanceType<typeof ElInput>>();
const cardItemRef = ref<InstanceType<typeof ElCard>>();
const tempModelValue = ref("");

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
    waterfallRerender?.();
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
  tempModelValue.value = row[column.property];
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
    if (tempModelValue.value === row.anime_name) return;
    tabClickIndex.value = null;
    tabClickLabel.value = "";
    let recordId = row.record_id;
    if (!recordId) {
      recordId = moment().format("YYYYMMDDHHmms");
    }
    const res = await updateNewAnimeRecord(
      recordId,
      props.date.date_id,
      tempModelValue.value,
      row.watch_status
    );
    const { status, msg } = res.data;
    if (status === 200) {
      row.record_id = recordId;
      loading.value = false;
      row.anime_name = tempModelValue.value;
      ElMessage.success(`修改名称成功`);
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    const { msg } = err.response.data;
    ElMessage.error(msg);
  } finally {
    loading.value = false;
    inputBlur();
  }
};

const updateWatchStatus = async (row: any) => {
  tabClickIndex.value = null;
  tabClickLabel.value = "";
  const { record_id, anime_name } = row;
  loading.value = true;
  try {
    if (tempModelValue.value === row.watch_status) return;
    const res = await updateNewAnimeWatchStatus(
      record_id,
      props.date.date_id,
      anime_name,
      tempModelValue.value
    );
    const { status, msg } = res.data;
    if (status === 200) {
      ElMessage.success(`修改状态成功`);
      row.watch_status = tempModelValue.value;
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

const export2Image = async () => {
  loading.value = true;
  try {
    const canvas = await html2canvas(cardItemRef.value as unknown as HTMLElement);
    canvas.toBlob((blob) => {
      const item = new ClipboardItem({ "image/png": blob as Blob });
      navigator.clipboard.write([item]).then(() => {
        ElMessage.success(`图片导出成功，已复制到粘贴板`);
      });
    });
  } catch (err: any) {
    ElMessage.error(err);
  } finally {
    loading.value = false;
  }
};

const addRecord = () => {
  record.value.push({ anime_name: "new anime", watch_status: "待看" });
  waterfallRerender?.();
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
  loading.value = true;
  try {
    if (tempModelValue.value === props.date.date_name) {
      return;
    }
    const res = await updateRecordDateName(props.date.date_id, tempModelValue.value);
    const { status, msg } = res.data;
    if (status === 200) {
      isUpdateDateName.value = false;
      ElMessage.success(`修改日期成功`);
      console.log(tempModelValue.value);
      props.date.date_name = tempModelValue.value;
    } else {
      ElMessage.error(msg);
    }
  } catch (err: any) {
    const { msg } = err.response.data;
    ElMessage.error(msg);
  } finally {
    loading.value = false;
    isUpdateDateName.value = false;
    waterfallRerender?.();
  }
};
</script>

<style scoped lang="less">
.box-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .button {
      margin: 0;
      padding: 0 12px;
    }
  }
}
</style>
