<template>
  <q-layout view="hHh Lpr lFf">
    <!-- 顶部导航栏 -->
    <q-header elevated>
      <q-toolbar class="bg-primary glossy text-white">
        <!-- 菜单按钮 -->
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <!-- logo -->
        <q-avatar class="gt-sm">
          <img src="statics/icons/icon-50x50.png">
        </q-avatar>
        <q-toolbar-title>ETX</q-toolbar-title>
        <!-- 消息通知 -->
        <q-btn round dense flat icon="notifications" @click="$router.push('/account/message')">
          <q-badge color="red" text-color="white" floating>
            2
          </q-badge>
        </q-btn>
        <!-- 账户设置 -->
        <q-btn-dropdown stretch flat>
          <template v-slot:label>
            <div class="row items-center no-wrap">
              <q-avatar>
                <img :src="opInfo.avatar">
              </q-avatar>
              <div class="text-center q-ml-sm gt-sm">
                {{opInfo.name}}
              </div>
            </div>
          </template>
          <q-list>
            <q-item clickable v-ripple @click="shezhi">
              <q-item-section>资料设置</q-item-section>
              <q-item-section avatar>
                <q-icon color="primary" name="perm_data_setting" />
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="logout">
              <q-item-section>登出当前账号</q-item-section>
              <q-item-section avatar>
                <q-icon color="negative" name="error_outline" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

      </q-toolbar>
    </q-header>
    <!-- 左侧菜单栏 -->
    <q-drawer v-model="leftDrawerOpen" bordered content-class="bg-grey-2">
      <q-scroll-area style="width: 100%;height:100%;">
        <!-- 版本号 -->
        <q-item-label header>v {{version}}</q-item-label>
        <!-- 菜单分组 -->
        <div v-for="(group,groupI) in sortMenu" :key="groupI">
          <!-- 分组标题 -->
          <q-item-label header>{{group.menu_group}}</q-item-label>
          <!-- 分组下的一级菜单 -->
          <div v-for="(menu,menuI) in group.menus" :key="menuI">
            <!-- 多级菜单 -->
            <q-expansion-item v-if="menu.children" expand-separator>
              <template v-slot:header>
                <q-item-section avatar>
                  <q-icon color="grey" :name="menu.menu_icon" />
                </q-item-section>
                <q-item-section>{{menu.name}}</q-item-section>
              </template>
              <!-- 子菜单 -->
              <q-item :inset-level="1" clickable v-for="(menu2,menu2I) in menu.children" :key="menu2I" @click.native="$router.push(menu2.path)">
                <q-item-section>{{menu2.name}}</q-item-section>
              </q-item>
            </q-expansion-item>
            <!-- 单级菜单 -->
            <q-item v-else clickable @click="$router.push(menu.path)">
              <q-item-section avatar>
                <q-icon :name="menu.menu_icon" color="grey" />
              </q-item-section>
              <q-item-section>{{menu.name}}</q-item-section>
            </q-item>
          </div>

        </div>

      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import config from '../../package.json'
export default {
  name: 'mainLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop,
      opInfo: {
        change_pw: 0,
        name: '不谐之音',
        avator: ''
      },
      menu: [{
        description: '1',
        menu_group: '模拟分组',
        menu_icon: 'dashboard',
        name: '模拟',
        parent: 0,
        path: '/',
        resource_id: 1,
        sort: 0,
        type: 1
      }],
      version: ''
    }
  },
  mounted () {
    this.getUserInfo()
    this.version = config.version
  },
  methods: {
    // 登出
    logout () {
      this.$q.dialog({
        title: '提示',
        message: '是否立即登出并返回登录界面?',
        cancel: true
      }).onOk(() => {
        this.$axios
          .post('/v1/logout')
          .then(res => {
            if (res.data.code === 0) {
              this.notifySuccess('登出成功')
              this.$router.push('/login')
            } else {
              this.notifyError('登出失败，请重试')
            }
          })
      })
    },
    // 获取用户信息与权限
    getUserInfo () {
      if (localStorage.getItem('token')) {
        this.$axios
          .get('/v1/op/getProfile')
          .then(res => {
            this.menu = res.data.data.menu
            this.opInfo = res.data.data.op
            this.notifySuccess('欢迎回来')
            if (this.opInfo.change_pw === 1) {
              this.changePW()
            }
          })
          .catch(() => {
            this.$router.push('/login')
          })
      } else {
        this.$router.push('/login')
      }
    },
    // 进入资料设置页面
    shezhi () {
      this.$router.push('/account')
    },
    // 提醒修改密码
    changePW () {

    }
  },
  computed: {
    // 筛选菜单数组
    sortMenu () {
      // 获取parent=0的菜单
      let parentMenu = [...this.menu].filter(e => e.parent === 0)
      // 添加子菜单到父级
      this.menu.forEach(e => {
        if (e.parent !== 0) {
          parentMenu.forEach((a, i) => {
            if (a.resource_id === e.parent) {
              if (!parentMenu[i].children) {
                parentMenu[i].children = []
              }
              parentMenu[i].children.push(e)
            }
          })
        }
      })
      let map = {}
      let result = []
      // 将菜单按照menu_group分组
      parentMenu.forEach(e => {
        if (!map[e.menu_group]) {
          result.push({
            menu_group: e.menu_group,
            menus: [e]
          })
          map[e.menu_group] = e
        } else {
          result.forEach(a => {
            if (a.menu_group === e.menu_group) {
              a.menus.push(e)
            }
          })
        }
      })
      // 根据菜单的sort字段排序
      result.forEach(e => {
        e.menus.sort((a, b) => {
          return a.sort - b.sort
        })
      })
      return result
    }
  }
}
</script>

<style>
</style>
