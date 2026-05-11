<script setup>
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
import req from '@/utils/request.js'
import { useUserStore } from '@/stores'
const userStore = useUserStore()

const user = ref(userStore.user)
function getVirtualData(year) {
    const date = +echarts.time.parse(year + '-01-01');
    const end = +echarts.time.parse(+year + 1 + '-01-01');
    const dayTime = 3600 * 24 * 1000;
    const data = [];
    for (let time = date; time < end; time += dayTime) {
        data.push([
            echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
            Math.floor(Math.random() * 10)
        ]);
    }
    return data;
}



onMounted(() => {
    initData();

})



function initData() {
    option = {
        title: {
            top: 30,
            left: 'center',
            text: 'Daily Step Count'
        },
        tooltip: {},
        visualMap: {
            pieces: [
                { gte: 10, color: "#529b2e" },
                { gte: 8, lte: 10, color: "#95d475" },
                { gte: 5, lte: 8, color: "#b3e19d" },
                { gte: 2, lte: 5, color: "#d1edc4" },
                { gte: 0, lte: 2, color: "#e1f3d8" },
                { lte: 0, color: "#f0f9eb" }
            ],
            min: 0,
            max: 10000,
            type: 'piecewise',
            orient: 'horizontal',
            left: 'center',
            top: 65,
        },
        calendar: {
            top: 120,
            left: 30,
            right: 30,
            cellSize: ['auto', 13],
            range: '2016',
            itemStyle: {
                borderWidth: 0.5
            },
            yearLabel: { show: false }
        },
        series: {
            type: 'heatmap',
            coordinateSystem: 'calendar',
            data: getVirtualData('2016')
        }
    };
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    var option;

    option && myChart.setOption(option);
}



</script>

<template>
    <div id="main" style="width: 550px;height:250px;"></div>
</template>