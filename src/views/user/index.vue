<script lang="ts" setup>
import { useUserStore } from "@/stores"
import { useRouter, useRoute } from "vue-router"
import { onMounted, ref, watch, onBeforeUnmount } from "vue"
import Dailysubmit from "@/views/user/components/Dailysubmit.vue"
import SubmitRecord from "@/views/user/components/SubmitRecord.vue"
const userStore = useUserStore()
const router = useRouter()

const user = ref(userStore.user)

const other = ref({})

const form = ref({
  location: "", school: "", gender: "", web: ""
})
import req from '@/utils/request'
import * as echarts from "echarts"

const pinyin_dict = {
  "Anhui": "安徽",
  "Beijing": "北京",
  "Fujian": "福建",
  "Gansu": "甘肃",
  "Guangdong": "广东",
  "Guangxi": "广西",
  "Guizhou": "贵州",
  "Hainan": "海南",
  "Hebei": "河北",
  "Heilongjiang": "黑龙江",
  "Henan": "河南",
  "Hubei": "湖北",
  "Hunan": "湖南",
  "Jiangsu": "江苏",
  "Jiangxi": "江西",
  "Jilin": "吉林",
  "Liaoning": "辽宁",
  "Inner Mongolia": "内蒙古",
  "Ningxia": "宁夏",
  "Qinghai": "青海",
  "Shandong": "山东",
  "Shanxi": "山西",
  "Shaanxi": "陕西",
  "Shanghai": "上海",
  "Sichuan": "四川",
  "Tianjin": "天津",
  "Tibet": "西藏",
  "Xinjiang": "新疆",
  "Yunnan": "云南",
  "Zhejiang": "浙江",
  "Taiwan": "台湾"
}

const route = useRoute()

const shouldReload = ref(false)

const unwatch = watch(         //监听路由变化，当点击用户头像时监听是否要到另一个用户页面
  () => route.fullPath,
  (newPath, oldPath) => {
    // 在路由变化时执行你的逻辑
    console.log('路由变化了', newPath, oldPath)
    if (newPath !== oldPath) {
      shouldReload.value = true;
      // 延迟一段时间来确保路由已经稳定  
      setTimeout(() => {
        if (shouldReload.value) {
          // 执行重新加载逻辑  
          getdata()
          // 例如，重置组件状态或触发数据获取  
          shouldReload.value = false;
        }
      }, 100);
    }
  }
);

onMounted(() => {         //挂载时，更新数据
  getdata()
  getpersonalinfo();
})

onBeforeUnmount(() => {        //卸载时，关闭监听
  unwatch()
})


const list = ref([{}, {}])

const getpersonalinfo = () => {
  console.log("user:" + user.value.id);
  req.get('/problem/solunums/' + user.value.id)
    .then(res => {
      list.value = res.data.data
      console.log(list.value[1]['easynums']);
    }
    )
}


const getdata = () => {         //根据id获取数据

  console.log(route.query.id);
  var u = route.query.id

  if (u !== undefined) {             //这个u主要为了区分是从个人中心页面跳转还是从用户主页跳转,如果是自己点个人中心,u==undefined,如果是从用户主页跳转,u!=undefined
    getCharts()
    req.get("/user/", { params: { id: u } }).then(res => {
      other.value = res.data.data
    })

    req.post("/user/follow/common/" + u).then(res => {
      commonfollow.value = res.data.data
    })
    console.log(other.value);
  }

  else {                           //这是自己
    getCharts()
    req.get("/user/", { params: { id: user.value.id } }).then(res => {
      other.value = res.data.data
      form.value = res.data.data
    })
    getIPInfo()
    console.log(other.value);
  }
}



const dialogVisible = ref(false)


const getIPInfo = () => {
  return fetch(`https://api.ipify.org?format=json`)
    .then(response => response.json())
    .then(data => {
      console.log('IP Address:', data.ip);
      // 接下来，使用IP地址查询属地信息
      return fetch(`http://ip-api.com/json/${data.ip}`);
    }).then(response => response.json()).then(data => {
      console.log('Region:', data.regionName);
      user.value.ip = pinyin_dict[data.regionName]

    }).catch(error => {
      console.error('Error:', error);
    });
}



