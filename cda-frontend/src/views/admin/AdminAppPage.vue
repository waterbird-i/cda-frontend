<template>
  <a-form
    :model="formSearchParams"
    :style="{ marginBottom: '20px' }"
    layout="inline"
    @submit="doSearch"
  >
    <a-form-item field="appName" label="应用名">
      <a-input
        v-model="formSearchParams.appName"
        placeholder="请输入应用名"
        allow-clear
      />
    </a-form-item>
    <a-form-item field="appDesc" label="应用描述">
      <a-input
        v-model="formSearchParams.appDesc"
        placeholder="请输入应用描述"
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
      <div>
        <a-radio-group v-model="formSearchParams.reviewStatus" type="button">
          <a-radio value="0">待审核</a-radio>
          <a-radio value="1">通过</a-radio>
          <a-radio value="2">拒绝</a-radio>
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
    :columns="columns"
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
    <template #appIcon="{ record }">
      <a-image width="64" :src="record.appIcon" />
    </template>
    <template #appType="{ record }">
      {{ APP_TYPE_MAP[record.appType] }}
    </template>
    <template #scoringStrategy="{ record }">
      {{ APP_SCORING_STRATEGY_MAP[record.scoringStrategy] }}
    </template>
    <template #reviewStatus="{ record }">
      {{ REVIEW_STATUS_MAP[record.reviewStatus] }}
    </template>
    <template #reviewTime="{ record }">
      {{
        record.reviewTime &&
        dayjs(record.reviewTime).format("YYYY-MM-DD HH:mm:ss")
      }}
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
        <a-button
          v-if="record.reviewStatus !== REVIEW_STATUS_ENUM.PASS"
          @click="doReview(record, REVIEW_STATUS_ENUM.PASS)"
          status="success"
          >通过
        </a-button>
        <a-button
          v-if="record.reviewStatus !== REVIEW_STATUS_ENUM.REJECT"
          @click="doReview(record, REVIEW_STATUS_ENUM.REJECT, '拒绝上架')"
          status="warning"
          >拒绝
        </a-button>
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
  deleteAppUsingPost,
  doAppReviewUsingPost,
  listAppByPageUsingPost,
} from "@/api/appController";
import dayjs from "dayjs";
import {
  APP_TYPE_MAP,
  REVIEW_STATUS_ENUM,
  REVIEW_STATUS_MAP,
  APP_SCORING_STRATEGY_MAP,
} from "@/constant/app";

const scrollbar = ref(true);
const formSearchParams = ref<API.AppQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.AppQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.App[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listAppByPageUsingPost(searchParams.value);
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
const doDelete = async (record: API.App) => {
  if (!record.id) {
    return;
  }

  const res = await deleteAppUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    loadData();
  } else {
    message.error("删除失败，" + res.data.message);
  }
};
/**
 * 审核
 * @param record
 * @param reviewStatus
 */
const doReview = async (
  record: API.App,
  reviewStatus: number,
  reviewMessage?: string
) => {
  if (!record.id) {
    return;
  }
  const res = await doAppReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  });
  if (res.data.code === 0) {
    loadData();
  } else {
    message.error("审核失败，" + res.data.message);
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
    title: "应用名",
    dataIndex: "appName",
    width: 180,
  },
  {
    title: "应用图标",
    dataIndex: "appIcon",
    slotName: "appIcon",
  },
  {
    title: "应用描述",
    dataIndex: "appDesc",
    width: 200,
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
    title: "审核状态",
    dataIndex: "reviewStatus",
    slotName: "reviewStatus",
    width: 100,
  },
  {
    title: "审核人id",
    dataIndex: "reviewerId",
    width: 100,
  },
  {
    title: "审核消息",
    dataIndex: "reviewMessage",
    width: 200,
  },
  {
    title: "审核时间",
    dataIndex: "reviewTime",
    slotName: "reviewTime",
    width: 250,
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
    width: 100,
  },
];
</script>
