<template>
  <div ref="cardItemRef" v-loading="loading" class="box-card">
    <el-card>
      <template #header>
        <CardHeader
          :date="props.date"
          :recordLength="record.length"
          @updateLoading="handleUpdateLoading"
          @updateDate="handleUpdateDate"
          @export2Image="handleExport2Image"
          @addRecord="handleAddRecord"
        />
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
        <el-table-column prop="anime_name" label="anime_name">
          <template #default="scope">
            <template v-if="scope.row.index === tabClickIndex && tabClickLabel === 'anime_name'">
              <el-input
                v-model="tempModelValue"
                autosize
                ref="elInputRef"
                @blur="inputBlur"
                @keyup.enter="updateAnimeName(scope.row)"
              />
            </template>
            <template v-else>
              <el-popover
                width="500"
                placement="bottom"
                trigger="hover"
                :show-after="1000"
                :disabled="scope.row.image_url == null"
              >
                <template #default>
                  <div style="display: flex; justify-content: center">
                    <LazyImage :src="scope.row.image_url" />
                  </div>
                </template>
                <template #reference>
                  <a
                    class="column-anime_name"
                    :href="`https://zh.moegirl.org.cn/${scope.row.anime_name}`"
                    target="_blank"
                  >
                    {{ scope.row.anime_name }}
                  </a>
                </template>
              </el-popover>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="watch_status" label="watch_status" width="80" align="center">
          <template #default="scope">
            <template v-if="scope.row.index === tabClickIndex && tabClickLabel === 'watch_status'">
              <el-input
                v-model="tempModelValue"
                ref="elInputRef"
                @blur="inputBlur"
                @keyup.enter="updateWatchStatus(scope.row)"
              />
            </template>
            <template v-else>{{ scope.row.watch_status }}</template>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import CardHeader from "./CardHeader.vue";
import LazyImage from "@/components/lazy-image/src/LazyImage.vue";
import {
  getAnimeRecordByDateId,
  updateNewAnimeRecord,
  updateNewAnimeWatchStatus
} from "@/service/api";
import { ElCard, ElInput, ElMessage, ElPopover } from "element-plus";
import moment from "moment";
import type { IDateType, IRecordType } from "../types";
import { handleError, retryRequest } from "@/utils";
import type { IAnimeDate } from "@/service/types";
import html2canvas from "html2canvas";
const props = defineProps<{
  date: IDateType;
}>();
const waterfallRerender = inject<() => void>("waterfallRerender"); // 注入父组件方法

const record = ref<IRecordType[]>([]);
const tabClickIndex = ref(null);
const tabClickLabel = ref("");
const loading = ref(false);
const elInputRef = ref<InstanceType<typeof ElInput>>();
const cardItemRef = ref<HTMLDivElement>();
const tempModelValue = ref("");
const emits = defineEmits(["updateDate"]);

const getData = async () => {
  loading.value = true;
  try {
    const res = await retryRequest(
      () => getAnimeRecordByDateId(props.date.date_id),
      2000,
      () => {
        console.log("网络错误，正在重试...");
      }
    );
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
    waterfallRerender?.();
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
    handleError(err);
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
    handleError(err);
  } finally {
    loading.value = false;
  }
};

const handleUpdateDate = (date: IAnimeDate, value: string) => {
  emits("updateDate", date, value);
};

const handleUpdateLoading = (value: boolean) => {
  loading.value = value;
};

const handleExport2Image = async () => {
  loading.value = true;
  try {
    const canvas = await html2canvas(cardItemRef.value as unknown as HTMLElement);
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          // 复制到剪切板
          const item = new ClipboardItem({ [blob.type]: blob });
          await navigator.clipboard.write([item]);
          ElMessage.success(`导出图片成功`);
        } catch (err) {
          handleError(err);
          ElMessage.success(`导出图片成功，但复制到剪贴板失败`);
        }
      }
    });
  } catch (err: any) {
    handleError(err);
  } finally {
    loading.value = false;
  }
};

const handleAddRecord = () => {
  record.value.push({ anime_name: "new anime", watch_status: "待看" });
  waterfallRerender?.();
};

getData();
</script>

<style lang="less" scoped>
.column-anime_name:hover {
  text-decoration: none;
  color: #409eff;
  font-weight: 500;
}
</style>
