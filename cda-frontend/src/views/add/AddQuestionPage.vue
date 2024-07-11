<template>1</template>
<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";

const questionContent = reactive([] as API.QuestionContentDTO[]);
/**
 * 添加题目
 * @param index
 */
const addQuestion = (index: number) => {
  questionContent.splice(index, 0, {
    title: "",
    options: [],
  });
};
/**
 * 删除题目
 * @param index
 */
const deleteQuestion = (index: number) => {
  questionContent.splice(index, 1);
};
</script>
<style scoped></style>
