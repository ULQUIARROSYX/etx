<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="系统管理 - 角色管理" />
    </q-breadcrumbs>
    <div class="row justify-between items-center">
      <div class="infoGroupTitle">角色列表</div>
      <q-btn color="secondary" icon="add_box" glossy label="添加新角色" @click="editRole()"></q-btn>
    </div>
    <q-table class="q-mt-md" :data="roleData" :columns="roleColumns" row-key="name" :pagination.sync="pagination">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer" @click.native="editRole(props.row.role_id)">
        <q-td key="role_id" :props="props">{{ props.row.role_id }}</q-td>
        <q-td key="name" :props="props">{{ props.row.name }}</q-td>
        <q-td key="description" :props="props">{{ props.row.description }}</q-td>
        <q-td key="scope" :props="props">{{ props.row.scope | scope}}</q-td>
        <q-td key="enable" :props="props">{{ props.row.enable | enable }}</q-td>
        <q-td key="roleMore" :props="props" class="cursor-pointer">
          <q-btn size="sm" rounded push color="deep-orange" @click.stop="rolePower(props.row.role_id)" label="编辑权限" />
          <q-btn size="sm" rounded push color="brown-5" @click.stop="roleOp(props.row.role_id)" class="q-ml-sm" label="人员管理" />
        </q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'role',
  data: () => ({
    pagination: { sortBy: 'role_id', rowsPerPage: 10 },
    roleColumns: [
      { name: 'role_id', label: '角色id', field: 'role_id', align: 'left', sortable: true },
      { name: 'name', label: '角色名称', field: 'name', align: 'left' },
      { name: 'description', label: '角色描述', field: 'description', align: 'left', sortable: true },
      { name: 'scope', label: '范围', field: 'scope', align: 'left' },
      { name: 'enable', label: '状态', field: 'enable', align: 'left' },
      { name: 'roleMore', label: '操作', align: 'left' }
    ],
    roleData: []
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      this.$axios.post('/v1/auth/getRole', {}).then(res => {
        this.roleData = res.data.data.roleList
      })
    },
    // 编辑角色信息
    editRole (id) {
      if (id) {
        this.toPath('/plat/system/role/editRole', { roleId: id })
      } else {
        this.toPath('/plat/system/role/editRole')
      }
    },
    // 人员管理
    roleOp (id) {
      this.toPath('/plat/system/role/roleOp', { roleId: id })
    },
    // 编辑权限
    rolePower (id) {
      this.toPath('/plat/system/role/rolePower', { roleId: id })
    }
  },
  filters: {
    scope (val) {
      switch (val) {
        case 0:
          return '未选'
        case 1:
          return '后台'
        case 2:
          return '接口'
      }
    },
    enable (val) {
      switch (val) {
        case 1:
          return '正常'
        case 2:
          return '禁用'
      }
    }
  }
}
</script>
