<template>
  <div id="appDetailPage">
    <a-card>
      <a-row style="margin-bottom: 16px">
        <a-col flex="auto" class="content-wrapper">
          <h2>{{ data.appName }}</h2>
          <p>{{ data.appDesc }}</p>
          <p>应用类型：{{ APP_TYPE_MAP[data.appType as number] }}</p>
          <p>
            评分策略：{{
              APP_SCORING_STRATEGY_MAP[data.scoringStrategy as number]
            }}
          </p>
          <p>
            <a-space>
              作者：
              <div :style="{ display: 'flex', alignItems: 'center' }">
                <a-avatar
                  :size="24"
                  :image-url="data.user?.userAvatar"
                  :style="{ marginRight: '8px' }"
                />
                <a-typography-text
                  >{{ data.user?.userName ?? "无名" }}
                </a-typography-text>
              </div>
            </a-space>
          </p>
          <p>
            创建时间：{{
              data.createTime &&
              dayjs(data.createTime).format("YYYY-MM-DD HH:mm:ss")
            }}
          </p>
          <a-space>
            <a-button type="primary" :href="`/answer/do/${id}`">
              开始答题
            </a-button>
            <a-button> 分享应用</a-button>
            <a-button v-if="isMy" :href="`/add/question/${id}/${data.appType}`">
              设置题目
            </a-button>
            <a-button v-if="isMy" :href="`/add/scoring_result/${id}`">
              设置评分
            </a-button>
            <a-button v-if="isMy" :href="`/update/app/${id}`">
              修改应用</a-button
            >
          </a-space>
        </a-col>
        <a-col flex="320px">
          <a-image width="100%" :src="data.appIcon" />
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import { withDefaults, defineProps, ref, watchEffect, computed } from "vue";
import { getAppVoByIdUsingGet } from "@/api/appController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { APP_TYPE_MAP, APP_SCORING_STRATEGY_MAP } from "@/constant/app";
import dayjs from "dayjs";
import { useLoginUserStore } from "@/store/userStore";

const data = ref<API.AppVO>({});

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => {
    return "";
  },
});
const loginUserStore = useLoginUserStore();
let loginUserId = loginUserStore.loginUser?.id;
const isMy = computed(() => {
  return loginUserId && loginUserId === data.value.userId;
});
const loadData = async () => {
  if (!props.id) {
    return;
  }
  const res = await getAppVoByIdUsingGet({
    id: props.id as never,
  });
  if (res.data.code === 0 && res.data.data) {
    data.value = res.data.data;
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};

watchEffect(() => {
  loadData();
});
</script>

<style scoped>
#appDetailPage {
}

#appDetailPage .content-wrapper > * {
  margin-bottom: 24px;
}
</style>
