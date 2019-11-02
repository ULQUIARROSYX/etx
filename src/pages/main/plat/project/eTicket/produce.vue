<template>
  <div style="width:700px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="电子票项目" icon="dashboard" to="/plat/project/eticket" />
      <q-breadcrumbs-el label="项目信息" :to="'/plat/project/eticket/proInfo?proId='+$route.query.proId" />
      <q-breadcrumbs-el label="生产数据" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit" class="q-mt-lg">
      <!-- 项目-->
      <q-input hint readonly v-model="$route.query.proName" label="项目" disable></q-input>
      <!-- 票品选择 -->
      <q-select label="票品选择" v-model="ticketId" :options="tickets" map-options emit-value :rules="[val=>!!val&&val!==null||'必须选择票品']" />
      <!-- 生产数量 -->
      <q-input type="number" v-model="genNum" label="生产数量" :rules="[ val => !!val&&val>0 || '必须大于0']"></q-input>
      <!-- 起始票号 -->
      <q-input type="number" v-model="startNo" label="起始票号" :rules="[ val => !!val&&val>$route.query.endNo || '必须大于'+$route.query.endNo]"></q-input>

      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" :disable="progressShow" />
      <!-- 进度条 -->
      <div v-if="progressShow">
        <div class="q-mt-lg text-primary">数据生成中...(当前：{{progressNum}})</div>
        <q-linear-progress stripe style="height: 10px" :value="progress" />
      </div>
    </q-form>
  </div>
</template>
<script>
export default {
  name: 'produce',
  data () {
    return {
      genNum: 0,
      startNo: Math.ceil(this.$route.query.endNo) + 1,
      progress: 0,
      progressShow: false,
      ticketId: null,
      tickets: []
    }
  },
  mounted () {
    this.getTickets()
  },
  methods: {
    // 提交表单
    onSubmit () {
      this.$axios
        .post('/v1/plat/genEtdata', {
          projectId: this.$route.query.proId,
          ticketId: this.ticketId,
          genNum: Math.ceil(this.genNum),
          startNo: Math.ceil(this.startNo)
        })
        .then(res => {
          if (res.data.code === 0) {
            this.progressShow = true
            this.showProgress(res.data.data.progressId)
          }
        })
    },
    // 显示进度条
    showProgress (id) {
      console.log('开始查询进度')
      this.$axios.get('/v1/util/getProgress/' + id).then(res => {
        if (res.data.code === 0) {
          this.progress = res.data.data.completed / res.data.data.total
          if (this.progress < 1) {
            setTimeout(() => {
              this.showProgress(id)
            }, 1000)
          } else {
            this.$q
              .dialog({
                title: '完成',
                message: '表单提交成功'
              })
              .onOk(() => {
                this.$router.back(-1)
              })
          }
        }
      })
    },
    // 获取票品
    getTickets () {
      this.$axios.get('v1/plat/getEticket?projectId=' + this.$route.query.proId).then(res => {
        this.tickets = res.data.data.map(e => {
          return { label: e.name, value: e.ticketId }
        })
      })
    }
  },
  computed: {
    progressNum () {
      return Math.ceil(this.progress * 100) + '%'
    }
  }
}
</script>
