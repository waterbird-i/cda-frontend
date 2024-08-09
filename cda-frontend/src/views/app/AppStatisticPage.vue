<template>
  <div id="appStatisticPage">
    <v-chart
      ref="chartRef"
      :option="appAnswerCountOptions"
      style="height: 800px"
      @click="onChartClick"
    />
    <div class="searchBar">
      <a-input-search
        :style="{ width: '320px', marginBottom: '16px' }"
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
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);

const appAnswerCountList = ref<API.AppAnswerCountDTO[]>([]);
const appAnswerResultCountList = ref<API.AppAnswerResultCountDTO[]>([]);
const chartRef = ref<{
  chart: echarts.ECharts;
} | null>(null);
/**
 * 获取应用答题统计
 */
const loadAppAnswerCountData = async () => {
  const res: any = await getAppAnswerCountUsingGet();
  if (res.data.code === 0) {
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
  if (res.data.code === 0) {
    appAnswerResultCountList.value = res.data.data || [];
  } else {
    message.error("获取数据失败" + res.data.message);
  }
};

watchEffect(() => {
  loadAppAnswerCountData();
  loadAppAnswerResultCountData("3");
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
        barMaxWidth: 160, // 设置每个柱的最大宽度
        label: {
          show: true,
          position: "top",
        },
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
// Enable data zoom when user click bar.

const onChartClick = (params: any) => {
  const zoomSize = 4; // 设置缩放大小
  const chartInstance = chartRef.value?.chart;
  const data = appAnswerCountList.value.map((item) => item.appId);
  if (chartInstance) {
    const startValue = data[Math.max(params.dataIndex - zoomSize / 2, 0)];
    const endValue =
      data[
        Math.min(
          params.dataIndex + zoomSize / 2,
          appAnswerCountList.value.length - 1
        )
      ];
    // 触发缩放
    chartInstance.dispatchAction({
      type: "dataZoom",
      startValue,
      endValue,
    });
  }
};

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
      orient: "horizontal",
      left: "left",
      data: appAnswerResultCountList.value.map((item) => item.resultName),
    },
    series: [
      {
        name: `应用ID`,
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: appAnswerResultCountList.value.map((item) => {
          return {
            value: parseInt(item.resultCount || "0"),
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
      {
        name: `应用ID${appAnswerResultCountList.value[0]}`,
        type: "pie",
        radius: "55%",
        center: ["50%", "60%"],
        data: appAnswerResultCountList.value.map((item) => {
          return {
            value: parseInt(item.resultCount || "0"),
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
