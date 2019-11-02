<template>
  <div style="width: 700px; max-width: 100%;" @click="getproject">
    <span class="self-center fit no-outline text-grey-5" v-if="projectName===''">点击此处选择</span>
    <span class="self-center fit no-outline" v-else>{{projectName}}</span>
    <q-dialog v-model="projectModal">
      <q-layout view="Lhh lpR fff" container class="bg-white">
        <!-- 头部与搜索 -->
        <q-header class="bg-secondary">
          <q-toolbar class="bg-primary text-white rounded-borders">
            <q-btn flat v-close-popup round dense icon="reply" />
            <div class="text-subtitle1 gt-xs" style="min-width:5em">选择项目</div>

            <q-space />

            <q-input dark dense standout v-model="searchText" class="q-ml-md fit" placeholder="输入关键词搜索" @keydown.enter="search">
              <template v-slot:append>
                <q-icon v-if="searchText === ''" name="search" />
                <q-icon v-else name="clear" class="cursor-pointer" @click="searchText = ''" />
              </template>
            </q-input>
          </q-toolbar>
        </q-header>
        <q-page-container>
          <q-page padding>
            <!-- 项目名称列表 -->
            <q-list link>
              <q-item tag="label" v-ripple v-for="(item,index) in projectList" :key="index">
                <q-item-section avatar>
                  <q-radio v-model="selectId" :val="item.projectId" @input="selectPro" color="teal" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{item.name}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>

  </div>
</template>

<script>
export default {
  name: 'project',
  props: {
    /* 项目名称 */
    value: {
      type: Number
    },
    name: {
      type: String
    },
    agentId: {
      type: String
    }
  },
  data: () => ({
    projectName: '',
    projectModal: false,
    searchText: '',
    selectId: -1,
    projectList: []
  }),
  mounted () {
    this.projectName = this.name
  },
  methods: {
    // 获取全部的项目信息
    getproject () {
      this.projectModal = true
      this.$axios.get('/v1/plat/getProject?type=2&status=1')
        .then(res => {
          this.$axios.get('/v1/plat/getAgentConfig?agentId=' + this.agentId)
            .then(res2 => {
              let configIds = res2.data.data.filter(e => e.agentId === parseInt(this.agentId)).map(a => a.projectId)
              this.projectList = res.data.data.filter(e => !configIds.includes(e.projectId))
            })
        })
    },
    selectPro (e) {
      this.$q.dialog({
        title: '确认',
        message: '是否确认选择项目',
        cancel: '取消',
        ok: '确认更换',
        persistent: true
      }).onOk(() => {
        this.projectList.forEach(item => {
          if (item.projectId === e) { this.projectName = item.name }
        })
        this.$emit('input', this.selectId)
        this.$emit('change', this.projectName)
        this.projectModal = false
      })
    },
    search () {
      this.$axios
        .get('v1/comm/getproject?type=2&status=1&keyword=' + this.searchText)
        .then(res => { this.projectList = res.data.data })
    }
  },
  watch: {
    name (newVal, oldVal) {
      this.projectName = newVal
    }
  }
}
</script>
