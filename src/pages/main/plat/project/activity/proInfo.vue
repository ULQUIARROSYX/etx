<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="营销活动" to="/plat/project/activity" />
      <q-breadcrumbs-el label="项目信息" />
    </q-breadcrumbs>
    <div class="row justify-between q-my-lg items-center">
      <div class="infoGroupTitle">基本信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="edit" glossy label="编辑项目信息" @click="editInfo"></q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="infoTitle">项目名称</div>
      <div class="text-grey-7">{{formData.name}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">主办方</div>
      <div class="text-grey-7">{{formData.ownerName}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">项目说明</div>
      <div class="text-grey-7">{{formData.brief}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">主页地址</div>
      <div class="text-grey-7">{{formData.homeUrl}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'proInfo',
  data () {
    return {
      formData: {}
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 编辑项目信息
    editInfo () {
      this.toPath('/plat/project/activity/editPro', { proId: this.$route.query.proId })
    },
    // 获取数据
    getInfo () {
      this.$axios.get('v1/plat/getProject/' + this.$route.query.proId).then(res => {
        this.formData = res.data.data
      })
    }
  }
}
</script>
