import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const user = ref({
        nickName: '未登录',
        url: '',
        rk: 999999,
        level: 0,
        // ip:''
    })

    const isAdmin = ref(false)
    const loginReady = ref(false)

    const setuser = (u) => {

        user.value = u
        loginReady.value = true
        isAdmin.value = u.role=='admin'
    }

    const logout = () => {
        user.value = {
            nickName: '未登录',
            url: '',
            rk: 999999,
            level: 0,
            // ip:''
        }

        loginReady.value = false
        isAdmin.value = false
    }

    const updateUser = (u) => {
        user.value = u
    }

    return {
        user, setuser, isAdmin, loginReady, logout,updateUser
    }
},

    {
        persist: true
    }
)