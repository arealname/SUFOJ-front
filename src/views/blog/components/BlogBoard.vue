<script lang="ts" setup>
import { onMounted } from "vue"
import { ref } from "vue"
import { useRouter, useRoute } from "vue-router";
import BlogCard from "./BlogCard.vue";
import req from "@/utils/request"
const blogList = ref([])


onMounted(() => {
   const t = useRoute().params.t
   
   req.get("/blog/" + t,{params:{p:1,ps:5}}).then(res => {
      console.log(res);
      blogList.value = res.data.data.records
   })
})
</script>
<template>
   <div>
      <el-container>
         <el-container style="min-height: 105vh;">

            <el-main>
               <el-card shadow="always" style="height: 100%">


                  <!-- <RouterView></RouterView>

                  <BlogHeader /> -->

                  <div>
                     <BlogCard v-for="blog in blogList" :key="blog.id" :blog="blog" />
                  </div>

               </el-card>
            </el-main>

            <el-footer>
            </el-footer>

         </el-container>
      </el-container>

   </div>



</template>