import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Login from '@/pages/Login'
import Confirmation from '@/pages/Confirmation'
import ConfirmationPassword from '@/pages/ConfirmationPassword'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Services from '@/pages/Services'
// import Contact from '@/pages/Contact'
import Profile from '@/pages/Profile'
import Liked from '@/pages/Liked.vue'
import History from '@/pages/History'
import Match from '@/pages/Match'
import MatchQuick from '@/pages/MatchQuick'
import Messages from '@/pages/Messages'
import UserProfile from '@/pages/UserProfile'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Matcha'
      }
    },
    {
      path: '/liked',
      name: 'Liked',
      component: Liked,
      meta: {
        requiresAuth: true,
        title: 'Matcha'
      }
    },
    {
      path: '/History',
      name: 'History',
      component: History,
      meta: {
        requiresAuth: true,
        title: 'Matcha'
      }
    },
    {
      path: '/confirm-account',
      name: 'Confirm',
      component: Confirmation,
      meta: {
        title: 'Matcha'
      }
    },
    {
      path: '/recover-password',
      name: 'Reset password',
      component: ConfirmationPassword,
      meta: {
        title: 'Matcha'
      }
    },
    {
      path: '/match',
      name: 'Match',
      component: Match,
      meta: {
        requiresAuth: true,
        title: 'Matcha'
      }
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages,
      meta: {
        title: 'Matcha'
      }
    },
    {
      path: '/matchquick',
      name: 'MatchQuick',
      component: MatchQuick,
      meta: {
        requiresAuth: true,
        title: 'Matcha'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: 'Matcha'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: 'Matcha'
      }
    },
    {
      path: '/about',
      name: 'About',
      component: About,
      meta: {
        title: 'Matcha'
      }
    },
    {
      path: '/services',
      name: 'Services',
      component: Services,
      meta: {
        title: 'Matcha'
      }
    },
    // {
    //   path: '/contact',
    //   name: 'Contact',
    //   component: Contact
    // },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true,
        title: 'Matcha'
      }
    },
    {
      path: '/profile/:id',
      name: 'UserProfile',
      component: UserProfile,
      meta: {
        requiresAuth: true,
        title: 'Matcha'
      }
    }

  ]
})
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('usr') === null ||
    localStorage.getItem('usr') === undefined) {
      next({
        path: '/'
      })
    } else next()
  } else next()
})

export default router
