<script lang="ts" setup>
import { Star, ChatDotRound, CaretTop } from '@element-plus/icons-vue'
import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'

import { ElMessage, TabsPaneContext } from 'element-plus'
import aceEditor from '@/components/aceEditor.vue'
import req from '@/utils/request.js'
import { useUserStore } from '@/stores'





const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const user = ref(userStore.user)

const activeName = ref('first')
const flag = ref(false) //全部提交与一个提交的切换

const handleClick = (tab: TabsPaneContext, event: Event) => {
    console.log(tab, event)
}




const todetailrecord = (row: any, column: any, event: Event) => {
    console.log(row.title);
    let dictionary = {

        description: row.title,
        time: row.time,
        memory: row.memory,
        submitTime: row.submitTime
    };

    let jsonString = JSON.stringify(dictionary);
    console.log(jsonString); // 输出: {"key1":"value1","key2":"value2","key3":"value3"}
    handleres(jsonString, row.code, false)
}

const pf = ref(false)
onMounted(() => {

    var qid = route.params.id
    console.log(route.params.id);


    req.get("/problem/" + qid).then(res => {
        console.log(res.data);
        question.value = res.data.data;
        question.value.tag = JSON.parse(question.value.tag)
        question.value.ips = JSON.parse(question.value.inputSample)
        question.value.ops = JSON.parse(question.value.outputSample)
    });


    req.get("/problem/solus/" + qid).then(res => {
        stable.value = res.data.data
        console.log(res.data);
    });



    req.post("/problem/precord", {
        uid: user.value.id,
        qid: route.params.id,
    }).then(res => {
        tableData.value = res.data.data
        console.log(tableData.value);

    })
})


const tableData = ref([])

const question = ref({
    title: '',
    context: "test`121`$infiny",
    totalPass: '1k',
    totalAttempt: '3.1k',
    difficulty: '',

})

const fl = ref(false)

const de = ref({                           //提交详情页需要的数据
    description: '',
    userimg: '',
    username: '',
    codetime: '',
    codememo: '',
    code: '',
    submitTime: ''
})


const handleres = (res: any, code: any, fl: any) => {

    if (res == "error answer") ElMessage.error('答案错误')
    else if (res == "Network down") ElMessage.error('网络超时')

    activeName.value = 'third'
    flag.value = true
    var r = JSON.parse(res)
    de.value.description = r.description

    if (fl == true) {                                  //刚刚提交跳过来的
        if (de.value.description == "Accepted") ElMessage.success('通过全部用例')
        else ElMessage.error('未通过全部用例')
        de.value.codememo = r.memory
        de.value.codetime = r.time

        de.value.submitTime = new Date().toLocaleString()
        de.value.userimg = user.value.url
        de.value.username = user.value.nickName
        de.value.code = code
    }

    else {                                          //这是看之前的提交


        de.value.codememo = r.memory
        de.value.codetime = r.time

        de.value.submitTime = r.submitTime
        de.value.userimg = user.value.url
        de.value.username = user.value.nickName
        de.value.code = code
    }

    pf.value = true

}

const solu = ref(0)

const solutext = ref()
const solutitle = ref()

const stable = ref([])

const submitsolu = () => {
    if (solutext.value == '') {
        ElMessage.error('请输入文字')
        return
    }
    req.post("/problem/solusubmit", {
        uid: user.value.id,
        qid: route.params.id,
        text: solutext.value,
        title: solutitle.value
    }).then(res => {
        ElMessage.success(res.data.data)
        var qid = route.params.id
        req.get("/problem/solus/" + qid).then(res => {
            stable.value = res.data.data
            console.log(res.data);
        });
        solu.value = 0
    })

}
const chosensolu = ref({})


const gotouser = (i: string) => {
    console.log(i);

    router.push({
        path: '/users/', query: {
            id: i
        }
    })
}
const tosoludetail = (s: any) => {


    chosensolu.value = s;
    console.log(chosensolu.value);
    solu.value = 2;
}

const addlc = (s) => {
    var sid=s.id;
    console.log(sid);
    s.ups+=1
    req.post("/problem/addlc/" + sid).then(res => {
        console.log(res.data);
    });
}

</script>

