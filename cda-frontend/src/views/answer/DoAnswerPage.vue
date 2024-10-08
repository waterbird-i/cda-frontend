<template>
  <div id="doAnswerPage">
    <a-card>
      <h1>{{ app?.appName }}</h1>
      <p>{{ app?.appDesc }}</p>
      <h2 style="margin-bottom: 16px">
        {{ currentQuestion?.title }}
      </h2>
      <div>
        <a-radio-group
          v-model="currentAnswerIndex"
          direction="vertical"
          :options="questionOptions as any"
          @change="doRadioChange as any"
          size="large"
        />
      </div>
      <div style="margin-top: 24px">
        <a-space size="large">
          <a-button
            type="primary"
            circle
            v-if="current < questionContent.length"
            :disabled="!currentAnswerIndex"
            @click="current += 1"
          >
            下一题
          </a-button>
          <a-button
            type="primary"
            v-if="current === questionContent.length"
            circle
            :disabled="!currentAnswerIndex"
            @click="doSubmit"
            :loading="loading"
            >查看结果
          </a-button>
          <a-button v-if="current > 1" circle @click="current -= 1"
            >上一题
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>
<script setup lang="ts">
import {
  computed,
  defineProps,
  reactive,
  ref,
  watchEffect,
  withDefaults,
} from "vue";
import { getAppVoByIdUsingGet } from "@/api/appController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { listQuestionVoByPageUsingPost } from "@/api/questionController";
import {
  addUserAnswerUsingPost,
  generateUserAnswerIdUsingGet,
} from "@/api/userAnswerController";
import { useRouter } from "vue-router";

interface Props {
  appId: string;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return "";
  },
});
const app = ref<API.AppVO>();
const id = ref<number>();
const questionContent = ref<API.QuestionContentDTO[]>([]);

const loading = ref<boolean>(false);

// 当前题目序号
const current = ref<number>(1);
// 当前题目
const currentQuestion = ref<API.QuestionContentDTO>({});

const currentAnswerIndex = ref<string>();

const answerList = reactive<string[]>([]);

const loadData = async () => {
  if (!props.appId) return;
  let res: any = await getAppVoByIdUsingGet({
    id: props.appId as any,
  });
  if (res.data.code === 0) {
    app.value = res.data.data;
  } else {
    message.error("获取应用信息失败", res.data.message);
  }
  res = await listQuestionVoByPageUsingPost({
    appId: props.appId as any,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    questionContent.value = res.data.data.records[0].questionContent;
  } else {
    message.error("获取题目失败", res.data.message);
  }
};
watchEffect(() => {
  loadData();
});

// 改变 current 题号后，会自动更新当前题目和答案
watchEffect(() => {
  currentQuestion.value = questionContent.value[current.value - 1];
  currentAnswerIndex.value = answerList[current.value - 1];
});

// 生成唯一 id
const generateId = async () => {
  let res: any = await generateUserAnswerIdUsingGet();
  if (res.data.code === 0) {
    id.value = res.data.data as any;
  } else {
    message.error("获取唯一 id 失败，" + res.data.message);
  }
};

const questionOptions = computed(() => {
  return currentQuestion.value?.options
    ? currentQuestion.value.options.map((option) => ({
        label: `${option.key}.${option.value}`,
        value: option.key,
      }))
    : [];
});

const doRadioChange = (value: string) => {
  currentAnswerIndex.value = value;
  // 记录回答
  answerList[current.value - 1] = value;
};
const router = useRouter();

const doSubmit = async () => {
  loading.value = true;
  await generateId();
  const res = await addUserAnswerUsingPost({
    id: id.value,
    appId: props.appId as never,
    choices: answerList,
  });
  if (res.data.code === 0 && res.data.data) {
    loading.value = false;
    router.push(`/answer/result/${res.data.data}`);
  } else {
    message.error("提交答案失败" + res.data.message);
  }
};
</script>
<style scoped></style>
