<template>
  <a-table
    :columns="columns"
    :data="dataList"
    :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total,
    }"
    @page-change="onPageChange"
  >
    <template #resultPicture="{ record }">
      <a-image width="64" :src="record.resultPicture" />
    </template>
    <template #createTime="{ record }">
      {{ dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #updateTime="{ record }">
      {{ dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss") }}
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button @click="doUpdate?.(record)">修改</a-button>
        <a-button status="danger" @click="doDelete(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>
<script setup lang="ts">
import { defineProps, ref, watch, watchEffect, withDefaults } from "vue";
import API from "@/api";
import {
  deleteScoringResultUsingPost,
  listScoringResultVoByPageUsingPost,
} from "@/api/scoringResultController";
import message from "@arco-design/web-vue/es/message";
import dayjs from "dayjs";

interface Props {
  appId: string;
  doUpdate: (scoringResult: API.ScoringResultVO) => void;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => "",
});
const initSearchParams = {
  current: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "descend",
};
const searchParams = ref<API.ScoringResultQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.ScoringResultVO[]>([]);
const total = ref<number>(0);
const loadData = async () => {
  if (!props.appId) return;
  const papams = {
    ...searchParams.value,
    appId: props.appId,
  };
  const res = await listScoringResultVoByPageUsingPost(papams);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("加载数据失败, " + res.data.message);
  }
};
/**
 * 分页变化，改变搜索条件，触发数据加载
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};
const doDelete = async (record: API.ScoringResult) => {
  if (!record.id) return;
  const res = await deleteScoringResultUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    loadData();
  } else {
    message.error("删除失败, " + res.data.message);
  }
};
watchEffect(() => {
  loadData();
});
// 表格列配置
const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "名称",
    dataIndex: "resultName",
  },
  {
    title: "描述",
    dataIndex: "resultDesc",
  },
  {
    title: "图片",
    dataIndex: "resultPicture",
    slotName: "resultPicture",
  },
  {
    title: "结果属性",
    dataIndex: "resultProp",
  },
  {
    title: "评分范围",
    dataIndex: "resultScoreRange",
  },
  {
    title: "应用 id",
    dataIndex: "appId",
  },
  {
    title: "用户 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>
<style scoped></style>
