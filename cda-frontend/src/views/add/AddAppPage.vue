<template>
  <div id="addAppPage">
    <h2 style="margin-bottom: 32px">创建应用</h2>
    <a-form
      :model="form"
      :style="{ width: '480px' }"
      @submit="handleSubmit"
      label-align="left"
      auto-label-width
    >
      <a-form-item field="appName" label="应用名称">
        <a-input v-model="form.appName" placeholder="请输入应用名称" />
      </a-form-item>
      <!--      <a-form-item field="appIcon" label="应用图标">-->
      <!--        <PictureUploader-->
      <!--          biz="app_icon"-->
      <!--          :value="form.appIcon"-->
      <!--          :onChange="(url) => (form.appIcon = url)"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <a-form-item field="appIcon" label="应用图标">
        <a-input v-model="form.appIcon" placeholder="请输入应用图标地址" />
      </a-form-item>
      <a-form-item field="appDesc" label="应用描述">
        <a-input v-model="form.appDesc" placeholder="请输入应用描述" />
      </a-form-item>
      <a-form-item field="appType" label="应用类型">
        <a-select
          v-model="form.appType"
          placeholder="请选择应用类型"
          allow-clear
        >
          <a-option
            v-for="(value, key) of APP_TYPE_MAP"
            :key="key"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
      </a-form-item>
      <a-form-item field="scoringStrategy" label="评分策略">
        <a-select
          v-model="form.scoringStrategy"
          placeholder="请选择评分策略"
          allow-clear
        >
          <a-option
            v-for="(value, key) of SCORING_STRATEGY_MAP"
            :key="key"
            :value="Number(key)"
            :label="value"
          />
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >添加
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";
import PictureUploader from "@/components/PictureUploader.vue";
import { addAppUsingPost } from "@/api/appController";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import { APP_TYPE_MAP, SCORING_STRATEGY_MAP } from "@/constant/app";

const form = reactive({
  appName: "",
  appDesc: "",
  appIcon: "",
  appType: 0,
  scoringStrategy: 0,
} as API.AppAddRequest);

const router = useRouter();
const handleSubmit = async () => {
  const res = await addAppUsingPost(form);
  if (res.data.code === 0) {
    message.success("创建成功，即将跳转到应用详情页");
    setTimeout(() => {
      router.push(`/app/detail/${res.data.data}`);
    }, 3000);
  } else {
    message.error("创建失败" + res.data.message);
  }
};
</script>

<style scoped></style>
