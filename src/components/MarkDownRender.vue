<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import req from '@/utils/request'

let blog = ref({
    adminTags: '',
    blogContext: '',
    commentCount: 0,
    faceImage: '',
    id: '',
    likeCount: 0,
    likeState: 0,
    starCount: 0,
    starState: 0,
    tag: '',
    time: '',
    title: '',
    type: '#tech',
    uid: 'uuu',
    user: {
        avatarUrl: 'https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfL7H6j7ZzqzWv51ia8K2lXNib61h2Xp76Via20N6c1XW95X316q699K4qw1n857kYjQ7x4Zpj3q6Q/132',
    }
}
)

const t = ref({ tag: '算法', ptag: '' })


const optionslabels = ref(
    [
        { label: '软件', value: '软件' },
        { label: '算法', value: '算法' },
        { label: '硬件', value: '硬件' },
        { label: '实习', value: '实习' },
    ])

const optionsthemes = ref(
    [
        { label: '题解讨论', value: '#solu' },
        { label: '竞赛讨论', value: '#comp' },
        { label: '技术', value: '#tech' },
        { label: '工作', value: '#work' },

    ])


const baseurl = 'http://localhost:8080'
const imgUrl = ref('')

const uploadurl = baseurl + '/blog/upload/file'


const handlecoverSuccess = (e) => {
    imgUrl.value = e.data
    blog.value.faceImage = imgUrl.value
}


const emit=defineEmits(["close"])

const submit = () => {
    var list = []
    list.push(t.value.tag)
    list.push(t.value.ptag)

    blog.value.tag = JSON.stringify(list)

    blog.value.time = new Date().toLocaleString()

    console.log(blog.value)

    req.post("/blog/submit",blog.value).then((res) => {
        console.log(res)
    })

    ElMessage({
        message: '发布成功',
        type: 'success',
    })

    emit('close')
    
}




</script>

<template>
    <div>
        <h2 class="mb-4 text-2xl font-bold" style="float: left;width: 100%;">发布讨论</h2>
        选择封面
        <el-upload class="avatar-uploader" :show-file-list="false" :action="uploadurl" :on-success="handlecoverSuccess"
            v-model="blog.faceImage">

            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
                <Plus />
            </el-icon>

        </el-upload>

        <el-input v-model="blog.title" placeholder="输入标题" />

        <el-select v-model="t.tag" class="m-2" placeholder="选择标签" size="small">
            <el-option v-for="item in optionslabels" :key="item.value" :label="item.label" :value="item.value" />

        </el-select>
        <el-input v-model="t.ptag" style="width: 240px" placeholder="自定义标签" />

        <el-select v-model="blog.type" class="m-2" placeholder="选择话题" size="small">
            <el-option v-for="item in optionsthemes" :key="item.value" :label="item.label" :value="item.value" />

        </el-select>
        <el-button type="success" round @click="submit">发布</el-button>
        <v-md-editor v-model="blog.blogContext" height="80%" :disabled-menus="[]"
            @upload-image="handleUploadImage"></v-md-editor>
    </div>
</template>


<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 78px;
            height: 78px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 78px;
            height: 78px;
            text-align: center;
        }
    }
}
</style>