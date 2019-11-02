<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey q-mb-lg" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票渠道-直连渠道" to="/plat/agent/directly" />
      <q-breadcrumbs-el label="渠道详情" />
    </q-breadcrumbs>

    <div class="row justify-between q-mt-lg items-center">
      <div class="infoGroupTitle">基本信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="edit" glossy label="编辑信息" @click="toEdit"></q-btn>
      </div>
    </div>

    <div class="row q-mt-md items-center">
      <div class="infoTitle">状态</div>
      <div class="q-gutter-md">
        <q-radio v-model="formData.status" :val="0" label="无效" color="red" disable left-label />
        <q-radio v-model="formData.status" :val="1" label="可用" color="teal" disable left-label />
        <q-radio v-model="formData.status" :val="2" label="禁用" color="cyan" disable left-label />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">渠道名称</div>
      <div class="text-grey-7">{{formData.name}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">所属</div>
      <div class="text-grey-7">{{formData.companyId}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">简介</div>
      <div class="text-grey-7">{{formData.description}}</div>
    </div>

    <div class="row justify-between q-my-lg items-center">
      <div class="infoGroupTitle">项目配置</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="add_box" glossy rounded label="新增配置" @click="editConfig()"></q-btn>
      </div>
    </div>
    <q-table :data="proData" :columns="columns" :pagination.sync="pagination">
      <!--表格主体-->
      <template v-slot:body="props">
        <q-tr :props="props" @click.native="editConfig(props.row.configId)" class="cursor-pointer">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
        </q-tr>
      </template>
    </q-table>

  </div>

</template>
<script>
export default {
  name: 'agentInfo',
  data: () => ({
    addShow: true,
    formData: {},
    proData: [],
    columns: [
      { name: 'configId', label: '配置id', field: 'configId', align: 'left' },
      { name: 'projectName', label: '项目名称', field: 'projectName', align: 'left' },
      { name: 'settleMode', label: '结算方式', field: 'settleMode', align: 'left' },
      { name: 'quota', label: '额度', field: 'quota', align: 'left' },
      { name: 'status', label: '状态', field: 'status', align: 'left' }
    ],
    pagination: {
      rowsPerPage: 10
    }
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取渠道信息
    getInfo () {
      if (this.$route.query.agentId) {
        this.addShow = false
        this.$axios.get('/v1/plat/getAgent/' + this.$route.query.agentId)
          .then(res => {
            this.getProInfo()
            this.formData = res.data.data
          })
      }
    },
    // 编辑信息
    toEdit () {
      this.toPath('/plat/agent/directly/editAgent', { agentId: this.$route.query.agentId })
    },
    // 获取项目配置表
    getProInfo () {
      this.$axios.get('/v1/plat/getAgentConfig?aId=' + this.$route.query.agentId)
        .then(res => { this.proData = res.data.data })
    },
    // 编辑或新增项目配置
    editConfig (id) {
      if (id) {
        this.toPath('/plat/agent/directly/editConfig', { agentId: this.$route.query.agentId, configId: id })
      } else {
        this.toPath('/plat/agent/directly/editConfig', { agentId: this.$route.query.agentId, agentName: this.formData.name })
      }
    }
  }
}
</script>
