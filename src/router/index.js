import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    //首页
    {
      path: '/',
      name: 'Index',
      component: resolve => require(['../pages/index.vue'], resolve),
      meta: {
        title: '博客'
      }
    },
    {
      path: '/vitae',
      name: 'Vitae',
      component:resolve => require(['../pages/vitae/vitae.vue'], resolve),
      meta: {
        title: '我的简历'
      }
    },
    //博客分类详情
    {
      path: '/blog/categories',
      name: 'blogcategories',
      component: resolve => require(['../pages/blogcategories.vue'], resolve),
      meta: {
        title: '博客分类'
      }
    },
    //博客更多
    {
      path: '/blog/more',
      name: 'blogmore',
      component: resolve => require(['../pages/blogmore.vue'], resolve),
      meta: {
        title: '更多博客'
      }
    },
    //博客详情
    {
      path: '/blog/:id',
      name: 'blogdetail',
      component: resolve => require(['../pages/blogdetail.vue'], resolve),
      meta: {
        title: '博客详情'
      }
    },
    //登录页面
    {
      path: '/enter/system',
      name: 'Login',
      component: resolve => require(['../pages/admin/login.vue'], resolve),
      meta: {
        title: 'login'
      }
    },
    //后台主页
    {
      path: '/management',
      name: 'adminindex',
      component: resolve => require(['../pages/admin/index.vue'], resolve),
      meta: {
        title: '博客管理'
      },
      children: [
        //博客管理--列表
        {
          path: 'blog',
          name: 'adminbloglist',
          component: resolve => require(['../components/admin/bloglist.vue'], resolve),
          meta: {
            title: '博客列表'
          }
        },
        //博客管理--编辑
        {
          path: 'blog/edit',
          name: 'editblog',
          component: resolve => require(['../components/admin/editblog.vue'], resolve),
          meta: {
            title: '编辑博客'
          }
        },

        //博客分类--列表
        {
          path: 'type',
          name: 'adminblogtype',
          component: resolve => require(['../components/admin/blogtype.vue'], resolve),
          meta: {
            title: '博客分类'
          }
        },
        //博客分类--编辑
        {
          path: 'type/edit',
          name: 'editblogtype',
          component: resolve => require(['../components/admin/editblogtype.vue'], resolve),
          meta: {
            title: '编辑博客分类'
          }
        },

        //博客评论--列表
        {
          path: 'comment',
          name: 'adminblogcomment',
          component: resolve => require(['../components/admin/blogcomment.vue'], resolve),
          meta: {
            title: '评论审核'
          }
        },
        //博客评论--详情
        {
          path: 'comment/detail',
          name: 'admincommentdetail',
          component: resolve => require(['../components/admin/commentdetail.vue'], resolve),
          meta: {
            title: '评论详情'
          }
        },

        //账号修改
        {
          path: 'user',
          name: 'adminuser',
          component: resolve => require(['../components/admin/user.vue'], resolve),
          meta: {
            title: '账号修改'
          }
        },
        //其他配置
        {
          path: 'basic',
          name: 'adminbasic',
          component: resolve => require(['../components/admin/basic.vue'], resolve),
          meta: {
            title: '其他配置'
          }
        },
      ]

    },
    //404页面,位于最后奥
    {
      name: 'NotFound',
      path: '*',
      component: resolve => require(['../pages/notfound.vue'], resolve),
      meta: {
        title: '404'
      }
    }

  ]
})
