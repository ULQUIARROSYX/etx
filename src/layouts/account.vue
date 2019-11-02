<template>
    <q-layout view="hHh Lpr lFf">
        <!-- 顶部导航栏 -->
        <q-header elevated>
            <q-toolbar class="bg-primary glossy text-white">
                <!-- 菜单按钮 -->
                <q-btn
                    flat
                    dense
                    round
                    @click="leftDrawerOpen = !leftDrawerOpen"
                    aria-label="Menu"
                >
                    <q-icon name="menu" />
                </q-btn>
                <!-- logo -->
                <q-avatar class="gt-sm">
                    <img src="statics/icons/icon-50x50.png">
                </q-avatar>
                <q-toolbar-title>ETX</q-toolbar-title>
                <!-- 返回首页 -->
                <q-btn
                    label="返回首页"
                    icon="account_balance"
                    flat
                    stretch
                    @click="$router.push('/')"
                />

            </q-toolbar>
        </q-header>
        <!-- 左侧菜单栏 -->
        <q-drawer
            v-model="leftDrawerOpen"
            bordered
            content-class="bg-grey-2"
        >
            <q-scroll-area style="width: 100%;height:100%;">
                <!-- 版本号 -->
                <q-item-label header>v {{version}}</q-item-label>
                <!-- 菜单分组 -->
                <div
                    v-for="(group,groupI) in sortMenu"
                    :key="groupI"
                >
                    <!-- 分组标题 -->
                    <q-item-label header>{{group.menu_group}}</q-item-label>
                    <!-- 分组下的一级菜单 -->
                    <div
                        v-for="(menu,menuI) in group.menus"
                        :key="menuI"
                    >
                        <!-- 多级菜单 -->
                        <q-expansion-item
                            v-if="menu.children"
                            expand-separator
                            default-opened
                        >
                            <template v-slot:header>
                                <q-item-section avatar>
                                    <q-icon
                                        color="grey"
                                        :name="menu.menu_icon"
                                    />
                                </q-item-section>
                                <q-item-section>{{menu.name}}</q-item-section>
                            </template>
                            <!-- 子菜单 -->
                            <q-item
                                :inset-level="1"
                                clickable
                                v-for="(menu2,menu2I) in menu.children"
                                :key="menu2I"
                                @click.native="$router.push(menu2.path)"
                            >
                                <q-item-section>{{menu2.name}}</q-item-section>
                            </q-item>
                        </q-expansion-item>
                        <!-- 单级菜单 -->
                        <q-item
                            v-else
                            clickable
                            @click="$router.push(menu.path)"
                        >
                            <q-item-section avatar>
                                <q-icon
                                    :name="menu.menu_icon"
                                    color="grey"
                                />
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
    name: 'accountLayout',
    data () {
        return {
            leftDrawerOpen: this.$q.platform.is.desktop,
            menu: [
                { menu_icon: 'perm_data_setting', name: '账号信息', path: '/account/shezhi', menu_group: '账户管理', parent: 0 },
                { menu_icon: 'lock', name: '修改密码', path: '/account/password', menu_group: '账户管理', parent: 0 },
                { menu_icon: 'explore', name: '消息通知', path: '/account/message', menu_group: '账户管理', parent: 0 }
            ],
      version: ''
        }
    },
    mounted () {
        this.version = config.version
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
