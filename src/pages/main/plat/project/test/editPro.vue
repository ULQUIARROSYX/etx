<template>
    <div style="width: 500px; max-width: 100%">
        <q-breadcrumbs
            class="text-grey q-mb-lg"
            active-color="primary"
        >
            <q-breadcrumbs-el
                label="首页"
                icon="home"
                to="/"
            />
            <q-breadcrumbs-el
                label="门禁验票项目"
                to="/plat/project/test"
            />
            <q-breadcrumbs-el
                label="项目信息"
                :to="'/plat/project/test/proInfo?proId='+$route.query.proId"
                v-if="!addShow"
            />
            <q-breadcrumbs-el :label="addShow?'新增项目':'编辑项目'" />
        </q-breadcrumbs>

        <q-form
            @submit="onSubmit"
            class="q-mt-lg"
        >

            <!-- 项目id -->
            <q-input
                v-model="$route.query.proId"
                type="number"
                label="项目id（ 只读 ）"
                readonly
                v-if="!addShow"
                hint=""
            ></q-input>

            <!-- 项目状态 -->
            <q-field
                label="项目状态"
                stack-label
                hint
            >
                <template v-slot:control>
                    <div class="q-gutter-md">
                        <q-radio
                            v-model="form.status"
                            :val="0"
                            label="未上线"
                            color="red"
                            class="q-mr-md"
                        />
                        <q-radio
                            v-model="form.status"
                            :val="1"
                            label="已上线"
                            color="teal"
                            class="q-mr-md"
                        />
                        <q-radio
                            v-model="form.status"
                            :val="2"
                            label="已结束"
                            color="cyan"
                            class="q-mr-md"
                        />
                    </div>
                </template>
            </q-field>

            <!-- 项目名称 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="form.name"
                label="项目名称"
            ></q-input>
            <!-- 项目简介 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="form.brief"
                label="项目简介"
            ></q-input>
            <!-- 电子票项目 -->
            <q-select
                :rules="[ val => !!val || '不可为空']"
                v-model="form.eticket"
                :options="eTicketOptions"
                emit-value=""
                map-options=""
                label="电子票项目"
            ></q-select>
            <!-- 现场验票系统 -->
            <q-field
                label="现场验票系统"
                stack-label
                hint
            >
                <template v-slot:control>
                    <q-toggle
                        :label="form.exfs===1?'已启用':'已禁用'"
                        left-label
                        v-model="form.exfs"
                        :true-value="1"
                        :false-value="0"
                    />
                </template>
            </q-field>
            <!-- 终端激活码 -->
            <q-input
                :rules="[ val => !!val || '不可为空']"
                v-model="form.termkey"
                label="终端激活码"
            ></q-input>
            <!-- 支付方式 -->
            <q-select
                :rules="[ val => val.length > 0 || '不可为空']"
                v-model="form.payin"
                multiple
                :options="payOptions"
                use-chips
                color="accent"
                label="支付方式"
            />
            <!-- 支付价格 -->
            <q-field
                label="支付价格"
                stack-label
                v-model="form.payinfee"
                :rules="[ val => val.length > 0 || '不可为空']"
            >
                <!-- 表格 -->
                <template v-slot:control>
                    <q-table
                        class="q-mt-xs"
                        :columns="paytableData.columns"
                        :data="form.payinfee"
                        hide-bottom
                        :selected.sync="paytableData.selected"
                        selection="multiple"
                        color="primary"
                        row-key="cdate"
                        v-if="form.payinfee.length>0"
                    />
                    <div v-else>暂无价格信息</div>
                </template>
                <!-- 加减按钮 -->
                <template v-slot:append>
                    <q-btn
                        round
                        dense
                        flat
                        icon="delete"
                        color="negative"
                        v-if="paytableData.selected.length>0"
                        @click="delPayinfee"
                    />
                    <q-btn
                        round
                        dense
                        flat
                        icon="add_box"
                        color="positive"
                        @click="paytableData.payModal = true"
                    />
                </template>
            </q-field>

            <q-btn
                color="info"
                class="q-mr-lg q-mt-lg"
                flat
                label="返回"
                @click="$router.back(-1)"
            />
            <q-btn
                color="primary"
                class="q-mt-lg"
                glossy
                label="点击提交表单"
                type="submit"
            />
        </q-form>

        <!-- 支付价格模态框 -->
        <q-dialog v-model="paytableData.payModal">
            <q-layout
                style="max-width:400px;max-height:400px"
                view="Lhh lpR fff"
                container
                class="bg-white"
            >
                <!-- 头部 -->
                <q-header class="bg-secondary">
                    <q-toolbar class="bg-primary text-white rounded-borders">
                        <q-btn
                            flat
                            v-close-popup
                            round
                            dense
                            icon="reply"
                        />
                        <div class="text-subtitle1 gt-xs">添加支付价格</div>
                    </q-toolbar>
                </q-header>
                <q-page-container>
                    <q-page padding>
                        <!-- 表单 -->
                        <q-form @submit="addPayinfee">
                            <!-- 支付金额（分） -->
                            <q-input
                                :rules="[ val => !!val || '不可为空']"
                                v-model="paytableData.payNewForm.cost"
                                label="支付金额（分）"
                            ></q-input>
                            <!-- 起始时间 -->
                            <q-input
                                class="col-6 q-pr-sm"
                                v-model="paytableData.payNewForm.startTime"
                                label="起始时间"
                                mask="date"
                                :rules="['date']"
                                error-message="格式错误"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        name="event"
                                        class="cursor-pointer"
                                    >
                                        <q-popup-proxy
                                            ref="qDateProxy"
                                            transition-show="scale"
                                            transition-hide="scale"
                                        >
                                            <q-date
                                                v-model="paytableData.payNewForm.startTime"
                                                @input="() => $refs.qDateProxy.hide()"
                                            />
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                            <!-- 结束时间 -->
                            <q-input
                                class="col-6 q-pr-sm"
                                v-model="paytableData.payNewForm.endTime"
                                label="结束时间"
                                mask="date"
                                :rules="['date']"
                                error-message="格式错误"
                            >
                                <template v-slot:append>
                                    <q-icon
                                        name="event"
                                        class="cursor-pointer"
                                    >
                                        <q-popup-proxy
                                            ref="qDateProxy2"
                                            transition-show="scale"
                                            transition-hide="scale"
                                        >
                                            <q-date
                                                v-model="paytableData.payNewForm.endTime"
                                                @input="() => $refs.qDateProxy2.hide()"
                                            />
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>

                            <q-btn
                                color="secondary"
                                glossy
                                class="full-width q-mt-lg"
                                label="确认添加"
                                icon="add_box"
                                type="submit"
                            />
                        </q-form>
                    </q-page>
                </q-page-container>
            </q-layout>
        </q-dialog>
    </div>
