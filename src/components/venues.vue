<template>
  <div
    style="width: 700px; max-width: 100% "
    @click="getvenues"
  >
    <span
      class="self-center fit no-outline text-grey-5"
      v-if="venuesName===''"
    >点击此处选择</span>
    <span
      class="self-center fit no-outline"
      v-else
    >{{venuesName}}</span>
    <q-dialog v-model="venuesModal">
      <q-layout
        view="Lhh lpR fff"
        container
        class="bg-white"
      >
        <!-- 头部与搜索 -->
        <q-header class="bg-secondary">
          <q-toolbar class="bg-primary text-white rounded-borders">
            <q-btn
              flat
              v-close-popup
              round
              dense
              icon="reply"
            />
            <div
              class="text-subtitle1 gt-xs"
              style="min-width:5em"
            >选择场馆</div>

            <q-space />

            <q-input
              dark
              dense
              standout
              v-model="searchText"
              class="q-ml-md fit"
              placeholder="输入关键词搜索"
              @keydown.enter="search"
            >
              <template v-slot:append>
                <q-icon
                  v-if="searchText === ''"
                  name="search"
                />
                <q-icon
                  v-else
                  name="clear"
                  class="cursor-pointer"
                  @click="searchText = ''"
                />
              </template>
            </q-input>
          </q-toolbar>
        </q-header>
        <!-- 场馆名称列表 -->
        <q-page-container>
          <q-page padding>
            <q-list link>
              <q-item
                tag="label"
                v-ripple
                v-for="(item,index) in venuesList"
                :key="index"
              >
                <q-item-section avatar>
                  <q-radio
                    v-model="selectId"
                    :val="item.venuesId"
                    @input="selectvenues"
                    color="teal"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{item.name}}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-page>
        </q-page-container>
      </q-layout>
    </q-dialog>‪⁠‌‪‫‎‍‬‌‎‍‭‏‏‏‪⁠‌‪‫‎‍‬‌‎‍‭‏‏‏‍‭‌‬‌‏‫‫‭‪⁠‌‪‫‎‍‬‌‎‍‭‏‏‏
  </div>
</template>

<script>
export default {
  name: 'venues',
  props: {
    /* 场馆名称 */
    value: {
      type: Number
    },
    name: {
      type: String
    }
  },
  data: () => ({
    venuesName: '',
    venuesModal: false,
    searchText: '',
    selectId: -1,
    venuesList: [{ venuesId: 1, name: '场馆名' }]
  }),
  mounted () {
    this.venuesName = this.name
  },
  methods: {
    getvenues () {
      this.venuesModal = true
      let self = this
      this.$axios
        .get('v1/plat/getVenues')
        .then(res => {
          self.venuesList = res.data.data
        })
        .catch(err => {
          self.$q.notify(`获取场馆信息失败，错误为${err}`)
        })
    },
    selectvenues (e) {
      this.$q.dialog({
        title: '确认',
        message: '是否确认更换场馆',
        cancel: '取消',
        ok: '确认更换',
        persistent: true
      }).onOk(() => {
        this.venuesList.forEach(item => {
          if (item.venuesId === e) {
            this.venuesName = item.name
          }
        })
        this.$emit('input', this.selectId)
        this.$emit('change', this.venuesName)
        this.venuesModal = false
      })
    },
    search () {
      let self = this
      this.$axios
        .get('v1/plat/getVenues?keyword=' + this.searchText)
        .then(res => {
          self.venuesList = res.data.data
        })
        .catch(err => {
          self.$q.notify(`搜索场馆关键词失败，错误为${err}`)
        })
    }
  },
  watch: {
    name (newVal, oldVal) {
      this.venuesName = newVal
    }
  }
}
</script>
