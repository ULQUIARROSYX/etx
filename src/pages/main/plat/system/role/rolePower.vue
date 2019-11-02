<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="系统管理 - 角色管理" to="/plat/system/role" />
      <q-breadcrumbs-el label="角色权限管理" />
    </q-breadcrumbs>
    <!-- 范围 -->
    <div>
      <q-select />
    </div>
    <!-- 可管理角色表 -->
    <div class="row justify-between items-center q-my-lg">
      <div class="infoGroupTitle">可管理角色表</div>
      <div class="row items-center">
        <q-btn glossy rounded color="secondary" icon="edit" :disable="form.role.is_admin===0" label="编辑可管理" @click="roleAdmin"></q-btn>
      </div>
    </div>
    <q-table :data="adminTable.data" :columns="adminTable.columns" />
    <!-- 菜单项 -->
    <div class="row justify-between items-center q-my-lg">
      <div class="infoGroupTitle">菜单项</div>
      <div class="row items-center">
        <q-btn glossy rounded color="secondary" icon="edit" label="编辑菜单项" @click="roleMenu"></q-btn>
      </div>
    </div>
    <q-tree color="accent" :nodes="menuTreeList" node-key="resource_id">
      <template slot="default-header" slot-scope="prop">
        <span>{{ prop.node.name }}</span>
        <span class="text-grey-5" v-if="prop.node.menu_group&&prop.node.menu_group!==''">&nbsp;-&nbsp;{{prop.node.menu_group}}</span>
      </template>
    </q-tree>

    <!-- 资源列表 -->
    <div class="row justify-between items-center q-my-lg">
      <div class="infoGroupTitle">资源列表</div>
      <div class="row items-center">
        <q-btn glossy rounded color="secondary" icon="edit" label="编辑资源项" @click="roleUrl"></q-btn>
      </div>
    </div>
    <q-table :data="form.urlPermisson" :columns="urlTable.columns" />
  </div>
</template>

<script>
export default {
  name: 'rolePower',
  data: () => ({
    // 获取到的数据
    form: {
      menu: [],
      role: {},
      urlPermisson: []
    },
    // 管理角色表
    adminTable: {
      data: [],
      columns: [
        { name: 'role_id', label: '角色id', field: 'role_id', align: 'left' },
        { name: 'name', label: '角色名称', field: 'name', align: 'left' },
        { name: 'enable', label: '是否可用', field: 'enable', align: 'left' },
        { name: 'description', label: '角色描述', field: 'description', align: 'left' }
      ]
    },
    // url资源表
    urlTable: {
      columns: [
        { name: 'resource_id', label: '资源id', field: 'resource_id', align: 'left' },
        { name: 'name', label: '名称', field: 'name', align: 'left' },
        { name: 'path', label: '路径', field: 'path', align: 'left' },
        { name: 'enable', label: '是否可用', field: 'enable', align: 'left' },
        { name: 'description', label: '描述', field: 'description', align: 'left' }
      ]
    }
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取用户权限信息
    getInfo () {
      this.$axios.post('/v1/auth/getRoleById', { roleId: this.$route.query.roleId }).then(res => {
        this.form = res.data.data
        this.getGrantRole()
      })
    },
    // 获取可管理角色列表
    getGrantRole () {
      this.$axios.post('/v1/auth/getRole', { roleIds: this.form.role.grant_roles.split(',') }).then(res => {
        this.adminTable.data = res.data.data.roleList
      })
    },
    // 编辑可管理用户
    roleAdmin () {
      this.toPath('/plat/system/role/roleAdmin', { roleId: this.$route.query.roleId, grant_roles: this.form.role.grant_roles })
    },
    // 编辑菜单项
    roleMenu () {
      this.toPath('/plat/system/role/roleMenu', { roleId: this.$route.query.roleId })
    },
    // 编辑url资源
    roleUrl () {
      this.toPath('/plat/system/role/roleUrl', { roleId: this.$route.query.roleId })
    }
  },
  computed: {
    menuTreeList () {
      if (this.form.menu.length === 0) {
        return [{ name: '暂无，请点击右侧按钮添加', resource_id: 0 }]
      } else {
        return [{ name: '根目录', resource_id: 0, children: this.form.menu }]
      }
    }
  }
}
</script>
