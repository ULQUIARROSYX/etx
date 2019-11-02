<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="系统管理 - 角色管理" to="/plat/system/role" />
      <q-breadcrumbs-el label="编辑信息" v-if="!addShow" />
      <q-breadcrumbs-el label="新增信息" v-else />
    </q-breadcrumbs>
    <q-form @submit="onSubmit">
      <!-- 角色id -->
      <q-input v-model="form.role_id" v-if="!addShow" label="角色id" readonly hint></q-input>
      <!-- 状态 -->
      <q-field label="状态" stack-label hint>
        <template v-slot:control>
          <div class="q-gutter-md">
            <q-radio v-model="form.enable" :val="0" label="无效" class="q-mr-md" disable />
            <q-radio v-model="form.enable" :val="1" label="可用" color="teal" class="q-mr-md" />
            <q-radio v-model="form.enable" :val="2" label="禁用" color="red" class="q-mr-md" />
          </div>
        </template>
      </q-field>
      <!-- 角色名称 -->
      <q-input v-model="form.name" label="角色名称" :rules="[ val => !!val || '不可为空']"></q-input>
      <!-- 描述 -->
      <q-input v-model="form.description" :rules="[ val => !!val || '不可为空']" label="描述" />
      <!-- 范围 -->
      <q-select v-model="form.scope" label="范围" :options="scopeOptions" emit-value map-options hint />

      <!-- 可管理角色列表 -->
      <q-field label="可管理角色列表" stack-label hint borderless v-if="form.grant_roles!==''">
        <template v-slot:control>
          <q-table class="q-mt-xs" :data="adminTable.data" :columns="adminTable.columns" :pagination.sync="pagination" row-key="name" hide-bottom />
        </template>
      </q-field>

      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mr-lg q-mt-lg" glossy label="点击按钮保存修改" type="submit" />
    </q-form>
  </div>
</template>

<script>
export default {
  name: 'editRole',
  data: () => ({
    addShow: true,
    form: {
      role_id: '',
      name: '',
      enable: 1,
      is_admin: 0,
      description: '',
      grant_roles: '',
      scope: 1
    },
    changeShow: true,
    adminTable: {
      columns: [
        { name: 'role_id', label: '角色id', field: 'role_id', align: 'left' },
        { name: 'name', label: '角色名称', field: 'name', align: 'left' },
        { name: 'description', label: '角色描述', field: 'description', align: 'left' },
        { name: 'enable', label: '是否有效', field: 'enable', align: 'left' }
      ],
      data: []
    },
    pagination: {
      rowsPerPage: 0
    },
    scopeOptions: [{ value: 1, label: '后台' }, { value: 2, label: '接口' }]
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      if (this.$route.query.roleId) {
        this.addShow = false
        this.$axios.post('/v1/auth/getRole', { roleIds: [this.$route.query.roleId] }).then(res => {
          this.form = res.data.data.roleList[0]
          if (this.form.grant_roles !== '') {
            this.getAdminRole()
          }
        })
      }
    },
    // 获取可管理角色列表
    getAdminRole () {
      this.$axios.post('/v1/auth/getRole', { roleIds: this.form.grant_roles.split(',') }).then(res => {
        this.adminTable.data = res.data.data.roleList
      })
    },
    // 选择项目
    selectPro (val) {
      this.form.projectName = val
    },
    // 提交表单
    onSubmit () {
      if (this.addShow) {
        this.add()
      } else {
        this.keep()
      }
    },
    // 保存修改
    keep () {
      this.$axios
        .post('/v1/auth/updRole', {
          roleId: this.form.role_id,
          name: this.form.name,
          description: this.form.description,
          enable: this.form.enable,
          scope: this.form.scope
        })
        .then(this.formComplete)
    },
    // 新增角色
    add () {
      this.$axios
        .post('/v1/auth/newRole', {
          name: this.form.name,
          description: this.form.description,
          scope: this.form.scope
        })
        .then(this.formComplete)
    }
  }
}
</script>
