<script lang="ts" setup>
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import NoticeBoard from '@/components/NoticeBoard.vue'
import {
    Avatar,
    Close,
    Promotion
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { randomUUID } from 'crypto'
import req from '@/utils/request'
import { log } from 'console'

const userStore = useUserStore()

const router = useRouter()


let loginReady = ref(userStore.loginReady)

let isAdmin = ref(userStore.isAdmin)

const user = ref(userStore.user)




const loginDrawer = ref(false)

const isLogin = ref(true)



const logout = () => {
    localStorage.removeItem('token')
    userStore.logout()
    router.go(0)
}

const loginForm = ref({
    email: '', password: ''
})




const submitLogin = () => {
    const u = loginForm.value;

    if (u.email === '' || u.password === '') {
        ElMessage.error("请输入账号和密码!")
        return;
    }
    req.post('/user/login_auth', u).then(res => {
        if (res.data.code === 200) {

            user.value.url = res.data.data.user.url ?
                res.data.data.user.url : '../public/favicon.ico'
            user.value.nickName = res.data.data.user.nickName ? res.data.data.user.nickName : 'vis'

            userStore.setuser(res.data.data.user)

            localStorage.setItem('token', res.data.data.token)

            loginDrawer.value = false;
            router.go(0)
            ElMessage.success("登陆成功!")
        } else {
            ElMessage.error(res.data.msg)
        }
    })

}
const regForm = ref({
    nickName: '', password: '', email: '', repassword: '', code: ''
})

const submitReg = () => {
    const u = regForm.value;
    if (u.password === u.repassword) {
        user.value.url = '../public/favicon.ico'
        user.value.nickName = u.nickName ? u.nickName : 'user' + generateWebCryptoRandomString(10);

        req.post('/user/register', u).then(res => {
            console.log(res);
            if (res.data.code === 200) {
                ElMessage.success("注册成功!")
                userStore.setuser(res.data.data.user)

                localStorage.setItem('token', res.data.data.token)

                loginDrawer.value = false;
                router.go(0)
            }
        }
        )
    }
}

async function generateWebCryptoRandomString(length: number) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    array.forEach((byte) => {
        randomString += characters[byte % characters.length];
    });
    return randomString;
}



const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value === '') {
        callback(new Error('Please input the password again'))
    } else if (value !== regForm.value.password) {
        callback(new Error("Two inputs don't match!"))
    } else {
        callback()
    }
}

const rules = ref({
    nickName: [{ required: true, message: '输入昵称', trigger: 'blur' }],
    email: [{ required: true, message: '输入邮箱', trigger: 'blur' }],
    password: [{ required: true, message: '输入密码', trigger: 'blur' }],
    repassword: [{ trigger: 'blur', validator: validatePass2 }]
})


</script>

<template>
    <el-menu :default-active="0" class="el-menu-demo" mode="horizontal" :ellipsis="false" @select="handleSelect" router>
        <el-menu-item index="/">
            <img src="../../ojlogo.jpg" width="56" height="56" />
        </el-menu-item>
        <el-menu-item index="/main">首页</el-menu-item>
        <el-menu-item index="/problem">题库</el-menu-item>

        <el-menu-item index="/match">竞赛</el-menu-item>
        <el-menu-item index="/blog">交流</el-menu-item>
        <el-menu-item index="/user" v-if="loginReady"> 个人中心</el-menu-item>
        <el-menu-item index="/dongtai" v-if="loginReady">动态</el-menu-item>
        <el-menu-item v-if="isAdmin&&loginReady" index="/admin">管理</el-menu-item>



        <el-dropdown>
            <div class="relative h-10 w-10" style="margin: 5px 10px 0px 10px;">
                <img class="h-full w-full rounded-full object-cover object-center" :src="user.url" alt="" />

                <span v-show="loginReady"
                    class="absolute right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
            </div>
            <template #dropdown>
                <div style="width: 400px;">
                    <el-card shadow="always" style="background-color: #c8c9cc;">
                        {{ user.nickName }}
                    </el-card>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="loginDrawer = true" v-if="!loginReady"
                            :icon="Promotion">登录/注册</el-dropdown-item>

                        <el-dropdown-item v-if="loginReady" @click="$router.push('/user')"
                            :icon="Avatar">个人中心</el-dropdown-item>
                        <el-dropdown-item v-if="loginReady" @click="logout" :icon="Close">退出</el-dropdown-item>

                    </el-dropdown-menu>
                </div>

            </template>
        </el-dropdown>
    </el-menu>

    <el-drawer :destroy-on-close="true" v-model="loginDrawer">
        <h3 style="color: grey;">欢迎来到OnlineJudge</h3>

        <div v-if="isLogin">
            <el-form ref="loginFormRef" :model="loginForm" status-icon label-width="120px" class="demo-regForm">

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="loginForm.email" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="loginForm.password" type="password" autocomplete="off" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitLogin">登录</el-button>
                    <el-button link type="primary" @click="isLogin = !isLogin">没账号？来注册吧！</el-button>
                </el-form-item>

            </el-form>
        </div>

        <div v-else>
            <el-form ref="regFormRef" :model="regForm" :rules="rules" label-width="120px" class="demo-regForm"
                status-icon>
                <el-form-item label="昵称" prop="nickName">
                    <el-input v-model="regForm.nickName" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="regForm.email" />
                </el-form-item>

                <el-form-item label="验证码" prop="code">
                    <el-input v-model="regForm.code" style="width:50%;" />
                    <el-button @click="sendcode" style="width:40%;" plain type="primary">获取验证码</el-button>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="regForm.password" />
                </el-form-item>
                <el-form-item label="确认密码" prop="repassword">
                    <el-input v-model="regForm.repassword" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitReg">注册</el-button>
                    <el-button link type="primary" @click="isLogin = !isLogin">有账号？去登录吧！</el-button>
                </el-form-item>
            </el-form>
        </div>

        <NoticeBoard></NoticeBoard>

    </el-drawer>
</template>