<template>
  <div id="addScoringResultPage">
    <h2 style="margin-bottom: 32px">创建评分结果</h2>
    <div class="form-container">
      <a-form
        :model="form"
        :style="{ width: '480px' }"
        @submit="handleSubmit"
        label-align="left"
        auto-label-width
      >
        <a-form-item field="appId" label="应用id" aria-readonly="true">
          {{ form.appId }}
        </a-form-item>
        <a-form-item field="resultName" label="结果名称">
          <a-input
            v-model="form.resultName"
            :style="{ width: '320px' }"
            placeholder="请输入结果名称"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="resultDesc" label="结果描述">
          <a-input
            v-model="form.resultDesc"
            placeholder="请输入结果描述"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="resultPicture" label="结果图标">
          <PictureUploader
            biz="scoring_result_picture"
            :value="form.resultPicture"
            :onChange="(url) => (form.resultPicture = url)"
          />
        </a-form-item>
        <a-form-item field="resultProp" label="结果集">
          <a-input-tag
            v-model="form.resultProp"
            placeholder="请输入结果集"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="resultScoreRange" label="结果得分范围">
          <a-input-number
            v-model="form.resultScoreRange"
            placeholder="请输入结果得分范围"
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" style="width: 120px"
            >提交
          </a-button>
        </a-form-item>
      </a-form>
    </div>
    <ScoringResultTable :do-update="doUpdate" :appId="props.appId" />
  </div>
</template>
<script setup lang="ts">
import PictureUploader from "@/components/PictureUploader.vue";
import { defineProps, withDefaults, ref } from "vue";
import API from "@/api";
import { addScoringResultUsingPost } from "@/api/scoringResultController";
import message from "@arco-design/web-vue/es/message";
import ScoringResultTable from "@/views/add/components/ScoringResultTable.vue";

interface Props {
  appId: string;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => "",
});
const form = ref({
  resultDesc: "",
  resultName: "",
  resultPicture: "",
} as API.ScoringResultAddRequest);

const handleSubmit = async () => {
  if (!props.appId) return;
  const res = await addScoringResultUsingPost({
    ...form.value,
    appId: props.appId as never,
  });
  if (res.data.code === 0) {
    message.success("创建成功");
  } else {
    message.error("创建失败， " + res.data.message);
  }
};
</script>
<style scoped>
#addScoringResultPage {
  margin-left: 64px;
}
</style>
