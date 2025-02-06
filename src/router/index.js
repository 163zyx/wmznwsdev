import Vue from 'vue'
import Router from 'vue-router'
import AiView from '@/components/AiView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AiView',
      component: AiView
    }
  ]
})
