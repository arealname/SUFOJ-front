<script setup>
import { onMounted, ref } from 'vue'
import req from '@/utils/request'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores'
import Codeview from '@/components/codeview.vue';

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const user = ref(userStore.user)


const tableData = ref([
    {
        questionName: 'A+B',
        language: 'C',
        status: '未完成'

    },
    {
        questionName: 'A+B',
        language: 'C',
        status: 'Accept'
    },
    {
        questionName: 'A+B',
        language: 'C',
        status: 'Complier wrong'
    }
])

const pafinished = ref(false)


onMounted(async() => {
    loadingRecord.value = true
    setTimeout(() => {
        loadingRecord.value = false
    }, 300)

   await getpersonnalrecord()
   pafinished.value = true
})

const loadingRecord = ref(false)

const getpersonnalrecord = async() => {

   await req.post("/problem/record", {
        uid: user.value.id
    }).then(res => {
        tableData.value = res.data.data
        console.log(tableData.value);
    })
}

const toProblemDetial = (id) => {
    router.push({ path: '/problem/' + id })
}



</script>

<template>

    <el-table :data="tableData" stripe style="width: 100%;font-size: 12px;" v-loading="loadingRecord" element-loading-text="正在拼命加载中...">

        <el-table-column prop="ques" label="题目" style="width: 20%;">
            <template #default="scope">
                <el-button type="primary" @click="toProblemDetial(scope.row.qid)" link>
                    {{ scope.row.quesName }}</el-button>
            </template>
        </el-table-column>

        <el-table-column prop="code" label="代码" style="width: 15%;">
            <template #default="scope">
                <el-popover placement="right" :width="400" trigger="click">
                    <template #reference>
                        <el-button style="margin-right: 16px" link>{{ scope.row.language }}</el-button>
                    </template>
                    <Codeview :value="scope.row.code" v-if="pafinished"></Codeview>
                </el-popover>
            </template>
        </el-table-column>

        <el-table-column prop="submitTime" label="时间" style="width: 15%;" />
        
    
    </el-table>



</template>
