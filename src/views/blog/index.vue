<script lang="ts" setup>
import BlogHeader from "./components/BlogHeader.vue";
import BlogCard from "./components/BlogCard.vue"
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from "vue-router";

import req from "@/utils/request"

const route = useRoute()
const router = useRouter()

const tp = ref(50)
const info = ref({ ind: '', p: 1 })
const blogList = ref([])

const hpage = (e) => {       //根据当前选择的topic进行页数查询
  req.get("/blog/" + info.value.ind, { params: { p: e, ps: 5 } }
  ).then(res => {
    blogList.value = res.data.data.records
    tp.value = res.data.data.total
  })
}

const handleSelect = (index: any) => { //更改类型

  info.value.ind = index
  req.get("/blog/" + index, { params: { p: 1, ps: 5 } }).then(res => {

    blogList.value = res.data.data.records
    tp.value = res.data.data.total
  })

}

onMounted(() => {
  req.get("/blog/", { params: { p: 1, ps: 5 } }).then(res => {

    blogList.value = res.data.data.records
    tp.value = res.data.data.total
  })
})

</script>



<template>
  <el-container>
    <el-aside width="20%">


    </el-aside>
    <el-container style="min-height: 105vh;">

      <el-main>
        <el-card shadow="always" style="height: 100%">


          <RouterView></RouterView>

          <BlogHeader />


          <div style="margin-top: 50px;">
            <el-menu :default-active="1" class="el-menu-demo" mode="horizontal" @select="handleSelect"
              active-text-color="#16a34a">
              <el-menu-item index="">全部</el-menu-item>
              <el-menu-item index="comp">竞赛</el-menu-item>
              <el-menu-item index="tech">技术</el-menu-item>
              <el-menu-item index="solu">题解</el-menu-item>
              <el-menu-item index="work">工作</el-menu-item>
            </el-menu>
          </div>

          <div>
            <BlogCard v-for="blog in blogList" :key="blog.id" :blog="blog" />
            <el-pagination background layout="prev, pager, next" :total="tp" @current-change="hpage"
              :default-page-size="3" />
          </div>

        </el-card>
      </el-main>

      <el-footer>
      </el-footer>

    </el-container>
    <el-aside width="20%"></el-aside>
  </el-container>
</template>





<style></style>