<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="系统管理 - 基础数据" />
    </q-breadcrumbs>

    <q-list padding class="rounded-borders" style="max-width: 350px">

      <q-item-label header>请选择入口</q-item-label>

      <q-item clickable v-ripple v-for="(item,index) in menuList" :key="index" @click.native="toPath(item.path)" class="q-mb-sm">
        <q-item-section avatar top>
          <q-avatar :icon="item.icon" :color="item.iconColor" text-color="white" />
        </q-item-section>
        <q-item-section>
          <q-item-label lines="1">{{item.name}}</q-item-label>
          <q-item-label caption>{{item.description}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  name: 'baseInfo',
  data () {
    return {
      menuList: [
        {
          name: '资源管理',
          icon: 'shop',
          iconColor: 'blue-4',
          description: '菜单项及接口资源的管理',
          path: '/plat/system/base/res'
        },
        {
          name: '场地管理',
          icon: 'explore',
          iconColor: 'green-4',
          description: '对活动场地的录入和编辑',
          path: '/plat/system/base/venues'
        }
      ]
    }
  }
}
</script>
