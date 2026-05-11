<script setup>
import { ref } from 'vue'
import MarkDownRender from '@/components/MarkDownRender.vue'
import {useRouter} from 'vue-router'
const openEditer = ref(false)


const router = useRouter()
let blogContext = ref({
    uid: '500',
    title: '',
    context: '',
    faceImage: '',
    type: '#other',
    tag: '',
})

const closedrawer=()=>{
    openEditer.value = false
    router.push('/blog')
}
</script>


<template>
    <div>
        <div>
            <img src="../../../../public/ojlogo2.jpg" width="50" height="50" />
            <h2 class="mb-4 text-2xl font-bold" style="float: left;">讨论区</h2>
            <!-- 发布讨论 -->
            <button @click="openEditer = true"
                class="group rounded-2xl h-12 w-48 bg-green-500 font-bold text-lg text-white relative overflow-hidden"
                style="float: right;">

                发布讨论

                <div
                    class="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl">
                </div>
            </button>
        </div>
       
    </div>
    
    <el-drawer v-model="openEditer" direction="btt" size="70%">
        <mark-down-render @close="closedrawer"></mark-down-render>
    </el-drawer>
</template>



<style scoped></style>