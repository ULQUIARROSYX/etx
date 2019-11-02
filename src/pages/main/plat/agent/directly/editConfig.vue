<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票渠道-直连渠道" to="/plat/agent/directly" />
      <q-breadcrumbs-el label="渠道详情" :to="'/plat/agent/directly/agentInfo?agentId='+$route.query.agentId" />
      <q-breadcrumbs-el :label="addShow?'新增项目':'项目编辑'" />
    </q-breadcrumbs>

    <q-form @submit="onSubmit">
      <!-- 渠道 -->
      <q-input label="渠道名称（只读）" stack-label v-model="form.agentName" readonly hint="" />
      <!-- 售票项目 -->
      <q-field :label="addShow?'选择项目':'项目名称（只读）'" stack-label :readonly="!addShow" v-model="form.projectId" :rules="[ val => val>0 || '不可为空']">
        <template v-slot:control>
          <Pro v-model="form.projectId" :name="form.projectName" :agentId="$route.query.agentId" @change="selectPro"></Pro>
        </template>
      </q-field>
      <!-- 状态 -->
      <q-field hint="" label="状态" stack-label>
        <template v-slot:control>
          <q-radio v-model="form.status" :val="0" label="无效" color="red" class="q-mr-md" />
          <q-radio v-model="form.status" :val="1" label="可用" color="teal" class="q-mr-md" />
          <q-radio v-model="form.status" :val="2" label="禁用" color="cyan" class="q-mr-md" />
        </template>
      </q-field>

      <!-- 结算方式 -->
      <q-field label="结算方式" hint="" stack-label>
        <template v-slot:control>
          <q-radio v-model="form.settleMode" :val="1" label="预付" color="primary" class="q-mr-md" />
          <q-radio v-model="form.settleMode" :val="2" label="后付" color="teal" class="q-mr-md" />
        </template>
      </q-field>

      <!-- 额度限制 -->
      <q-input label="额度限制" type="number" v-model="form.quota" hint="0表示不限制额度" :rules="[ val => val>=0 || '必须是大于等于零的数']" />

      <!-- 结算价格表 -->
      <q-field label="结算价格" :disable="form.projectName===''" stack-label borderless>
        <template v-slot:control>
          <q-table class="full-width q-mt-xs" :data="settle.data" :columns="settle.columns" row-key="gradeId" selection="single"
            :selected.sync="settle.selected" hide-bottom />
        </template>
        <template v-slot:append>
          <div class="column" style="top:30px;position: relative;">
            <q-btn icon="add_box" color="secondary" round flat @click="addPrice(1)" />
            <q-btn icon="delete" color="red" round flat @click="delPrice(1)" />
          </div>

        </template>
      </q-field>
      <!-- 售价表 -->
      <q-field label="销售售价" :disable="form.projectName===''" stack-label borderless>
        <template v-slot:control>
          <q-table class="full-width q-mt-xs" :data="sell.data" :columns="sell.columns" row-key="gradeId" selection="single" :selected.sync="sell.selected"
            hide-bottom />
        </template>
        <template v-slot:append>
          <div class="column" style="top:30px;position: relative;">
            <q-btn icon="add_box" color="secondary" round flat @click="addPrice(2)" />
            <q-btn icon="delete" color="red" round flat @click="delPrice(2)" />
          </div>

        </template>
      </q-field>
      <!-- 提交 -->
      <q-btn color="info" class="q-mr-lg q-mt-lg" flat label="返回" @click="$router.back(-1)" />
      <q-btn color="primary" class="q-mt-lg" glossy label="点击提交表单" type="submit" />

    </q-form>

  </div>
</template>

