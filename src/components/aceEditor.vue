<script setup>

import ace from 'ace-builds'

import 'ace-builds/src-noconflict/snippets/c_cpp'
import 'ace-builds/src-noconflict/snippets/python'
import 'ace-builds/src-noconflict/snippets/golang'
import 'ace-builds/src-noconflict/snippets/java'
// 主题
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/theme-xcode'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-eclipse'

// 代码补全
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-golang'
import 'ace-builds/src-noconflict/mode-java'
import { ref, onMounted, defineEmits } from 'vue'
import req from '@/utils/request.js'
import { number } from 'echarts'
import { useUserStore } from '@/stores'

import SockJS from 'sockjs-client/dist/sockjs.min.js';
import Stomp from 'webstomp-client';


var aceEditor = null     //ace对象

const aceed = ref()        //页面元素

const lanoptions = [
    {
        value: 'C++',
        label: 'C++',
        path: 'ace/mode/c_cpp'
    },
    {
        value: 'python',
        label: 'python',
        path: 'ace/mode/python'
    },
    {
        value: 'java',
        label: 'java',
        path: 'ace/mode/java'
    },
    {
        value: 'Go',
        label: 'Go',
        path: 'ace/mode/golang'
    },

]

const modeArray = [{
    name: 'C++',
    path: 'ace/mode/c_cpp'
}, {
    name: 'Python',
    path: 'ace/mode/python'
}, {
    name: 'Java',
    path: 'ace/mode/java'
}]

const modePath = ref('ace/mode/c_cpp')

const changemode = () => {

    aceEditor.getSession().setMode(modePath.value)

}

const userStore = useUserStore()

const user = ref(userStore.user)


const code = ref('#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\nint main(){\r\n   int a,b;\r\n   cin>>a>>b;\r\n    return 0;\r\n\r\n}')


const fontSize = ref(14)
const sizeArray = [{ name: '11px', val: 11 }, { name: '12px', val: 12 }, { name: '13px', val: 13 }, { name: '14px', val: 14 }, { name: '15px', val: 15 },]


const themeArray = [{
    name: 'monokai',
    path: 'ace/theme/monokai'
},
{
    name: 'chrome',
    path: 'ace/theme/chrome'
},
{
    name: 'eclipse',
    path: 'ace/theme/eclipse'
},
{
    name: 'terminal',
    path: 'ace/theme/terminal'
},
{
    name: 'xcode',
    path: 'ace/theme/xcode'
},
{
    name: 'github',
    path: 'ace/theme/github'
}]



const themePath = ref('ace/theme/monokai')


const saveset = () => {
    dialogFormVisible.value = false;
    console.log(themePath.value);
    aceEditor.setTheme(themePath.value)
    aceEditor.setFontSize(fontSize.value)
}

const isload = ref(false)

const emit = defineEmits(['result'])

const submitcode = () => {

    isload.value = true
    console.log(props.value);//题号

    code.value = aceEditor.getValue();


    let data = {
        "qid": props.value,
        "code": code.value
    }

    req.post('/problem/code', data).then(res => {

        socket.value = new SockJS('/ws?u=' + user.value.id + '-' + props.value);
        stompClient.value = Stomp.over(socket.value);

        socket.value.onopen = function () {
            console.log('WebSocket连接已打开');
        };
        socket.value.onmessage = function (event) {
            console.log('接收到消息:', event.data);
            isload.value = false
            // 这里可以将消息传递给Vue应用
            emit('result', event.data, code.value,true)
            // 例如，可以使用Vue的$emit方法触发一个事件，将消息传递给Vue组件
        };
        socket.value.onclose = function () {
            console.log('WebSocket连接已关闭');
        }

    }, (error) => {
        isload.value = false
        console.log(error);

    })
}



const socket = ref(null);
const stompClient = ref(null);



const props = defineProps({
    value: number
})

