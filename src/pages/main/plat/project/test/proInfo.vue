<template>
  <div style="width: 500px; max-width: 100%">
    <q-breadcrumbs class="text-grey" active-color="primary">
      <q-breadcrumbs-el label="首页" icon="home" to="/" />
      <q-breadcrumbs-el label="门禁验票项目" to="/plat/project/test" />
      <q-breadcrumbs-el label="项目信息" />
    </q-breadcrumbs>

    <div class="row justify-between q-my-lg items-end">
      <div class="infoGroupTitle">基本信息</div>
      <div class="col text-right">
        <q-btn color="primary" icon="add_box" label="编辑项目" glossy @click="toEdit" />
      </div>
    </div>

    <div class="row q-mt-md">
      <div class="infoTitle">项目名称</div>
      <div class="text-grey-7">{{proInfo.name}}</div>
    </div>
    <div class="row q-mt-md">
      <div class="infoTitle">简介</div>
      <div class="text-grey-7">{{proInfo.brief}}</div>
    </div>
    <div class="row q-mt-md items-center">
      <div class="infoTitle">状态</div>
      <div class="q-gutter-md">
        <q-radio v-model="proInfo.status" :val="0" label="未上线" color="red" disable class="q-mr-md" />
        <q-radio v-model="proInfo.status" :val="1" label="已上线" color="teal" disable class="q-mr-md" />
        <q-radio v-model="proInfo.status" :val="2" label="已结束" color="cyan" disable class="q-mr-md" />
      </div>
    </div>

    <div class="row justify-between q-my-lg items-end">
      <div class="infoGroupTitle">验票终端</div>
      <div class="col text-right">
        <q-btn color="secondary" disable glossy icon="edit" label="入场数据" />
      </div>
    </div>

    <q-table :data="tableData" :columns="columns" row-key="name">
      <!--表格主体-->
      <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
      </q-tr>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'testProInfo',
  data: () => ({
    columns: [
      { name: 'proId', label: '编号', field: 'proId', align: 'left' },
      {
        name: 'name',
        label: '票品名称',
        field: 'name',
        align: 'left'
      },
      {
        name: 'area',
        label: '位置',
        field: 'area',
        align: 'left'
      },
      {
        name: 'time',
        label: '激活时间',
        field: 'time',
        align: 'left'
      },
      {
        name: 'state',
        label: '状态',
        field: 'state',
        align: 'left'
      }
    ],
    tableData: [],
    proInfo: {}
  }),
  mounted () {
    this.getInfo()
  },
  methods: {
    // 获取信息
    getInfo () {
      this.$axios
        .get('/v1/plat/getProject/' + this.$route.query.proId)
        .then(res => (this.proInfo = res.data.data))
    },
    // 编辑项目
    toEdit () {
      this.toPath('/plat/project/test/editPro', { proId: this.$route.query.proId })
    }
  }
}
</script>
