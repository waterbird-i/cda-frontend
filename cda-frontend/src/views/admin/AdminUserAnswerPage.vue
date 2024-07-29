<template>
  <a-form
    :model="formSearchParams"
    :style="{ marginBottom: '20px' }"
    layout="inline"
    @submit="doSearch"
  >
    <a-form-item field="appName" label="应用名">
      <a-input-number
        v-model="formSearchParams.appId"
        placeholder="请输入应用id"
        allow-clear
      />
    </a-form-item>
    <a-grid :cols="3" :row-gap="16">
      <div>
        <a-radio-group
          class="appType"
          v-model="formSearchParams.appType"
          type="button"
        >
          <a-radio value="0">得分类</a-radio>
          <a-radio value="1">测评类</a-radio>
        </a-radio-group>
      </div>
      <div>
        <a-radio-group
          class="scoringStrategy"
          v-model="formSearchParams.scoringStrategy"
          type="button"
        >
          <a-radio value="0">自定义</a-radio>
          <a-radio value="1">AI</a-radio>
        </a-radio-group>
      </div>
    </a-grid>
    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        style="width: 100px; margin-right: 24px"
      >
        搜索
      </a-button>
      <a-button type="primary" style="width: 100px" @click="doReset">
        重置
      </a-button>
    </a-form-item>
  </a-form>
  <a-table
    :columns="columns as any"
    :data="dataList"
    :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total,
    }"
    :scrollbar="scrollbar"
    @page-change="onPageChange"
  >
    <template #resultPicture="{ record }">
      <a-image width="64" :src="record.resultPicture" />
    </template>
    <template #appType="{ record }">
      {{ APP_TYPE_MAP[record.appType] }}
    </template>
    <template #scoringStrategy="{ record }">
      {{ APP_SCORING_STRATEGY_MAP[record.scoringStrategy] }}
    </template>
    <template #createTime="{ record }">
      {{
        record.createTime &&
        dayjs(record.createTime).format("YYYY-MM-DD HH:mm:ss")
      }}
    </template>
    <template #updateTime="{ record }">
      {{
        record.updateTime &&
        dayjs(record.updateTime).format("YYYY-MM-DD HH:mm:ss")
      }}
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button status="danger" @click="doDelete(record)">删除</a-button>
      </a-space>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import {
  deleteUserAnswerUsingPost,
  listUserAnswerByPageUsingPost,
} from "@/api/userAnswerController";
import dayjs from "dayjs";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";

const scrollbar = ref(true);
const formSearchParams = ref<API.UserAnswerQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.UserAnswerQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.UserAnswer[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  // eslint-disable-next-line no-undef
  const res = await listUserAnswerByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    total.value = res.data.data?.total || 0;
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

/**
 * 执行搜索
 */
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...formSearchParams.value,
  };
};
const doReset = () => {
  searchParams.value = {
    ...initSearchParams,
  };
  formSearchParams.value = {
    ...initSearchParams,
  };
};

/**
 * 当分页变化时，改变搜索条件，触发数据加载
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 删除
 * @param record
 */
const doDelete = async (record: API.UserAnswer) => {
  if (!record.id) {
    return;
  }

  const res = await deleteUserAnswerUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    loadData();
  } else {
    message.error("删除失败，" + res.data.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData();
});

// 表格列配置
const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 100,
  },
  {
    title: "结果id",
    dataIndex: "resultId",
    width: 140,
  },
  {
    title: "结果名称",
    dataIndex: "resultName",
    width: 150,
  },
  {
    title: "结果描述",
    dataIndex: "resultName",
    width: 200,
  },
  {
    title: "结果图片",
    dataIndex: "resultPicture",
    slotName: "resultPicture",
  },
  {
    title: "结果分数",
    dataIndex: "resultScore",
    width: 100,
  },
  {
    title: "应用id",
    dataIndex: "appId",
    width: 100,
  },
  {
    title: "应用类型",
    dataIndex: "appType",
    slotName: "appType",
    width: 100,
  },
  {
    title: "评分策略",
    dataIndex: "scoringStrategy",
    slotName: "scoringStrategy",
    width: 100,
  },
  {
    title: "用户答案",
    dataIndex: "choices",
    width: 200,
  },
  {
    title: "创建用户id",
    dataIndex: "userId",
    width: 140,
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
    width: 250,
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
    width: 250,
  },
  {
    title: "操作",
    slotName: "optional",
    fixed: "right",
    width: 90,
  },
];
</script>
