<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="账号信息" to="/account/shezhi" />
    </q-breadcrumbs>
    <div class="row justify-between q-my-lg items-end">
      <div class="infoGroupTitle">基本信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="edit" glossy label="编辑资料" @click="$router.push('/account/changeInfo')"></q-btn>
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">头像</div>
      <div>
        <img style="width:50px;" :src="info.preview" />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">用户名</div>
      <div class="text-grey-7">{{info.name}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">用户ID</div>
      <div class="text-grey-7">{{info.op_id}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">登录名</div>
      <div class="text-grey-7">{{info.login}}</div>
    </div>

    <div class="row q-mt-md">
      <div class="infoTitle">上次登录</div>
      <div class="text-grey-7">{{info.last_login}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shezhi',
  data: () => ({
    info: {}
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    getInfo () {
      this.$axios
        .get('/v1/op/getOp')
        .then(res => (this.info = res.data.data.op))
    }
  }
}
</script>

<style scoped>
.val {
  position: relative;
  top: 1px;
}
</style>
