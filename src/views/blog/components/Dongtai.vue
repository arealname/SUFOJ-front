<script lang="ts" setup>
import { onMounted,ref } from "vue";
import { useRoute } from "vue-router";
import req from "@/utils/request";
import BlogCard from "./BlogCard.vue"
onMounted(async () => {
    req.get("/blog/dt").then(res => {
        blogList.value = res.data.data;
        console.log(blogList.value)
    })
})


const route = useRoute()

const blogList=ref([])
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
            <div  v-if="blogList.length"> 
              <BlogCard v-for="blog in blogList" :key="blog.id" :blog="blog" />
            </div>
           
            
              <div v-else>暂时没有关注</div>
         

        </el-card>
      </el-main>

      <el-footer>
      </el-footer>

    </el-container>
    <el-aside width="20%"></el-aside>
  </el-container>

</template>



<style>

</style>