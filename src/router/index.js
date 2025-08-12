import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Register from '../views/Register.vue'
import UserProfile from '../views/UserProfile.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/chat',
    name: 'ChatRoom',
    component: () => import('../views/ChatRoom.vue')
  },
  {
    path: '/forum',
    name: 'Forum',
    component: () => import('../views/Forum.vue')
  },
  {
    path: '/companies',
    name: 'Companies',
    component: () => import('../views/Companies.vue')
  },
  {
    path: '/jobs',
    name: 'Jobs',
    component: () => import('../views/Jobs.vue')
  },
  { path: '/', name: 'Home', component: Home },
  { path: '/user', name: 'UserProfile', component: UserProfile, meta: { requiresAuth: true } },
  {
    path: '/companies/:id',
    name: 'CompanyDetail',
    component: () => import('../views/CompanyDetail.vue')
  },
  {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/jobs/:id',
      name: 'JobDetail',
      component: () => import('../views/JobDetail.vue')
    },
    {
      path: '/company/PublishJob',
      name: 'PublishJob',
      component: () => import('../views/company/PublishJob.vue'),
      meta: {
        requiresAuth: true,
        requiresCompany: true
      }
    },
    {
      path: '/company/jobs',
      name: 'CompanyJobs',
      component: () => import('../views/company/CompanyJobs.vue'),
      meta: {
        requiresAuth: true,
        requiresCompany: true
      }
    },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('../views/Terms.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('../views/Privacy.vue')
  },

  {
      path: '/admin',
      name: 'AdminDashboard',
      component: () => import('../views/admin/AdminDashboard.vue'),
      meta: {
        requiresAuth: true,
        requiresAdmin: true
      }
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      // 没有登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    } else {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        
        // 检查是否是管理员
        if (to.matched.some(record => record.meta.requiresAdmin)) {
          if (user && user.role === 2) {
            next();
          } else {
            // 非管理员，重定向到首页并提示
            alert('您没有管理员权限');
            next('/');
          }
        } else if (to.matched.some(record => record.meta.requiresCompany)) {
          if (user && user.role === 1) {
            next();
          } else {
            // 非企业用户，重定向到职位列表页并提示
            alert('您没有企业权限，无法访问该页面');
            next('/jobs');
          }
        } else {
          // 普通认证页面，直接放行
          next();
        }
      } catch (e) {
        console.error('解析用户信息失败:', e);
        next('/login');
      }
    }
  } else {
    // 不需要认证的页面，直接放行
    next();
  }
})

export default router