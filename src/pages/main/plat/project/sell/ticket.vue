<template>
  <div style="width: 700px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票服务项目" to="/plat/project/sell" />
      <q-breadcrumbs-el label="项目信息" :to="'/plat/project/sell/proInfo?proId='+$route.query.proId" />
      <q-breadcrumbs-el label="票品信息" />
    </q-breadcrumbs>
    <div class="row justify-between q-mt-lg items-center">
      <div class="infoGroupTitle">基本信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="edit" glossy label="编辑票品信息" @click="toEdit"></q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="infoTitle">图片</div>
      <img style="width:50px;" :src="formData.preview" />
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">票品名称</div>
      <div class="text-grey-7">{{formData.name}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">描述</div>
      <div class="text-grey-7">{{formData.description}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">场次</div>
      <div class="text-grey-7">{{formData.stage}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">状态</div>
      <div class="q-gutter-md">
        <q-radio v-model="formData.status" :val="0" label="准备" color="red" disable class="q-mt-sm q-mr-md" />
        <q-radio v-model="formData.status" :val="1" label="上架" color="teal" disable class="q-mt-sm q-mr-md" />
        <q-radio v-model="formData.status" :val="2" label="下架" color="cyan" disable class="q-mt-sm q-mr-md" />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">电子票</div>
      <q-toggle class="q-mt-none" dense v-model="formData.eticket" left-label disable :label="formData.eticket?'启用':'禁用'" :true-value="1" :false-value="0" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'sellKind',
  data: () => ({
    formData: {}
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 编辑票品信息
    toEdit () {
      this.toPath('/plat/project/sell/editTicket', { proId: this.$route.query.proId, ticketId: this.$route.query.ticketId })
    },
    // 获取票品信息
    getInfo () {
      this.$axios.get('/v1/plat/getSellticket/' + this.$route.query.ticketId).then(res => {
        this.formData = res.data.data
      })
    }
  }
}
</script>
