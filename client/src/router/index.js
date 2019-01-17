import Vue from 'vue'
import Router from 'vue-router'

// Pages
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import About from '@/pages/About'
import Services from '@/pages/Services'
import Contact from '@/pages/Contact'
import Profile from '@/pages/Profile'
import Match from '@/pages/Match'
import MatchQuick from '@/pages/MatchQuick'
import Messages from '@/pages/Messages'
import sentMessage from '@/components/SentMessage'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/match',
      name: 'Match',
      component: Match
    },
    {
      path: '/messages',
      name: 'Messages',
      component: Messages
    },
    {
      path: '/sentMessage',
      name: 'sentMessage',
      component: sentMessage
    },
    {
      path: '/matchquick',
      name: 'MatchQuick',
      component: MatchQuick
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
      component: Profile
    }
  ]
})