<script>
export default {
  name: 'editConfig',
  data: () => ({
    addShow: true,
    form: {
      agentId: 0,
      agentName: '渠道名称',
      projectName: '',
      projectId: -1,
      status: 0,
      settleMode: 1,
      quota: 0,
      settlePrice: [],
      sellPrice: []
    },
    settle: {
      columns: [
        { name: 'ticketName', label: '票品名称', field: 'ticketName', align: 'left' },
        { name: 'gradeName', label: '票档名称', field: 'gradeName', align: 'left' },
        { name: 'price', label: '结算价', field: 'price', align: 'left' }
      ],
      selected: [],
      data: []
    },
    sell: {
      columns: [
        { name: 'ticketName', label: '票品名称', field: 'ticketName', align: 'left' },
        { name: 'gradeName', label: '票档名称', field: 'gradeName', align: 'left' },
        { name: 'price', label: '销售价', field: 'price', align: 'left' }
      ],
      selected: [],
      data: []
    },
    gradeInfo: []
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取基本信息
    getInfo () {
      this.form.agentId = this.$route.query.agentId
      if (this.$route.query.configId) {
        this.addShow = false
        this.$axios.get('/v1/plat/getAgentConfig/' + this.$route.query.configId)
          .then(res => {
            this.form = res.data.data
            this.settle.data = JSON.parse(JSON.stringify(res.data.data.settlePrice))
            this.sell.data = JSON.parse(JSON.stringify(res.data.data.sellPrice))
            this.getGrade()
          })
      } else {
        this.form.agentName = this.$route.query.agentName
      }
    },
    // 提交表单
    onSubmit () {
      if (this.addShow) {
        this.$axios.post('/v1/plat/newAgentConfig', this.form)
          .then(this.formComplete)
      } else {
        this.$axios.post('/v1/plat/updAgentConfig/' + this.$route.query.configId, this.form)
          .then(this.formComplete)
      }
    },
    // 选择项目
    selectPro (val) {
      this.form.projectName = val
      this.getGrade()
    },
    // 获取全部的票品和票档
    getGrade () {
      this.$axios.get('/v1/plat/getGradeByProject?projectId=' + this.form.projectId)
        .then(res => { this.gradeInfo = res.data.data })
    },
    // 添加价格
    addPrice (type) {
      this.$q.dialog({
        title: '价格',
        message: '选择票品',
        options: {
          type: 'radio',
          model: this.ticket[0].value,
          items: this.ticket
        },
        cancel: true,
        persistent: true
      }).onOk(ticketId => {
        let gradeList = this.grade.filter(e => e.ticketId === ticketId)
        this.$q.dialog({
          title: '价格',
          message: '选择票档',
          options: {
            type: 'radio',
            model: gradeList[0].value,
            items: gradeList
          },
          cancel: true,
          persistent: true
        }).onOk(gradeId => {
          let result = this.gradeInfo.filter(e => e.gradeId === gradeId)[0]
          this.$q.dialog({
            title: '价格',
            message: `您选择了“${result.ticketName}-${result.gradeName}”`,
            prompt: { model: 0, type: 'number' },
            cancel: true,
            persistent: true
          }).onOk(data => {
            result.price = parseFloat(data)
            if (type === 1) {
              let repeat = this.settle.data.some(e => e.gradeId === result.gradeId)
              if (repeat) {
                this.notifyError('不可重复添加同一票档')
              } else {
                this.settle.data.push(result)
                this.form.settlePrice.push({ gradeId: result.gradeId, price: result.price, ticketId: result.ticketId })
              }
            } else {
              let repeat = this.sell.data.some(e => e.gradeId === result.gradeId)
              if (repeat) {
                this.notifyError('不可重复添加同一票档')
              } else {
                this.sell.data.push(result)
                this.form.sellPrice.push({ gradeId: result.gradeId, price: result.price })
              }
            }
          })
        })
      })
    },
    // 删除价格
    delPrice (type) {
      if (type === 1 && this.settle.selected.length > 0) {
        let select = this.settle.selected[0]
        this.$q.dialog({
          title: '删除结算价格',
          message: `是否删除价格：${select.ticketName}-${select.gradeName}-${select.price}`,
          cancel: true,
          persistent: true
        }).onOk(() => {
          if (select.priceId) {
            this.settle.data = this.settle.data.filter(e => e.gradeId !== select.gradeId)
            this.form.settlePrice.forEach(e => {
              if (e.priceId === select.priceId) { delete e.price }
            })
          } else {
            this.settle.data = this.settle.data.filter(e => e.gradeId !== select.gradeId)
            this.form.settlePrice = this.form.settlePrice.filter(e => e.gradeId !== select.gradeId)
          }
          this.settle.selected = []
        })
      } else if (type === 2 && this.sell.selected.length > 0) {
        let select = this.sell.selected[0]
        this.$q.dialog({
          title: '删除售价价格',
          message: `是否删除价格：${select.ticketName}-${select.gradeName}-${select.price}`,
          cancel: true,
          persistent: true
        }).onOk(() => {
          if (select.priceId) {
            this.sell.data = this.sell.data.filter(e => e.gradeId !== select.gradeId)
            this.form.sellPrice.forEach(e => {
              if (e.priceId === select.priceId) { delete e.price }
            })
          } else {
            this.sell.data = this.sell.data.filter(e => e.gradeId !== select.gradeId)
            this.form.sellPrice = this.form.sellPrice.filter(e => e.gradeId !== select.gradeId)
          }
          this.sell.selected = []
        })
      }
    }
  },
  components: {
    Pro: () => import('components/project')
  },
  computed: {
    ticket () {
      let ids = []
      let result = []
      this.gradeInfo.forEach(e => {
        if (!ids.includes(e.ticketId)) {
          result.push({ label: e.ticketName, value: e.ticketId })
          ids.push(e.ticketId)
        }
      })
      return result
    },
    grade () {
      return this.gradeInfo.map(e => ({
        value: e.gradeId,
        label: e.gradeName,
        ticketId: e.ticketId
      }))
    },
    addForm () {
      return {
        agentName: this.form.agentName,
        projectName: this.form.projectName,
        projectId: this.form.projectId,
        status: this.form.status,
        settleMode: this.form.settleMode,
        quota: this.form.quota,
        settlePrice: JSON.stringify(this.form.settlePrice),
        sellPrice: JSON.stringify(this.form.sellPrice)
      }
    }
  }
}
</script>
