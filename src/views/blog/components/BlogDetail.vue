<script setup>
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref } from "vue"

import { Star, ChatDotRound, CaretTop, EditPen } from '@element-plus/icons-vue'

import { useUserStore } from '@/stores'

import req from '@/utils/request.js'
import { ElMessage } from "element-plus";

const route = useRoute()
const userStore = useUserStore()



const starColor = ref(['#9b9b9b', '#f5a623'])
const commentColor = ref(['#9b9b9b', '#ffffff'])
const likeColor = ref(['#9b9b9b', '#16a34a'])
const deleteColor = ref(['#9b9b9b', '#d0021b'])

const hLike = () => {
    console.log(blog.value.likeState);
    //还需要数据库操作
    blog.value.likeState = (1 - blog.value.likeState)
    blog.value.likeCount += blog.value.likeState - (1 - blog.value.likeState)

    req.post('/blog/hlike', {
        id: blog.value.id,
        likeState: blog.value.likeState,
        likeCount: blog.value.likeCount
    }).then(res => {
        console.log(res);
    })

}

const hStar = () => {
    //还需要数据库操作
    blog.value.starState = (1 - blog.value.starState)
    blog.value.starCount += blog.value.starState - (1 - blog.value.starState)
    req.post('/blog/hstar', {
        id: blog.value.id,
        starState: blog.value.starState,
        starCount: blog.value.starCount
    }).then(res => {
        console.log(res);
    })
}

onMounted(() => {
    console.log(route.query.id);
    req.get("/blog/detail/" + route.query.id).then(res => {
        blog.value = res.data.data
        blog.value.tags = JSON.parse(blog.value.tag)
    })

    loadBlogDone.value = true
})

const loadBlogDone = ref(false)

const blog = ref({
    tag: '66',
    user: {}
})

const followUser=(id)=>{
    req.post('/user/follow',{uid:id,subscribeState:1-blog.value.subscribeState}).then(res=>{
        console.log(res);
        blog.value.subscribeState = 1-blog.value.subscribeState
        blog.value.user.fans += blog.value.subscribeState - (1 - blog.value.subscribeState)
        console.log(blog.value.user.subscribe);
        ElMessage.success(res.data.data)
    })

    
}


// const loadBlogdetail = () => {
//     blog.value = {
//         id: '0001',
//         title: 'sppring',
//         context: "666``` c++c====```+读取Mybatis配置 文件：mybatis-config.xml加载运行环境和映射文件\n2、构造会话工厂SqlSessionFactory\n3、会话工厂创建SqlSession对象（包含了执行SQL语句的所有方法）\n",
//         faceImage: '../ojlogo.jpg',
//         star: 1,
//         starState: 1,
//         likeState: 1,
//         like: 10,
//         comment: 8,
//         time: '2023.12.01',
//         tags: "['java', 'c++']",
//         type: '#work',


//         user: {
//             url: '',
//             nickName: 'useroo01',
//             email: 'useroo01@qq.com',
//             school: 'sppring',
//             introduction: 'sppring',
//             faceImage: '../ojlogo.jpg',
//             sign: '1122',
//             fans: 9,
//             subscribe: 10,
//         }
//     }
// }

// loadBlogdetail()

const topicUrl = new Map([
    ["#comp", "/blogtopic/comp"],
    ["#solu", "/blogtopic/solu"],
    ["#tech", "/blogtopic/tech"],
    ["#work", "/blogtopic/work"],
])

