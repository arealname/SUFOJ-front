<script setup>

</script>

<template>
    <div style="align-items: center;justify-content: center;display: flex;flex-direction: column;">
        <div
            style="height: 400px; width: 100%; background-color:black;color: white;align-items: center;justify-content: center;display: flex;flex-direction: column;">

            <img src="@/assets/cup2.svg" style="width: 100px;height: 100px;" alt="">
            <p style="font-size: 20px;font-weight: bold;">Code 竞赛</p>
            <p style="font-size: 20px;margin-top: 20px;">快来参加竞赛提升排名</p>

        </div>
        <div  style="margin-top: -50px;display: flex;flex-direction: row;justify-content:space-between">
            <div
                style="width: 400px;height: 200px;padding-left: 20px;padding: 10px; background-color: grey;border-radius: 10px;align-items: left;justify-content: center;display: flex;flex-direction: column;margin-right: 20px">
                <p style="font-size: 20px;font-weight: bold;color: aliceblue;">第N场周赛</p>
                <p style="color:aliceblue">时间:2024.12.31 10:30 ~ 12:00</p>
                <p style="color:aliceblue">距离开始还有 天 小时 分</p>
                <el-button type="primary" style="width: 100px;">进入竞赛</el-button>
            </div>
            <div
                style="width: 270px;height: 200px;padding-left: 20px;padding: 10px;background-color: black;border-radius: 10px;align-items: left;justify-content: center;display: flex;flex-direction: column">
                <p style="font-size: 20px;font-weight: bold;color: aliceblue;">第M场双周赛</p>
                <p style="color:aliceblue">时间:2024.12.31 22:30 ~ 00:00</p>
                <p style="color:aliceblue">距离开始还有 天 小时 分</p>
                <el-button type="primary" style="width: 100px;">进入竞赛</el-button>
            </div>
        </div>
    </div>
</template>



<style></style>