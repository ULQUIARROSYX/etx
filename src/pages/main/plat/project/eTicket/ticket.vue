<template>
  <div style="width:500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="电子票项目" icon="dashboard" to="/plat/project/eticket" />
      <q-breadcrumbs-el label="项目信息" :to="'/plat/project/eticket/proInfo?proId='+$route.query.proId" />
      <q-breadcrumbs-el label="票品信息" />
    </q-breadcrumbs>

    <div class="row justify-between q-my-lg items-center">
      <div class="infoGroupTitle">基本信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="edit" glossy label="编辑票品信息" @click="editInfo"></q-btn>
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="infoTitle">票品ID</div>
      <div class="text-grey-7">{{form.ticketId}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">名称</div>
      <div class="text-grey-7">{{form.name}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">说明</div>
      <div class="text-grey-7">{{form.description}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">状态</div>
      <div class="q-gutter-md">
        <q-radio class="q-mt-sm q-mr-md" v-model="form.status" :val="0" label="下架" disable />
        <q-radio class="q-mt-sm q-mr-md" v-model="form.status" :val="1" label="上架" disable />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">数据来源</div>
      <div class="text-grey-7">{{form.source|sourceText}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">匹配模式</div>
      <div class="text-grey-7">{{form.regex}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">验票有效期</div>
      <div class="text-grey-7">{{form.validstart}} 至 {{form.validend}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">其他选项</div>
      <div class="q-gutter-md">
        <q-toggle class="q-mt-sm q-mr-md" v-model="form.checkmode" label="允许脱机" disable :false-value="0" :true-value="1" />
        <q-toggle class="q-mt-sm q-mr-md" v-model="form.repeat" color="green" label="允许多次使用" disable false-value="0" :true-value="1" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ticket',
  data () {
    return {
      form: {}
    }
  },
  mounted () {
    this.getInfo()
  },
  methods: {
    // 编辑票品信息
    editInfo () {
      this.toPath('/plat/project/eticket/editTicket', { proId: this.$route.query.proId, ticketId: this.$route.query.ticketId })
    },
    // 获取票品信息
    getInfo () {
      this.$axios.get('/v1/plat/getEticketById/' + this.$route.query.ticketId).then(res => {
        this.form = res.data.data
        this.getProduce()
      })
    }
  },
  filters: {
    sourceText (val) {
      switch (val) {
        case 0:
          return '全部'
        case 1:
          return '平台生产'
        case 2:
          return '外部导入'
      }
    }
  }
}
</script>
