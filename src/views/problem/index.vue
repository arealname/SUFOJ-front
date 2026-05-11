<script setup>
import { CircleCheck, Search } from '@element-plus/icons-vue'

import { onMounted, ref } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import req from '@/utils/request.js'
import { ElMessage } from 'element-plus'

import {useUserStore} from '@/stores'

const userStore=useUserStore()
const user = ref(userStore.user)

const tableData = ref(
    [{ ispass: true, id: '1001', title: 'A+B', passrate: '30%', difficulty: '中等' },
    { ispass: false, id: '1003', title: 'A+B+c', passrate: '20%', difficulty: '困难' },
    { ispass: false, id: '1002', title: 'A+B-c', passrate: '80%', difficulty: '简单' }]
)
const t = ref(0)
const unfinished = ref(true)

const router = useRouter()
const route=useRoute()
const cdt = ref({
    p: 1, ps: 10, w: ""
})


const todayid = ref(0)

const todaypro = async () => {
    var d = formatTime();
    console.log(d);
    req.get('/problem/dayproblem', { params: { d: d } }).then(res => {
        if (res.data.code == 200) {
            todayid.value = res.data.data;
            return res.data.data;
        } else {
            ElMessage.error(res.data.msg)
        }
    }).then((id) => {
        router.push('/problem/' + id)
    })
}

const checkdid = () => {
    if(user.value.id==null)return;

    console.log(user.value.id);
    req.get('/problem/finishtoday', { params: { uid: user.value.id } }).then(res => {
        if (res.data.code == 200) {
            unfinished.value = res.data.data==0;
            return res.data.data;
        } else {
            ElMessage.error(res.data.msg)
        }
    })
}


function formatTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份补零
    const day = String(date.getDate()).padStart(2, '0'); // 日期补零
    return `${year}-${month}-${day}`;
}




const toProblemDetial = (data) => {

    router.push({ path: '/problem/' + data.id })

}

onMounted(() => {
    checkdid()
    searchcon()
})

const handleCurrentChange = (e) => {
    cdt.value.p = e
    searchcon()
}
const handleSizeChange = (e) => {
    cdt.value.ps = e
    searchcon()
}

const searchcon = () => {
    console.log(cdt.value.w, cdt.value.p, cdt.value.ps);
    req.post('/problem/list', cdt.value).then(res => {
        console.log(res);
        tableData.value = res.data.data.records
        t.value = res.data.data.total
    })

}


</script>

<template>
    <el-container>
        <el-aside width="20%"></el-aside>
        <el-main>
            <el-card class="box-card">
                <div style="display: flex; justify-content: space-between; align-items: center;">

                    <div class="card-header">
                        <div class="mt-4">
                            <el-input v-model="cdt.w" placeholder="输入题目" class="input-with-select">
                                <template #append>
                                    <el-button :icon="Search" @click="searchcon" />
                                </template>
                            </el-input>
                        </div>
                    </div>
                    <el-button v-if="unfinished" type="info" @click="todaypro">每日一题</el-button>
                    <el-button v-else type="success" @click="todaypro">每日一题√</el-button>
                </div>

                <!-- <template #header> -->

                <!-- </template> -->


                <el-table :data="tableData" style="width: 100%">

                    <el-table-column label="题目编号" style="width=10%">
                        <template #default="scope">
                            <div style="display: flex; align-items: center">

                                <el-icon v-if="scope.row.ispass">
                                    <CircleCheck />
                                </el-icon>
                                <span style="margin-left: 10px">{{ scope.row.id }}</span>
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="题目名称" style="width=70%">
                        <template #default="scope">
                            <el-button type="primary" @click="toProblemDetial(scope.row)" link>{{ scope.row.questionName
                                }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="通过率" style="width=10%">
                        <template #default="scope">

                            <div>{{ scope.row.passRate }}</div>

                        </template>
                    </el-table-column>
                    <el-table-column label="难度" style="width=10%">
                        <template #default="scope">
                            <el-tag v-if="scope.row.difficulty == '简单'" class="mx-1" effect="dark" type="success" round>
                                {{ scope.row.difficulty }}
                            </el-tag>
                            <el-tag v-else-if="scope.row.difficulty == '中等'" class="mx-1" effect="dark" type="warning"
                                round>
                                {{ scope.row.difficulty }}
                            </el-tag>
                            <el-tag v-else class="mx-1" effect="dark" type="error" round>
                                {{ scope.row.difficulty }}
                            </el-tag>
                        </template>
                    </el-table-column>

                </el-table>




                <el-pagination v-model:current-page="currentPage4" v-model:page-size="pageSize4"
                    :page-sizes="[10, 20, 50]" :small="small" :disabled="disabled" :background="background"
                    layout="total, sizes, prev, pager, next, jumper" :total="t" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />


            </el-card>
        </el-main>
        <el-aside width="20%"></el-aside>

    </el-container>
</template>

<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 100%;
}
</style>