onMounted(() => {
    // console.log(props.value);
    aceEditor = ace.edit(aceed.value, {
        maxLines: 35,
        minLines: 30,


        theme: themePath.value,               //代码主题
        mode: modePath.value,               //代码语言
        fontSize: fontSize.value,                       //代码字体大小


        value: code.value ? code.value : '',   //代码内容

        tabSize: 4
    })

    aceEditor.setOptions({
        enableSnippets: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true
    })


    // aceEditor.getSession().on('change', this.change)


})
const dialogFormVisible = ref(false)

</script>

<template>
    <div style="align-items: center;display: flex;margin-bottom: 20px;">

        <el-select v-model="modePath" class="m-2" placeholder="语言" size="small" @change="changemode">

            <el-option v-for="item in modeArray" :key="item.name" :label="item.name" :value="item.path" />

        </el-select>


        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" key=""
            @click="dialogFormVisible = !dialogFormVisible"
            class="h-4 w-4 text-gray-6 dark:text-dark-gray-6 group-hover:text-gray-7 dark:group-hover:text-dark-gray-7">
            <path fill-rule="evenodd"
                d="M7.174 5.619a8.064 8.064 0 011.635-.946l.29-1.158A2 2 0 0111.039 2h1.922a2 2 0 011.94 1.515l.29 1.158c.584.252 1.132.57 1.635.946l1.15-.329a2 2 0 012.282.923l.961 1.665a2 2 0 01-.342 2.437l-.86.832a8.151 8.151 0 010 1.888l.86.83a2 2 0 01.342 2.438l-.96 1.665a2 2 0 01-2.283.923l-1.15-.329a8.063 8.063 0 01-1.635.946l-.29 1.158a2 2 0 01-1.94 1.515H11.04a2 2 0 01-1.94-1.515l-.29-1.158a8.064 8.064 0 01-1.635-.946l-1.15.329a2 2 0 01-2.282-.923l-.961-1.665a2 2 0 01.342-2.437l.86-.831a8.158 8.158 0 010-1.889l-.86-.83a2 2 0 01-.342-2.438l.96-1.665a2 2 0 012.283-.923l1.15.329zm-1.7 1.594l-.961 1.665 1.57 1.518-.114.982a6.157 6.157 0 000 1.425l.114.982-1.57 1.518.96 1.665 2.104-.601.794.593c.38.284.793.523 1.23.711l.908.392.53 2.118h1.922l.53-2.118.909-.392a6.07 6.07 0 001.23-.711l.793-.593 2.103.601.961-1.665-1.57-1.518.114-.982a6.172 6.172 0 000-1.425l-.114-.982 1.57-1.518-.96-1.665-2.104.601-.794-.593a6.067 6.067 0 00-1.23-.71l-.908-.392L12.96 4H11.04l-.53 2.119-.909.391a6.064 6.064 0 00-1.23.711l-.793.593-2.103-.601zM12 16a4 4 0 100-8 4 4 0 000 8zm0-2a2 2 0 110-4 2 2 0 010 4z"
                clip-rule="evenodd"></path>
        </svg>


        <el-button style="margin-left: auto;background-color:rgb(45 181 93);color:white"
            data-e2e-locator="console-submit-button" @click="submitcode" :loading="isload" :loading-icon="Eleme">提交</el-button>



    </div>

    <el-dialog v-model="dialogFormVisible" title="编辑设置">

        <el-form :model="form">
            <el-form-item label="字体设置" :label-width="formLabelWidth">
                <el-select class="value" v-model="fontSize" size="default">
                    <el-option v-for="size in sizeArray" :key="size.name" :label="size.name" :value="size.val">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="主题" :label-width="formLabelWidth">
                <el-select class="value" v-model="themePath" @change="handleThemeChange" size="default"
                    value-key="name">
                    <el-option v-for="theme in themeArray" :key="theme.name" :label="theme.name" :value="theme.path">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogFormVisible = false">Cancel</el-button>
                <el-button type="primary" @click="saveset">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>


    <div class="codeeditor" ref="aceed" style=""></div>
</template>

<style scoped></style>
