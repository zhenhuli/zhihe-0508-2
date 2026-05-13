import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '../views/Layout.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '仪表盘' }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('../views/Table.vue'),
        meta: { title: '数据表格' }
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('../views/Form.vue'),
        meta: { title: '表单页面' }
      },
      {
        path: 'permission',
        name: 'Permission',
        component: () => import('../views/Permission.vue'),
        meta: { title: '权限管理' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

export default router