<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="9" style="margin-left:10px">

                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="题目描述" name="first">
                        <el-card>
                            <div style="min-height: 100vh;">
                                <div>
                                    <strong>{{ question.questionName }}</strong>
                                    <p style="text-align:end" v-show="question.ispass">已解答</p>
                                </div>

                                <el-divider></el-divider>
                                <el-tag class="mx-1" type="success" effect="plain" v-if="question.difficulty == '简单'">
                                    {{ question.difficulty }}
                                </el-tag>
                                <el-tag class="mx-1" type="warning" effect="plain"
                                    v-else-if="question.difficulty == '中等'">
                                    {{ question.difficulty }}
                                </el-tag><el-tag class="mx-1" type="error" effect="plain" v-else>
                                    {{ question.difficulty }}
                                </el-tag>

                                <p> <v-md-editor v-model="question.description" mode="preview"></v-md-editor> </p>
                                <div v-for="(sample, index) in question.ips">
                                    <el-divider content-position="left">样例{{ index + 1 }}</el-divider>
                                    <span><strong>输入:</strong></span>
                                    <el-alert type="info" :closable="false" style="margin-bottom: 10px;">

                                        <template #default="content" style="position: relative;">
                                            <span style="white-space: pre-line;line-height: 0.5;">
                                                {{ question.ips[index] }}
                                            </span>
                                            <el-button type="info"
                                                style="position: absolute;top: 5px;right: 5px;bottom: 5px;"
                                                plain>复制</el-button>
                                        </template>

                                    </el-alert>
                                    <span><strong>输出:</strong></span>
                                    <el-alert type="info" :closable="false" style="margin-bottom: 10px;">

                                        <template #default="content" style="position: relative;">
                                            <span style="white-space: pre-line;line-height: 0.5;">
                                                {{ question.ops[index] }}
                                            </span>
                                            <el-button type="info"
                                                style="position: absolute;top: 5px;right: 5px;bottom: 5px;"
                                                plain>复制</el-button>
                                        </template>

                                    </el-alert>
                                </div>
                                <el-divider></el-divider>
                                <strong>数据范围:</strong>
                                <div>{{ question.dataRange ? question.dataRange : "无" }}</div>

                                <strong>时间限制:</strong>
                                <div>{{ question.timeLimit ? question.timeLimit : "无" }}</div>
                                <strong>内存限制:</strong>
                                <div>{{ question.memoryLimit ? question.memoryLimit : "无" }}</div>

                                <div class="px-5 py-3 pt-[38px]">
                                    <div class="flex h-full flex-wrap items-center">
                                        <div class="mr-4 flex items-center space-x-2.5">
                                            <div class="text-label-2 dark:text-dark-label-2 text-xs">通过次数</div>
                                            <strong>{{ question.totalPass }}</strong>
                                        </div>
                                        <el-divider direction="vertical"></el-divider>
                                        <div
                                            class="bg-divider-2 dark:bg-dark-divider-2 h-full w-px border-divider-1 dark:border-dark-divider-1 mr-4 max-h-[14px]">
                                        </div>
                                        <div class="mr-4 flex items-center space-x-2.5">
                                            <div class="text-label-2 dark:text-dark-label-2 text-xs">提交次数</div>
                                            <strong>{{ question.totalAttempt }}</strong>
                                        </div>
                                        <el-divider direction="vertical"></el-divider>
                                        <div
                                            class="bg-divider-2 dark:bg-dark-divider-2 h-full w-px border-divider-1 dark:border-dark-divider-1 mr-4 max-h-[14px]">
                                        </div>
                                        <div class="mr-4 flex items-center space-x-2.5">
                                            <div class="text-label-2 dark:text-dark-label-2 text-xs">通过率</div>
                                            <strong>{{ ((question.totalPass) / (question.totalAttempt) *
                                                100).toFixed(2) }}%</strong>
                                        </div>
                                    </div>

                                    <div class="flex gap-2" v-for="t in question.tag">
                                        <el-tag type="warning">{{ t }}</el-tag>
                                    </div>
                                </div>
                            </div>
                        </el-card>
                    </el-tab-pane>
                    <el-tab-pane :label="`题解(${stable.length})`" name="second">
                        <div v-show="solu == 0">
                            <div class="container" style="display: flex;justify-content: right;">
                                <el-button @click="solu = 1"
                                    style="margin-left: auto;background-color:rgb(45 181 93);color:white;width:49px;height: 12px;font-size: 10px;">+发布题解</el-button>
                            </div>

                            <div class="flex flex-wrap gap-4">
                                <el-card v-for="s in stable" style="width:100%;height:120px;" @click="tosoludetail(s)"
                                    shadow="always" :key="s.id">
                                    <div class="flex gap-3 w-full md:flex" style="width:100%">
                                        <div>
                                            <img :src="s.url" class="rounded-full h-8 w-8"
                                                @click.stop="gotouser(s.uid)">
                                        </div>

                                        <div class="flex flex-col justify-center">
                                            <span class="text-sm h-8 " style="color:grey">{{ s.nickName }}</span>
                                            <span class="text-sm h-8 " style="font-weight: bolder;">{{ s.title == null ?
                                                "暂无标题" :
                                                s.title }}</span>
                                            <span class="text-sm h-8 " style="color:grey">{{ s.text ? s.text.slice(0,
                                                55)
                                                : "hhh" }}</span>


                                            <div class="cursor-pointer text-center text-md  items-center flex"
                                                style="color:black;width: max-content;"  @click.stop="addlc(s)">
                                                <el-icon :color="blue">
                                                    <CaretTop />
                                                </el-icon>

                                                <span>{{ s.ups }}</span>
                                            </div>


                                        </div>

                                    </div>
                                </el-card>
                            </div>
                        </div>
                        <div v-show="solu == 1" style="width: 100%;height: 100%;">
                            <el-button @click="submitsolu">发布</el-button>
                            <el-card style="width: 100%" shadow="always">
                                <strong>编辑题解</strong>
                                <el-input v-model="solutitle" placeholder="请输入标题"></el-input>

                                <div>
                                    <v-md-editor v-model="solutext"></v-md-editor>
                                </div>
                            </el-card>
                        </div>
                        <div v-show="solu == 2" class="gap-4">
                            <button @click="solu = 0"> &lt返回全部题解</button>
                            <el-card>
                                <strong style="font-size: larger;">{{ chosensolu.title }}</strong>
                                <div class="flex flex-wrap gap-4">
                                    <img :src="chosensolu.url" class="rounded-full h-8 w-8"
                                        @click="gotouser(chosensolu.uid)">
                                    <span class="text-sm h-8 " style="color:grey">{{ chosensolu.nickName }}</span>
                                    <span class="text-sm h-8 " style="color:grey">{{ chosensolu.subTime }}</span>
                                </div>
                                <div>
                                    <v-md-editor v-model="chosensolu.text" mode="preview"></v-md-editor>
                                </div>
                            </el-card>


                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="提交记录" name="third">
                        <div v-show="flag" class="flex flex-wrap gap-4">
                            <button @click="flag = false"> &lt返回全部提交</button>
                            <el-card style="width: 480px" shadow="always">

                                <strong v-if="de.description == 'Accepted'" style="color:green;">{{ de.description
                                    }}</strong>
                                <strong v-else style="color:red;">{{ de.description }}</strong>
                                <div style="display: flex;">

                                    <img :src="de.userimg" class="rounded-full h-8 w-8">
                                    <span class="text-sm h-8">{{ de.username }} </span>
                                    <p>提交于{{ de.submitTime }}</p>
                                </div>
                            </el-card>
                            <el-card style="width: 480px" shadow="always">
                                <strong>用时分布</strong>
                                <div>

                                    <p>{{ de.codetime }} ms</p>
                                </div>
                            </el-card>
                            <el-card style="width: 480px" shadow="always">
                                <strong>内存分布</strong>
                                <div>

                                    <p>{{ de.codememo }} mb</p>
                                </div>
                            </el-card>
                            <el-card style="width: 480px" shadow="always">
                                <strong>代码</strong>
                                <div>
                                    <!-- <v-md-editor v-model="de.code" mode="preview"></v-md-editor> -->
                                    <Codeview :value="de.code" v-if="pf"></Codeview>
                                </div>
                            </el-card>
                        </div>
                        <div v-show="!flag" class="flex flex-wrap gap-4">
                            <el-card style="width: 480px" shadow="always">
                                <el-table :data="tableData" stripe style="width: 100%;font-size:12px;"
                                    element-loading-text="正在拼命加载中..." @row-click="todetailrecord">
                                    <el-table-column #default="scope" label="状态" style="width: 20%;" prop="status">
                                        <p v-if="scope.row.title == 'Accepted'" style="color: green;">通过</p>
                                        <p v-else style="color:red;">{{ scope.row.title ? scope.row.title : "解答错误" }}
                                        </p>

                                    </el-table-column>

                                    <el-table-column prop="language" label="语言" style="width: 20%;">
                                        <template #default="scope">
                                            {{ scope.row.language }}
                                        </template>

                                    </el-table-column>

                                    <el-table-column prop="desc" label="用时" style="width: 20%;">

                                        <template #default="scope">
                                            <svg style="width:1em" aria-hidden="true" focusable="false"
                                                data-prefix="far" data-icon="clock"
                                                class="svg-inline--fa fa-clock absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                                role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path fill="currentColor"
                                                    d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z">
                                                </path>
                                            </svg>
                                            {{ scope.row.time }} ms
                                        </template>
                                    </el-table-column>

                                    <el-table-column prop="desc" label="内存消耗" style="width: 20%;">
                                        <template #default="scope">
                                            <svg style="width:1em" aria-hidden="true" focusable="false"
                                                data-prefix="far" data-icon="microchip"
                                                class="svg-inline--fa fa-microchip absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
                                                role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path fill="currentColor"
                                                    d="M184 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64h-8c-35.3 0-64 28.7-64 64v8H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v48H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v48H24c-13.3 0-24 10.7-24 24s10.7 24 24 24H64v8c0 35.3 28.7 64 64 64h8v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h48v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h48v40c0 13.3 10.7 24 24 24s24-10.7 24-24V448h8c35.3 0 64-28.7 64-64v-8h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V280h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448V184h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H448v-8c0-35.3-28.7-64-64-64h-8V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H280V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H184V24zM400 128V384c0 8.8-7.2 16-16 16H128c-8.8 0-16-7.2-16-16V128c0-8.8 7.2-16 16-16H384c8.8 0 16 7.2 16 16zM192 160c-17.7 0-32 14.3-32 32V320c0 17.7 14.3 32 32 32H320c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32H192zm16 48h96v96H208V208z">
                                                </path>
                                            </svg>

                                            {{ scope.row.memory }} MB
                                        </template>
                                    </el-table-column>

                                </el-table>
                            </el-card>
                        </div>

                    </el-tab-pane>

                </el-tabs>

            </el-col>
            <el-col :span="14">
                <el-card>
                    <ace-editor :value="question.id" @result="handleres"></ace-editor>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>