const topic = new Map([
    ["#comp", "#竞赛讨论"],
    ["#solu", "#题解讨论"],
    ["#tech", "#技术杂谈"],
    ["#work","#工作实习"]
])
</script>
<template>
    <el-container>
        <el-aside width="20%">


            <el-card shadow="always" v-if="!loadBlogDone"
                style="margin-left: 5%;position: fixed; top: 140px; left: 0px;  width: 15%; z-index: 1040;">

                <el-skeleton animated />
                <br />
                <el-skeleton style="--el-skeleton-circle-size: 100px" animated>
                    <template #template>
                        <el-skeleton-item variant="circle" animated />
                    </template>
                </el-skeleton>

            </el-card>



            <!-- 侧边栏 -->
            <el-card shadow="always" v-if="loadBlogDone"
                style="margin-left: 5%;position: fixed; top: 140px; left: 0px;  width: 15%; z-index: 1040;">
                <img class="w-32 mx-auto rounded-full -mt-20 border-8 border-white" style="margin-top: 1px;"
                    :src="userImg" alt="">
                <div class="text-center mt-2 text-3xl font-medium">{{ blog.user.nickName }}

                    <button class="font-semibold text-gray-200 text-sm" style="color: black;
                    
                                            border-radius: 20%;
                                            background-color: aquamarine;
                                            border: 1px solid white;
                                            border-color:white" @click="followUser(blog.user.id)"
                        v-if="!blog.subscribeState&&userStore.user.id!=blog.uid">+关注</button>
                        <button class="font-semibold text-gray-200 text-sm" style="color: black;
                    
                                            border-radius: 20%;
                                            background-color: aquamarine;
                                            border: 1px solid white;
                                            border-color:white" @click="followUser(blog.user.id)"
                        v-if="blog.subscribeState&&userStore.user.id!=blog.uid">已关注</button>
                </div>
                <div class="text-center mt-2 font-light text-sm">email:{{ blog.user.email }}</div>
                <div class="text-center font-normal text-lg">school:{{ blog.user.school }}</div>
                <div class="px-6 text-center mt-2 font-light text-sm">
                    <p>
                        sign:{{ blog.user.sign }}
                    </p>
                </div>
                <hr class="mt-8">
                <div class="flex p-4">
                    <div class="w-1/2 text-center">
                        <span class="font-bold">{{ blog.user.fans }}</span> 粉丝
                    </div>
                    <div class="w-0 border border-gray-300">

                    </div>
                    <div class="w-1/2 text-center">
                        <span class="font-bold">{{ blog.user.subscribe }}</span> 关注
                    </div>
                </div>
            </el-card>



        </el-aside>
        <el-container style="min-height: 105vh;">
            <el-header>

            </el-header>
            <el-main>

                <!-- 帖子主体 -->
                <el-card shadow="always">
                    <!-- 面包屑导航栏 -->
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/blog' }">讨论</el-breadcrumb-item>

                        <el-breadcrumb-item><a href="#">{{ blog.title }}</a></el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-divider />

                    <!-- 加载动态 -->
                    <el-skeleton style="width: 100%" v-if="!loadBlogDone">
                        <template #template>
                            <el-skeleton-item variant="image" style="width: 100%; height: 20%" />
                            <div style="padding: 14px">
                                <el-skeleton-item variant="p" style="width: 100%" />

                                <el-skeleton :rows="5" animated />
                                <el-skeleton-item variant="text" style="margin-right: 16px" />
                                <el-skeleton-item variant="text" style="width: 30%" />
                            </div>

                        </template>
                    </el-skeleton>

                    <!-- 加载完成主体 -->
                    <div v-if="loadBlogDone">
                        <!-- 帖子信息头部 -->
                        <div class="mb-0 md:mb-0 w-full max-w-screen-lg mx-auto relative" style="height: 24em;">

                            <div class="absolute left-0 bottom-0 w-full h-full z-10"
                                style="background-image: linear-gradient(180deg,transparent,rgba(0,0,0,.7));"></div>

                            <img :src="blog.faceImage" class="absolute left-0 top-0 w-full h-full z-0 object-cover" />
                            <!-- 关注按钮 -->
                            <div class="p-4 absolute bottom-0 left-0 z-20">

                                <h2 class="text-4xl font-semibold text-gray-100 leading-tight">
                                    <!-- 标题 -->

                                    {{ blog.title }}

                                </h2>
                                <div class="flex mt-3">
                                    <!-- 头像 -->
                                    <img :src="blog.user.url" class="h-10 w-10 rounded-full mr-2 object-cover" />
                                    <div>
                                        <p class="font-semibold text-gray-200 text-sm">{{ blog.user.nickName }}
                                            <button class="font-semibold text-gray-200 text-sm" style="color:aquamarine;
                                            border-radius: 20%;
                                            border: 1px solid white;
                                            border-color:white"
                                            @click="followUser(blog.user.id)"
                                            v-if="!blog.subscribeState&&userStore.user.id!=blog.uid">+关注</button>
                                            <button class="font-semibold text-gray-200 text-sm" style="color:aquamarine;
                                            border-radius: 20%;
                                            border: 1px solid white;
                                            border-color:white"
                                            @click="followUser(blog.user.id)"
                                            v-if="blog.subscribeState&&userStore.user.id!=blog.uid">已关注</button>
                                        </p>

                                        <p class="font-semibold text-gray-400 text-xs">{{ blog.time }}</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div class="mb-0 md:mb-0 w-full max-w-screen-lg mx-auto relative">
                            <el-link :href="topicUrl.get(blog.type)" type="primary">话题：{{ topic.get(blog.type)
                                }}</el-link>
                        </div>
                        <el-divider />
                        <!-- 帖子内容 -->
                        <div class="px-4 lg:px-0 mt-12 text-gray-700 max-w-screen-lg mx-auto text-lg leading-relaxed">
                            <v-md-editor v-model="blog.blogContext" mode="preview"></v-md-editor>
                        </div>
                        <!-- 帖子底部信息 -->
                        <hr />
                        <div>

                            <!-- 喜欢 -->
                            <div class="cursor-pointer text-center text-md justify-center items-center flex "
                                style="float: left;margin: 30px 10px 20px 0px;" @click="hLike"
                                @mouseleave="likeColor = ['#9b9b9b', '#16a34a']"
                                @mouseenter="likeColor = ['#16a34a', '#9b9b9b']">


                                <span class="text-md mx-1" :style="{ color: likeColor[blog.likeState] }">
                                    <el-icon>
                                        <CaretTop />
                                    </el-icon>{{ blog.likeCount }}</span>
                            </div>

                            <!-- 收藏 -->
                            <div class="cursor-pointer text-center text-md justify-center items-center flex "
                                style="float: left;margin: 30px 10px 20px 0px;" @click="hStar"
                                @mouseleave="starColor = ['#9b9b9b', '#16a34a']"
                                @mouseenter="starColor = ['#16a34a', '#9b9b9b',]">

                                <span class="text-md mx-1" :style="{ color: starColor[blog.starState] }"><el-icon>
                                        <Star />
                                    </el-icon>{{ blog.starCount }}</span>
                            </div>

                            <!-- 删除 -->
                            <div v-show="userStore.user.id == blog.user.id" @click="removeBlog"
                                class="cursor-pointer text-center text-md justify-center items-center flex "
                                style="float: left;margin: 33px 10px 20px 0px;"
                                @mouseleave="deleteColor = ['#9b9b9b', '#ffffff']"
                                @mouseenter="deleteColor = ['#d0021b', '#ffffff']">
                                <icon-delete theme="two-tone" size="19" :fill="deleteColor" />
                                <span class="text-md mx-1" :style="{ color: deleteColor[0] }">{{ }}</span>
                            </div>


                            <!-- 回复评论 -->
                            <button @click="openCommentsEdit"
                                class="group rounded-2xl h-12 w-40 bg-green-500 font-bold text-lg text-white relative overflow-hidden"
                                style="float: right;margin: 20px 20px 20px 20px;">
                                回复评论
                                <div
                                    class="absolute duration-300 inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white/30 rounded-2xl">
                                </div>
                            </button>

                            <!-- 修改 -->
                            <div v-show="userStore.user.id == blog.user.id"
                                class="cursor-pointer text-center text-md justify-center items-center flex "
                                style="float: right;margin: 30px 10px 20px 0px;"
                                @mouseleave="editColor = ['#9b9b9b', '#ffffff']"
                                @mouseenter="editColor = ['#303133', '#ffffff']" @click="editChangeOpen = true">
                                <el-icon>
                                    <EditPen />
                                </el-icon>

                            </div>

                        </div>
                    </div>

                </el-card>
                <!-- 评论卡片 -->
                <commentsCard v-for="comments in commentsList" :comments="comments" :bid="blog.id" />

            </el-main>
            <el-footer>
            </el-footer>
        </el-container>
        <el-aside width="20%">

            <el-card shadow="always" v-if="!loadBlogDone"
                style="margin-right: 5%;position: fixed; top: 140px; right: 0px;  width: 15%; z-index: 1040;">
                <div>
                    <el-skeleton :rows="3" animated />
                </div>
                <el-divider />
                <div style="margin-top: 10px;">
                    <span style="color: gray;">相关标签</span> <br /><br />
                    <el-skeleton :rows="1" animated />
                </div>
            </el-card>

            <!-- 侧边栏 -->
            <el-card shadow="always" v-if="loadBlogDone"
                style="margin-right: 5%;position: fixed; top: 140px; right: 0px;  width: 15%; z-index: 1040;">
                <div>
                    <span style="color: gray;">收藏次数</span>
                    <el-tag class="ml-2" type="info" style="float: right;">{{ blog.starCount }}</el-tag>
                </div>
                <div style="margin-top: 10px;">
                    <span style="color: gray;">评论次数</span>
                    <el-tag class="ml-2" type="info" style="float: right;">{{ blog.commentCount }}</el-tag>
                </div>
                <div style="margin-top: 10px;">
                    <span style="color: gray;">点赞次数</span>
                    <el-tag class="ml-2" type="info" style="float: right;">{{ blog.likeCount }}</el-tag>
                </div>
                <el-divider />
                <div style="margin-top: 10px;">
                    <span style="color: gray;">相关标签</span> <br /><br />

                    <el-tag class="mx-1" type="info" v-for="tag in blog.tags" round>{{ tag }}</el-tag>
                </div>
            </el-card>
        </el-aside>
    </el-container>

    <!-- 评论回复弹出框 -->
    <el-drawer v-model="openEditer" title="I am the title" :with-header="false" direction="btt" size="80%">
        <h2 class="mb-4 text-2xl font-bold" style="float: left;width: 100%;">回复评论</h2>
        <!-- markdown编辑器 -->
        <v-md-editor v-model="comments.context" height="80%" :disabled-menus="[]"
            @upload-image="handleUploadImage"></v-md-editor>
        <!-- 发布按钮 -->
        <button type="button" style="float: right;" publishBlog @click="sendComments"
            class="border border-green-500 bg-green-500 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-green-600 focus:outline-none focus:shadow-outline">
            发 &nbsp;&nbsp; 布 <icon-writing-fluently theme="outline" size="24" :fill="['#ffffff', '#7ed321']"
                style="float: right;margin-left: 5px;" />
        </button>
    </el-drawer>
    <!-- 修改弹出框 -->
    <el-drawer v-model="editChangeOpen" title="I am the title" :with-header="false" direction="btt" size="80%">
        <MarkdownRenderer type="change" :blog="blog" />
    </el-drawer>
</template>