const commonfollow = ref([])

const gotouser = (i: string) => {

  router.push({
    path: '/user/', query: {
      id: i
    }
  })
}


const onSubmit = () => {
  dialogVisible.value = false
  userStore.updateUser(form.value)

  console.log(form.value);

  req.post("/user/update", form.value).then(res => {

    console.log(res)
    user.value = res.data.data

  })
}

const maychar = ref()

const getCharts = () => {

  const chartBox = echarts.init(maychar.value);
  const option = {
    title: {
      text: '解题数据(月度)'
    },
    xAxis: {
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {},
    series: [
      {
        type: "line",
        data: [23, 24, 18, 25, 27, 28, 25],
      },
    ],
  };
  chartBox.setOption(option);
  // 根据页面大小自动响应图表大小
  window.addEventListener("resize", function () {
    chartBox.resize();
  });
}


</script>

<template>
  <el-dialog v-model="dialogVisible" title="更改个人简介" width="80%">
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="所在地">
        <el-input v-model="form.location" />
      </el-form-item>
      <el-form-item label="学校">
        <el-input v-model="form.school" />
      </el-form-item>
      <el-form-item label="性别">
        <el-input v-model="form.gender" />
      </el-form-item>
      <el-form-item label="网站">
        <el-input v-model="form.web" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button>Cancel</el-button>
      </el-form-item>
    </el-form></el-dialog>
  <el-container>
    <el-aside width="20%"></el-aside>
    <el-container style="min-height: 105vh;">

      <el-header>
        <el-card>
          <el-avatar shape="square" style="width: 100px;height: 100px;float: left;"
            :src="other.url ? other.url : './ojlogo.jpg'" />
          <div style="float: left;margin-left: 10px;">
            <div style="font-size: 25px;margin: 5px;">
              {{ other.nickName }}
            </div>
            <div style="margin: 5px;">
              全站排名 : {{ other.rk }}
            </div>
            <div style="margin: 5px;">
              等级 : {{ other.level }}
            </div>
          </div>
        </el-card>


      </el-header>
      <el-main style="margin-top: 90px;">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-card style="height: 800px;">
              <div style="text-align: center;letter-spacing: 0.2;">
                关注:{{ other.subscribe }}|粉丝:{{ other.fans }}
                <el-button type="success" plain style="width: 70%;" @click="dialogVisible = true"
                  v-show="user.id == other.id">修改个人简介</el-button>
                <el-divider />
                <div>
                  <span style="font-weight: bold;">个人简介</span><br><br>
                </div>
                <div style="font-size: 15px;">
                  {{ other.introduction }}
                </div>
                <div class="text-label-2 dark:text-dark-label-2">
                  <div class="relative mb-[10px] flex items-center" v-show="user.id == other.id">
                    <div class="flex h-[18px] w-[18px] shrink-0 items-center justify-center"><svg
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="1em" height="1em"
                        fill="currentColor" class="w-[15px] h-[15px] text-label-2 dark:text-dark-label-2">
                        <path
                          d="M6.486 5.5a.986.986 0 00-.986.986v7.596a.986.986 0 101.972 0V6.486a.986.986 0 00-.986-.986z">
                        </path>
                        <path fill-rule="evenodd"
                          d="M9.472 5.5a1 1 0 00-1 1v7.576a.992.992 0 101.984 0v-2.512h2.008c1.045 0 1.924-.225 2.545-.758.637-.546.919-1.34.919-2.286 0-.94-.279-1.729-.913-2.27-.62-.529-1.496-.75-2.539-.75H9.472zm.984 4.212v-2.36h1.96c.635 0 .995.125 1.199.3l.012.01.013.01c.166.124.304.364.304.848 0 .474-.134.734-.313.888-.21.172-.58.304-1.215.304h-1.96z"
                          clip-rule="evenodd"></path>
                        <path fill-rule="evenodd"
                          d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0s10 4.477 10 10zm-2 0a8 8 0 11-16 0 8 8 0 0116 0z"
                          clip-rule="evenodd"></path>
                      </svg></div>
                    <div class="ml-[8px] w-[calc(100%-26px)] break-all leading-[17px]">{{ user.ip }}</div>
                  </div>
                  <div class="relative mb-[10px] flex items-center">
                    <div class="flex h-[18px] w-[18px] shrink-0 items-center justify-center"><svg
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"
                        fill="currentColor" class="w-full h-full text-label-2 dark:text-dark-label-2">
                        <path fill-rule="evenodd"
                          d="M20.364 10.364c0 2.814-1.496 5.556-3.956 8.153a25.656 25.656 0 01-3.506 3.072c-.161.116-.28.198-.347.243a1 1 0 01-1.11 0 12.541 12.541 0 01-.347-.243 25.651 25.651 0 01-3.506-3.071c-2.46-2.598-3.956-5.34-3.956-8.154a8.364 8.364 0 0116.728 0zm-7.836 8.997a23.687 23.687 0 002.428-2.22c2.142-2.26 3.408-4.58 3.408-6.777a6.364 6.364 0 00-12.728 0c0 2.196 1.266 4.517 3.408 6.778A23.689 23.689 0 0012 19.769c.166-.124.342-.26.528-.408zM12 12.91a3 3 0 110-6 3 3 0 010 6zm0-2a1 1 0 100-2 1 1 0 000 2z"
                          clip-rule="evenodd"></path>
                      </svg></div>
                    <div class="ml-[8px] w-[calc(100%-26px)] break-all leading-[17px]">{{ other.location }}</div>
                  </div>
                  <div class="relative mb-[10px] flex items-center">
                    <div class="flex h-[18px] w-[18px] shrink-0 items-center justify-center"><svg
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"
                        fill="currentColor" class="w-full h-full text-label-2 dark:text-dark-label-2">
                        <path fill-rule="evenodd"
                          d="M16.008 12.124A1.017 1.017 0 0116 12V7.586l-1.121 1.121a1 1 0 11-1.415-1.414l2.829-2.829a1 1 0 011.414 0l2.828 2.829a1 1 0 11-1.414 1.414L18 7.586V12c0 .042-.003.083-.008.124A4.002 4.002 0 0117 20a4 4 0 01-.992-7.876zm-8.016-.248c.005.04.008.082.008.124v1h2a1 1 0 110 2H8v4a1 1 0 11-2 0v-4H4a1 1 0 110-2h2v-1c0-.042.003-.083.008-.124A4.002 4.002 0 017 4a4 4 0 01.992 7.876zM7 10a2 2 0 100-4 2 2 0 000 4zm10 4a2 2 0 100 4 2 2 0 000-4z"
                          clip-rule="evenodd"></path>
                      </svg></div>
                    <div class="ml-[8px] w-[calc(100%-26px)] break-all leading-[17px]">{{ other.gender }}</div>
                  </div>
                  <div class="relative mb-[10px] ">
                    <div class="relative mb-[10px] flex items-center">
                      <div class="flex h-[18px] w-[18px] shrink-0 items-center justify-center"><svg
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"
                          fill="currentColor" class="w-full h-full text-label-2 dark:text-dark-label-2">
                          <path
                            d="M13.465 3.862a3 3 0 00-2.957-.048L2.61 8.122a1 1 0 000 1.756L5 11.18v6.27c0 .59.26 1.15.74 1.491 1.216.86 3.75 2.409 6.26 2.409s5.044-1.548 6.26-2.409c.48-.34.74-.901.74-1.491v-6.27l1.4-.98v4.7a.9.9 0 101.8 0V9.572a1 1 0 00-.493-.862l-8.242-4.848zM18.82 9l-5.862 3.198a2 2 0 01-1.916 0L5.18 9l5.862-3.198a2 2 0 011.916 0L18.82 9zM17 16.687a.937.937 0 01-.413.788c-.855.565-2.882 1.774-4.587 1.774-1.705 0-3.732-1.209-4.587-1.774A.936.936 0 017 16.687V12.27l3.562 1.945a3 3 0 002.876 0L17 12.27v4.417z">
                          </path>
                        </svg></div>
                      <div class="ml-[8px] w-[calc(100%-26px)] break-all leading-[17px]"><span>{{ other.school
                          }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="relative mb-[10px] ">
                    <div class="relative mb-[10px] flex items-center">
                      <div class="flex h-[18px] w-[18px] shrink-0 items-center justify-center"><svg
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em"
                          fill="currentColor" class="w-full h-full text-label-2 dark:text-dark-label-2">
                          <path fill-rule="evenodd"
                            d="M8.047 13H3a1 1 0 01-.117-1.993L3 11h5.045c.235-3.188 1.338-6.213 3.16-8.606a1 1 0 011.59 0c1.817 2.387 2.92 5.401 3.158 8.606H21a1 1 0 01.117 1.993L21 13h-5.045c-.235 3.188-1.338 6.213-3.16 8.606a1 1 0 01-1.59 0C9.387 19.219 8.284 16.205 8.046 13zm2.004 0c.185 2.217.843 4.332 1.903 6.138l.046.075.046-.075c1.064-1.811 1.723-3.932 1.905-6.138h-3.9zm3.898-2c-.185-2.217-.843-4.332-1.903-6.138L12 4.786l-.046.076C10.89 6.673 10.231 8.794 10.05 11h3.9z"
                            clip-rule="evenodd"></path>
                          <path fill-rule="evenodd"
                            d="M12 4a8 8 0 100 16 8 8 0 000-16zM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"
                            clip-rule="evenodd"></path>
                        </svg></div>
                      <div class="ml-[8px] w-[calc(100%-16px)] break-all leading-[17px]"><a
                          class="hover:text-label-1 dark:hover:text-dark-label-1 font-normal leading-[17px]"
                          href="https://www.cnblogs.com/cxkdbk/" target="_blank" rel="noreferrer"
                          style="font-size: small;">{{ other.web }}</a></div>
                    </div>
                  </div>

                  <div class="flex flex-col" v-show="other.id != user.id">
                    <strong>你和他的共同关注</strong>
                    <div class="flex flex-row">
                      <div v-for="p in commonfollow">
                        <div>
                          <img :src="p.url" class="rounded-full h-8 w-8" @click="gotouser(p.id)">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </el-card>

          </el-col>
          <el-col :span="18">
            <div>
              <el-card>
                <div ref="maychar" style="height: 280px;"></div>
              </el-card>
            </div>

            <el-col :span="15" :gutter="20">
              <div style="margin-top: 30px;font-size: 9px;">
                <el-card>
                
                  <span>简单：</span> <el-progress :text-inside="true" :stroke-width="13"
                    :percentage="list[0]['easynums'] / list[1]['easynums'] * 100" status="success"><span style="color:black;font-size: 9px;">{{list[0]['easynums']}} / {{list[1]['easynums']}}</span></el-progress>
                  <span>中等：</span> <el-progress :text-inside="true" :stroke-width="13"
                    :percentage="(list[0]['midnums'] / list[1]['midnums']).toFixed(2)*100" status="warning"><span style="color:black;font-size: 9px;">{{list[0]['midnums']}} / {{list[1]['midnums']}}</span></el-progress>
                  <span>困难：</span> <el-progress :text-inside="true" :stroke-width="13"
                    :percentage="(list[0]['diffnums'] / list[1]['diffnums'] * 100)==0?1:list[0]['diffnums'] / list[1]['diffnums'] * 100" status="exception"><span style="color:black;font-size: 9px;">{{list[0]['diffnums']}} / {{list[1]['diffnums']}}</span></el-progress>

                </el-card>
              </div>


            </el-col>
            <el-col :span="24">
              <div style="margin-top: 30px;">
                <el-card>
                  <Dailysubmit />
                </el-card>
              </div>

            </el-col>

            <el-col :span="24">
              <div style="margin-top: 30px;">
                <el-card>
                  <submit-record />
                </el-card>
              </div>

            </el-col>

          </el-col>


        </el-row>
      </el-main>

    </el-container>
    <el-aside width="20%"></el-aside>
  </el-container>
</template>



<style scoped>
.el-container {
  height: 100%;
}

.el-progress {
  margin-bottom: 15px;

  width: 250px;
}
</style>