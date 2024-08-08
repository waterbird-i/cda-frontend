<template>
  <div id="appStatisticPage">
    <v-chart :option="appAnswerCountOptions" style="height: 300px" />
    <div class="searchBar">
      <a-input-search
        :style="{ width: '320px' }"
        placeholder="输入 appId"
        button-text="搜索"
        search-button
        @search="(value) => loadAppAnswerResultCountData(value)"
      />
    </div>
    <v-chart :option="appAnswerResultCountOptions" style="height: 300px" />
  </div>
  <div style="margin-bottom: 16px" />
</template>
<script setup lang="ts">
import VChart from "vue-echarts";
import "echarts";
import { computed, ref, watchEffect } from "vue";
import API from "@/api";
import {
  getAppAnswerCountUsingGet,
  getAppAnswerResultCountUsingGet,
} from "@/api/appStatisticController";
import message from "@arco-design/web-vue/es/message";
import * as echarts from "echarts/core";

const appAnswerCountList = ref<API.AppAnswerCountDTO[]>([]);
const appAnswerResultCountList = ref<API.AppAnswerResultCountDTO[]>([]);
/**
 * 获取应用答题统计
 */
const loadAppAnswerCountData = async () => {
  const res: any = await getAppAnswerCountUsingGet();
  if (res.data.data === 0) {
    appAnswerCountList.value = res.data.data || [];
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};
/**
 * 获取应用答题结果统计
 * @param appId
 */
const loadAppAnswerResultCountData = async (appId: string) => {
  if (!appId) return;
  const res: any = await getAppAnswerResultCountUsingGet({
    appId: appId as any,
  });
  if (res.data.data === 0) {
    appAnswerResultCountList.value = res.data.data || [];
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};

watchEffect(() => {
  loadAppAnswerCountData();
  loadAppAnswerResultCountData("");
});
// 统计选项
const appAnswerCountOptions = computed(() => {
  return {
    title: {
      text: "热门应用统计",
    },
    xAxis: {
      data: appAnswerCountList.value.map((item) => item.appId),
      name: "应用 id",
      axisLabel: {
        inside: true,
        color: "#fff",
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      z: 10,
    },
    yAxis: {
      type: "value",
      name: "用户答案数",
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#999",
      },
    },
    dataZoom: [
      {
        type: "inside",
      },
    ],
    series: [
      {
        type: "bar",
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "#83bff6" },
            { offset: 0.5, color: "#188df0" },
            { offset: 1, color: "#188df0" },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#2378f7" },
              { offset: 0.7, color: "#2378f7" },
              { offset: 1, color: "#83bff6" },
            ]),
          },
        },
        data: appAnswerCountList.value.map((item) => item.answerCount),
      },
    ],
  };
});
const appAnswerResultCountOptions = computed(() => {
  return {
    title: {
      text: "应用结果统计",
      left: "center",
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b} : {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: appAnswerResultCountList.value.map((item) => {
          return {
            value: item.resultCount,
            name: item.resultName,
          };
        }),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
});
</script>

<style scoped></style>
