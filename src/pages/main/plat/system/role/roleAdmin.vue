<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="系统管理 - 角色管理" to="/plat/system/role" />
      <q-breadcrumbs-el label="角色权限管理" :to="'/plat/system/role/rolePower?roleId='+$route.query.roleId" />
      <q-breadcrumbs-el label="编辑可管理角色" />
    </q-breadcrumbs>
    <div class="row justify-between items-center">
      <div class="infoGroupTitle">全部角色列表</div>
      <q-btn color="secondary" icon="edit" glossy label="保存修改" @click="keep"></q-btn>
    </div>
    <q-table
      class="q-mt-lg"
      color="primary"
      :data="roleData"
      :columns="roleColumns"
      :pagination.sync="pagination"
      row-key="name"
      selection="multiple"
      :selected.sync="selected"
    />
  </div>
</template>

<script>
export default {
  name: 'roleAdmin',
  data: () => ({
    roleColumns: [
      { name: 'role_id', label: '角色id', field: 'role_id', align: 'left', sortable: true },
      { name: 'scope', label: '范围', field: 'scope', align: 'left' },
      { name: 'name', label: '角色名称', field: 'name', align: 'left' },
      { name: 'description', label: '角色描述', field: 'description', align: 'left' },
      { name: 'enable', label: '是否有效', field: 'enable', align: 'left', sortable: true },
      { name: 'project_id', label: '项目id', field: 'project_id', align: 'left' }
    ],
    roleData: [],
    selected: [],
    pagination: {
      rowsPerPage: 10
    }
  }),
  mounted () {
    this.getAllList()
  },
  methods: {
    // 获取信息
    getAllList () {
      this.$axios.post('/v1/auth/getRole', {}).then(res => {
        this.roleData = res.data.data.roleList
        // 获取已选中角色
        let roles = this.$route.query.grant_roles.split(',').map(e => parseInt(e))
        this.selected = this.roleData.filter(item => roles.indexOf(item.role_id) !== -1)
      })
    },
    // 保存修改
    keep () {
      this.$axios
        .post('/v1/auth/setGrantRoles', {
          roleId: this.$route.query.roleId,
          grantRoles: this.selectId
        })
        .then(this.formComplete)
    }
  },
  computed: {
    selectId () {
      return this.selected.map(e => e.role_id)
    }
  }
}
</script>
