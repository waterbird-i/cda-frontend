<template>
  <div id="addQuestionPage">
    <h2 style="margin-bottom: 32px">创建题目</h2>
    <div class="form-container">
      <a-form
        :model="questionContent"
        :style="{ width: '480px' }"
        @submit="handleSubmit"
        label-align="left"
        auto-label-width
      >
        <a-form-item label="应用id">{{ props.appId }}</a-form-item>
        <a-form-item
          label="题目列表"
          :content-flex="false"
          :merge-props="false"
        >
          <a-button @click="addQuestion(questionContent.length)" type="primary"
            >底部添加题目
          </a-button>
          <div v-for="(question, index) in questionContent" :key="index">
            <a-space size="large">
              <h3>题目 {{ index + 1 }}</h3>
              <a-button size="mini" @click="addQuestion(index + 1)"
                >添加题目
              </a-button>
              <a-button
                size="mini"
                status="danger"
                @click="deleteQuestion(index)"
              >
                删除题目
              </a-button>
            </a-space>
            <a-form-item :label="`题目 ${index + 1} 标题`">
              <a-input v-model="question.title" placeholder="请输入题目标题" />
            </a-form-item>
            <h3>题目 {{ index + 1 }} 选项列表</h3>
            <a-space size="large">
              <h4>题目 {{ index + 1 }} 选项列表</h4>
              <a-button
                size="mini"
                @click="addQuestionOption(question, question.options.length)"
                >底部添加选项
              </a-button>
            </a-space>
            <a-form-item
              v-for="(option, optionIndex) of question.options"
              :label="`选项 ${optionIndex + 1}`"
              :key="optionIndex"
              :content-flex="false"
              :merge-props="false"
            >
              <a-form-item label="选项 key">
                <a-input v-model="option.key" placeholder="请输入选项key" />
              </a-form-item>
              <a-form-item label="选项值">
                <a-input v-model="option.value" placeholder="请输入选项值" />
              </a-form-item>
              <a-form-item label="选项结果">
                <a-input v-model="option.result" placeholder="请输入选项结果" />
              </a-form-item>
              <a-form-item label="选项分数">
                <a-input-number
                  v-model="option.score"
                  placeholder="请输入选项分数"
                />
              </a-form-item>
              <a-space>
                <a-button
                  size="mini"
                  @click="addQuestionOption(question, optionIndex + 1)"
                  >添加选项
                </a-button>
                <a-button
                  size="mini"
                  status="danger"
                  @click="deleteQuestionOption(question, optionIndex + 1)"
                  >删除选项
                </a-button>
              </a-space>
            </a-form-item>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 120px">
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps, watchEffect } from "vue";
import API from "@/api";
import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const props = defineProps<{ appId: number }>();
const questionContent = ref([] as API.QuestionContentDTO[]);
const oldQuestion = ref<API.QuestionVO>();

const loadData = async () => {
  if (!props.appId) {
    return;
  }
  const res = await listQuestionVoByPageUsingPost({
    appId: props.appId,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    oldQuestion.value = res.data.data.records[0];
    if (oldQuestion.value) {
      questionContent.value = oldQuestion.value.questionContent ?? [];
    }
  } else {
    message.error("获取题目失败, " + res.data.message);
  }
};
watchEffect(() => {
  loadData();
});
/**
 * 添加题目
 * @param index
 */
const addQuestion = (index: number) => {
  questionContent.value.splice(index, 0, {
    title: "",
    options: [],
  });
};
/**
 * 删除题目
 * @param index
 */
const deleteQuestion = (index: number) => {
  questionContent.value.splice(index, 1);
};
/**
 * 添加题目选项
 * @param question
 * @param index
 */
const addQuestionOption = (question: API.QuestionContentDTO, index: number) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 0, {
    key: "",
    value: "",
  });
};
/**
 * 删除题目选项
 * @param question
 * @param index
 */
const deleteQuestionOption = (
  question: API.QuestionContentDTO,
  index: number
) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 1);
  loadData();
};
const router = useRouter();
/**
 * 提交
 */
const handleSubmit = async () => {
  if (!props.appId || !questionContent.value) return;
  let res;
  if (oldQuestion.value?.id) {
    res = await editQuestionUsingPost({
      id: oldQuestion.value?.id,
      questionContent: questionContent.value,
    });
  } else {
    res = await addQuestionUsingPost({
      appId: props.appId,
      questionContent: questionContent.value,
    });
  }
  if (res.data.code === 0) {
    message.success("创建成功，即将跳转到应用详情页");
    setTimeout(() => {
      router.push(`/app/detail/${props.appId}`);
    }, 3000);
  } else {
    message.error("创建失败, " + res.data.message);
  }
};
</script>
<style scoped>
#addQuestionPage {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-container {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
