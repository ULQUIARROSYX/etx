<template>
    <div style="width: 700px; max-width: 100%;" @click="getCompany">
        <span class="self-center fit no-outline text-grey-5" v-if="companyName === ''">点击此处选择</span>
        <span class="self-center fit no-outline" v-else>{{ companyName }}</span>
        <q-dialog v-model="companyModal">
            <q-layout view="Lhh lpR fff" container class="bg-white">
                <!-- 头部与搜索 -->
                <q-header class="bg-secondary">
                    <q-toolbar class="bg-primary text-white rounded-borders">
                        <q-btn flat v-close-popup round dense icon="reply" />
                        <div class="text-subtitle1 gt-xs" style="min-width:5em">
                            选择公司
                        </div>

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
                        <!-- 公司名称列表 -->
                        <q-list link>
                            <q-item tag="label" v-ripple v-for="(item, index) in companyList" :key="index">
                                <q-item-section avatar>
                                    <q-radio v-model="selectId" :val="item.companyId" @input="selectCompany" color="teal" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label>{{ item.fullname }}</q-item-label>
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
    name: 'Company',
    props: {
        /* 公司名称 */
        value: {
            type: Number
        },
        name: {
            type: String
        }
    },
    data: () => ({
        companyName: '',
        companyModal: false,
        searchText: '',
        selectId: -1,
        companyList: [{ companyId: 1, fullname: '公司名' }]
    }),
    mounted () {
        this.companyName = this.name
    },
    methods: {
        getCompany () {
            this.companyModal = true
            let self = this
            this.$axios
                .get('v1/comm/getCompany')
                .then(res => {
                    self.companyList = res.data.data
                })
                .catch(err => {
                    self.notifyError(`获取公司信息失败，错误为${err}`)
                })
        },
        selectCompany (e) {
            this.$q
                .dialog({
                    title: '确认',
                    message: '是否确认更换主办方公司',
                    cancel: '取消',
                    ok: '确认更换',
                    persistent: true
                })
                .onOk(() => {
                    this.companyList.forEach(item => {
                        if (item.companyId === e) {
                            this.companyName = item.fullname
                        }
                    })
                    this.$emit('input', this.selectId)
                    this.$emit('change', this.companyName)
                    this.companyModal = false
                })
        },
        search () {
            this.$axios.get('v1/comm/getCompany?keyword=' + this.searchText).then(res => {
                this.companyList = res.data.data
            })
        }
    },
    watch: {
        name (newVal, oldVal) {
            this.companyName = newVal
        }
    }
}
</script>
