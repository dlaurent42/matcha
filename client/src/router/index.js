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
import Contact from '@/pages/Contact'
import Profile from '@/pages/Profile'
import Liked from '@/pages/Liked.vue'
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
      component: Home
    },
    {
      path: '/liked',
      name: 'Liked',
      component: Liked,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/confirm-account',
      name: 'Confirm',
      component: Confirmation
    },
    {
      path: '/recover-password',
      name: 'Reset password',
      component: ConfirmationPassword
    },
    {
      path: '/match',
      name: 'Match',
      component: Match,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages
    },
    {
      path: '/matchquick',
      name: 'MatchQuick',
      component: MatchQuick,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/services',
      name: 'Services',
      component: Services
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/profile/:id',
      name: 'UserProfile',
      component: UserProfile,
      meta: {
        requiresAuth: true
      }
    }

  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (sessionStorage.getItem('userID') === null ||
    sessionStorage.getItem('userID') === undefined) {
      next({
        path: '/'
      })
    } else next()
  } else next()
})

export default router
