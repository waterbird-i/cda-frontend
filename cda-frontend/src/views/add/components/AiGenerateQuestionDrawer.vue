<template>
  <a-button type="primary" @click="handleClick">AI 生成题目</a-button>
  <a-drawer
    title="AI生成题目"
    placement="right"
    :closable="false"
    :visible="visible"
    :width="340"
    @ok="handleOk"
    @cancel="handleCancel"
    unmount-on-close
  >
    <template #title>AI 生成题目</template>
    <div>
      <a-form
        :model="form"
        layout="vertical"
        label-align="left"
        auto-label-width
        @submit="handleSubmit"
      >
        <a-form-item label="应用 id">
          {{ appId }}
        </a-form-item>
        <a-form-item label="题目数量" field="questionNumber">
          <a-input-number
            v-model="form.questionNumber"
            :min="0"
            :max="20"
            placeholder="请输入题目数量"
          />
        </a-form-item>
        <a-form-item label="选项数量" field="optionNumber">
          <a-input-number
            v-model="form.optionNumber"
            :min="0"
            :max="6"
            placeholder="请输入选项数量"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="submitting"
            style="width: 120px; margin-right: 10px"
            >一键生成
          </a-button>
          <a-button
            type="primary"
            :loading="sseSubmitting"
            style="width: 120px"
            @click="handleSSESumbit"
            >实时生成
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </a-drawer>
</template>
<script setup lang="ts">
import { withDefaults, defineProps, ref, reactive } from "vue";
import API from "@/api";
import { aiGenerateQuestionUsingPost } from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";

interface Props {
  appId: string;
  onSuccess: (result: API.QuestionContentDTO[]) => void;
  onSSESuccess: (result: API.QuestionContentDTO[]) => void;
  onSSEClose: (event: any) => void;
  onSSEStart: (event: any) => void;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return "";
  },
});
const visible = ref<boolean>(false);
const submitting = ref<boolean>(false);
const sseSubmitting = ref<boolean>(false);
const form = reactive<API.AiGenerateQuestionRequest>({
  questionNumber: 10,
  optionNumber: 2,
});
const handleClick = () => {
  visible.value = true;
};
const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
};
/**
 * 提交
 */
const handleSubmit = async () => {
  if (!props.appId) return;
  submitting.value = true;
  const res: any = await aiGenerateQuestionUsingPost({
    appId: props.appId as never,
    ...form,
  });
  if (res.data.code === 0 && res.data.data.length > 0) {
    if (props.onSuccess) {
      props.onSuccess(res.data.data);
    } else {
      message.success("生成成功");
    }
    handleCancel();
  } else {
    message.error("操作失败," + res.data.message);
  }
  submitting.value = false;
};
/**
 * sse提交
 */
const handleSSESumbit = () => {
  if (!props.appId) return;
  sseSubmitting.value = true;
  const eventSource = new EventSource(
    "http://localhost:8101/api/question/ai_generate/sse" +
      `?appId=${props.appId}&optionNumber=${form.optionNumber}&questionNumber=${form.questionNumber}`
  );
  let first = true;
  eventSource.onmessage = function (event) {
    // 第一次收到数据,关闭抽屉组件
    if (first) {
      props.onSSEStart?.(event);
      handleCancel();
      first = !first;
    }
    // 调用父组件的回调函数，每生成一条数据就调用一次
    props.onSSESuccess(JSON.parse(event.data));
  };
  // 生成结束，关闭连接
  eventSource.onerror = function (event) {
    if (event.eventPhase === EventSource.CLOSED) {
      props.onSSEClose?.(event);
      eventSource.close();
    } else {
      eventSource.close();
    }
  };
  sseSubmitting.value = false;
};
</script>

<style scoped></style>
