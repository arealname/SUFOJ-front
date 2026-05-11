<script lang="ts" setup>
import { defineProps, ref } from 'vue';
import { Star, ChatDotRound, CaretTop } from '@element-plus/icons-vue'
import type { Blog, User } from '@/lib/types'
import req from '@/utils/request'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';
const router = useRouter()
const props = defineProps(['blog'])

const blog: Blog = props.blog

console.log(blog);
const blogUser: User = blog.user


const starColor = ref(['#9b9b9b', '#f5a623'])
const commentColor = ref(['#9b9b9b', '#ffffff'])
const likeColor = ref(['#9b9b9b', '#16a34a'])

const hLike = () => {
    //还需要数据库操作
    blog.likeState = (1 - blog.likeState)
    blog.likeCount += blog.likeState - (1 - blog.likeState)

    req.post('/blog/hlike', {
        id: blog.id,
        likeState: blog.likeState,
        likeCount: blog.likeCount
    }).then(res => {
        console.log(res);
    })

}

const hStar = () => {
    //还需要数据库操作
    blog.starState = (1 - blog.starState)
    blog.starCount += blog.starState - (1 - blog.starState)
    req.post('/blog/hstar', {
        id: blog.id,
        starState: blog.starState,
        starCount: blog.starCount
    }).then(res => {
        console.log(res);
    })
}

const calculateTime = () => {
    const postTime = new Date(blog.time)
    // 当前时间
    const nowDate = new Date();
    const ONE_MINUTE = 60 * 1000;
    const ONE_HOUR = 60 * ONE_MINUTE;
    const ONE_DAY = 24 * ONE_HOUR;
    const ONE_WEEK = 7 * ONE_DAY;

    const now = new Date().getTime();
    const postDate = new Date(postTime).getTime();
    const diff = now - postDate;

    if (diff < ONE_HOUR) {
        const minutes = Math.floor(diff / ONE_MINUTE);
        return `${minutes} 分钟前`;
    } else if (diff < ONE_DAY) {
        const hours = Math.floor(diff / ONE_HOUR);
        return `${hours} 小时前`;
    } else if (diff < ONE_WEEK) {
        const days = Math.floor(diff / ONE_DAY);
        return `${days} 天前`;
    } else {
        return blog.time;
    }
}

const goDetail = (id: any) => {
    router.push({ path: '/blog/detail', query: { id } })
}

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
    ["#work", "#工作实习"]
])

const gotouser = (i: string) => {
    router.push({
        path: '/users/', query: {
            id:i
        }
    })
}


</script>

<template>
    <div class="p-4 w-full rounded-xl group  space-x-6 bg-white bg-opacity-50 shadow-xl hover:rounded-2xl md:flex"
        style="margin-bottom: 10px;height: 250px;">

        <div class="w-4/12">
            <div class="flex gap-3 w-full md:flex" style="width:100%">
                <div>
                    <img :src="blogUser.url" class="rounded-full h-8 w-8" @click="gotouser(blog.uid)">
                </div>
                <!-- 头像 -->

                <!-- 用户名 -->
                <span class="text-sm h-8">{{ blogUser.nickName }}</span>
                <span class="text-sm h-8">{{ blog.subscribeState == 1 ? "已关注" : "" }}</span>
            </div>

            <div>
                <el-tag class="mx-1" type="info" v-for="tag in blog.tags" round>{{ tag }}</el-tag>

            </div>
            <div class="mx-auto w-full block w-3/12 h-1/2 rounded-lg md:flex">
                <img alt="art cover" loading="lazy" style="object-fit: cover;" :src='blog.faceImage' />
            </div>

        </div>





        <div class="w-full">
            <div>
                <a :href="toBlogDetailUrl" class="text-md font-semibold text-cyan-900 text-justify">
                    {{ blog.title }}
                </a>
            </div>

            <div class="sm:w-full pl-0 p-5">
                <div class="space-y-2">

                    <el-text class="mx-1" type="info" @click="goDetail(blog.id)">
                        <a :href="toBlogDetailUrl" class="text-md font-semibold text-cyan-900 text-justify">{{
                        blog.blogContext ? blog.blogContext.slice(0, 55) : "hhh" }}</a>

                    </el-text>

                    <div class="flex items-center space-x-4 justify-between">

                        <div class=" px-3 py-1 rounded-lg flex space-x-2 flex-row">
                            <!-- 收藏 -->
                            <div class="cursor-pointer text-center text-md justify-center items-center flex "
                                @click="hStar" @mouseleave="starColor = ['#9b9b9b', '#f5a623']"
                                @mouseenter="starColor = ['#f5a623', '#9b9b9b']">

                                <span class="text-md mx-1" :style="{ color: starColor[blog.starState] }"
                                    style="justify-content: center;">
                                    <el-icon>
                                        <Star />
                                    </el-icon>{{ blog.starCount }}
                                </span>
                            </div>

                            <!-- 评论数 -->
                            <div class="cursor-pointer text-center text-md justify-center items-center flex"
                                @mouseleave="commentColor = ['#9b9b9b', '#9b9b9b']"
                                @mouseenter="commentColor = ['#4a90e2', '#4a90e2']" @click="toComment">

                                <span class="text-md mx-1" :style="{ color: commentColor[0] }">
                                    <el-icon>
                                        <ChatDotRound />
                                    </el-icon>{{ blog.commentCount }}
                                </span>
                            </div>

                            <div class="cursor-pointer text-center text-md justify-center items-center flex"
                                @click="hLike" @mouseleave="likeColor = ['#9b9b9b', '#16a34a']"
                                @mouseenter="likeColor = ['#16a34a', '#9b9b9b']">

                                <span class="text-md mx-1" :style="{ color: likeColor[blog.likeState] }"><el-icon>
                                        <CaretTop />
                                    </el-icon>{{ blog.likeCount }}</span>
                            </div>


                        </div>
                    </div>
                    <!-- 发布时间 -->
                    <div class="flex items-center space-x-4 justify-between">
                        <div class="text-grey-500 flex flex-row space-x-1  my-4">
                            <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1em"
                                width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <p class="text-xs">{{ calculateTime() }}</p>
                        </div>
                    </div>
                    <div>
                        <el-link :href="topicUrl.get(blog.type)" type="primary">话题：{{ topic.get(blog.type) }}</el-link>
                    </div>
                </div>
            </div>



        </div>
        <!-- 封面图 -->

    </div>
</template>

<style scoped></style>