import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia=createPinia()
pinia.use(persist)

export default pinia              //pinia模块独立

export * from './modules/user'
