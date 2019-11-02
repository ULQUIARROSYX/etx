<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="售票服务项目" to="/plat/project/sell" />
      <q-breadcrumbs-el label="项目信息" />
    </q-breadcrumbs>

    <div class="row justify-between q-mt-lg items-center">
      <div class="infoGroupTitle">基本信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="add_box" glossy label="编辑项目信息" @click="toEdit"></q-btn>
      </div>
    </div>
    <div class="row q-mt-md items-center">
      <div class="infoTitle">状态</div>
      <div class="q-gutter-md">
        <q-radio v-model="formData.status" :val="0" label="未上线" color="red" disable class="q-mr-md" />
        <q-radio v-model="formData.status" :val="1" label="已上线" color="teal" disable class="q-mr-md" />
        <q-radio v-model="formData.status" :val="2" label="已结束" color="cyan" disable class="q-mr-md" />
      </div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">图片</div>
      <img style="width:50px;" :src="formData.preview" />
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
      <div class="infoTitle">项目简介</div>
      <div class="text-grey-7">{{formData.brief}}</div>
    </div>

    <div class="row justify-between q-mb-lg items-end q-mt-lg">
      <div class="col infoGroupTitle">票品信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="edit" rounded class="glossy" label="新增票品信息" @click="addTicket"></q-btn>
      </div>
    </div>
    <q-table :data="tableData" :columns="columns" row-key="name">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer" @click.native="ToTicket(props.row.ticketId)">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
      </q-tr>
    </q-table>
    <!-- 库存信息 -->
    <div class="row justify-between q-my-lg items-center">
      <div class="infoGroupTitle">库存信息</div>
      <div class="col text-right">
        <q-btn color="secondary" icon="edit" glossy rounded label="库存管理" @click="toEditSocket"></q-btn>
      </div>
    </div>
    <q-table :data="tableData2" :columns="columns2" />
  </div>
</template>

<script>
export default {
  name: 'sellProInfo',
  data: () => ({
    columns: [
      { name: 'ticketId', label: '票品ID', field: 'ticketId', align: 'left' },
      { name: 'name', label: '票品名称', field: 'name', align: 'left' },
      { name: 'status', label: '当前状态', field: 'status', align: 'left' }
    ],
    tableData: [],
    checked: [],
    state: false,
    formData: {},
    columns2: [
      { name: 'ticketName', label: '票品', field: 'ticketName', align: 'left' },
      { name: 'gradeName', label: '票档', field: 'gradeName', align: 'left' },
      { name: 'kind', label: '类型', field: 'kind', align: 'left' },
      { name: 'deliverynum', label: '销售数', field: 'deliverynum', align: 'left' },
      { name: 'totalnum', label: '库存数', field: 'totalnum', align: 'left' }
    ],
    tableData2: []
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      this.$axios.get('/v1/plat/getProject/' + this.$route.query.proId).then(res => {
        this.getTicket()
        this.getStock()
        this.formData = res.data.data
      })
    },
    // 获取票品列表
    getTicket () {
      this.$axios.get('v1/plat/getSellticket?projectId=' + this.$route.query.proId).then(res => {
        this.tableData = res.data.data
      })
    },
    // 获取库存信息
    getStock () {
      this.$axios.get('v1/plat/getStock?projectId=' + this.$route.query.proId).then(res => {
        this.tableData2 = res.data.data
      })
    },
    // 编辑项目信息
    toEdit () {
      this.toPath('/plat/project/sell/editPro', { proId: this.$route.query.proId })
    },
    // 查看票品信息
    ToTicket (ticketId) {
      this.toPath('/plat/project/sell/ticket', { proId: this.$route.query.proId, ticketId: ticketId })
    },
    // 新增票品
    addTicket () {
      this.toPath('/plat/project/sell/editTicket', { proId: this.$route.query.proId })
    },
    // 编辑票品
    editTicket (ticketId) {
      this.toPath('/plat/project/sell/editTicket', { proId: this.$route.query.proId, ticketId: ticketId })
    },
    // 库存管理
    toEditSocket () {
      this.toPath('/plat/project/sell/editStock', { proId: this.$route.query.proId })
    }
  }
}
</script>
