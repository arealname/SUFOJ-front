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



var aceEditor = null     //ace对象

const aceed = ref()        //页面元素

const code = ref('#include <bits/stdc++.h>\r\nusing namespace std;\r\n\r\nint main(){\r\n   int a,b;\r\n   cin>>a>>b;\r\n    return 0;\r\n\r\n}')


const fontSize = ref(12)
const modePath=ref('ace/mode/c_cpp')
const themePath = ref('ace/theme/eclipse')

const props = defineProps({
    value: String
    
})

onMounted(() => {

    code.value = props.value
    console.log("ace:"+code.value);
    aceEditor = ace.edit(aceed.value, {
        maxLines: 15,
        minLines: 0,
        theme: themePath.value,               //代码主题
        mode: modePath.value,               //代码语言
        fontSize: fontSize.value,                       //代码字体大小
        value: code.value ? code.value : '',   //代码内容
        tabSize: 4
    })

    aceEditor.setOptions({
        enableSnippets: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true,
        enableEditMode: false
    })

})

</script>

<template>
    <div class="codeeditor" ref="aceed"></div>
</template>

<style scoped></style>