</template>
<script>
export default {
    name: 'editTestPro',
    data () {
        return {
            addShow: true,
            payOptions: ['微信支付', '支付宝', '羊城通', '银联闪付'],
            eTicketOptions: [],
            form: {
                type: 3,
                name: '',
                status: 0,
                brief: '',
                eticket: null,
                exfs: 0,
                termkey: '',
                payin: [],
                payinfee: []
            },
            paytableData: {
                columns: [
                    { name: 'startTime', label: '起始时间', field: 'startTime', align: 'left' },
                    { name: 'endTime', label: '结束时间', field: 'endTime', align: 'left' },
                    { name: 'cost', label: '金额', field: 'cost', align: 'left' }
                ],
                selected: [],
                payModal: false,
                payNewForm: { startTime: '', endTime: '', cost: '', cdate: '' }
            }
        }
    },
    mounted () {
        this.getInfo()
        this.getETicket()
    },
    methods: {
        // 提交表单信息
        onSubmit () {
            let formData = {
                type: 3,
                name: this.form.name,
                status: this.form.status,
                brief: this.form.brief,
                eticket: this.form.eticket,
                exfs: this.form.exfs,
                termkey: this.form.termkey,
                payin: JSON.stringify(this.form.payin),
                payinfee: JSON.stringify(this.form.payinfee)
            }
            if (this.addShow) {
                this.$axios
                    .post('/v1/plat/newProject', formData)
                    .then(this.formComplete)
            } else {
                this.$axios
                    .post('/v1/plat/updProject/' + this.$route.query.proId, formData)
                    .then(this.formComplete)
            }
        },
        // 获取信息
        getInfo () {
            if (this.$route.query.proId) {
                this.addShow = false
                this.$axios
                    .get('/v1/plat/getProject/' + this.$route.query.proId)
                    .then(res => {
                        let result = res.data.data
                        result.payin = JSON.parse(result.payin)
                        result.payinfee = JSON.parse(result.payinfee)
                        this.form = result
                    })
            }
        },
        // 获取电子票项目选项列表
        getETicket () {
            this.$axios.get('v1/plat/getProject?type=1').then(res => {
                this.eTicketOptions = res.data.data.map(e => {
                    return { label: e.name, value: e.projectId }
                })
            })
        },
        // 添加支付价格
        addPayinfee () {
            let result = this.paytableData.payNewForm
            result.cdate = (new Date()).valueOf()
            this.form.payinfee.push(result)
            this.paytableData.payNewForm = { startTime: '', endTime: '', cost: '', cdate: '' }
            this.paytableData.payModal = false
        },
        // 删除支付价格
        delPayinfee () {
            let delIds = this.paytableData.selected.map(e => e.cdate)
            this.form.payinfee = this.form.payinfee.filter(item => !delIds.includes(item.cdate))
        }

    }
}
</script>
