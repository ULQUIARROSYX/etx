<template>
    <div style="width: 700px; max-width: 100%">
        <q-breadcrumbs
            class="text-grey q-mb-lg"
            active-color="primary"
        >
            <q-breadcrumbs-el
                label="首页"
                icon="home"
                to="/"
            />
            <q-breadcrumbs-el label="系统管理 - 人员管理" />
        </q-breadcrumbs>
        <div class="row items-center text-secondary justify-between q-mb-md">
            <!-- 选择公司 -->
            <div class="col row items-center q-gutter-sm">
                <q-select
                    dense
                    outlined
                    color="accent"
                    label="选择公司"
                    v-model="company.value"
                    :options="company.options"
                    option-disable="inactive"
                    map-options
                    emit-value
                    @filter="getCompany"
                    @input="selectCompany"
                    style="min-width: 150px; max-width: 200px"
                />
                <q-input
                    v-model="searchText"
                    dense
                    placeholder="输入名称关键字后按回车键"
                    @keydown.enter="search"
                    style="min-width:250px;"
                >
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>

            </div>
            <q-btn
                color="secondary"
                icon="add_box"
                glossy
                label="添加新人员"
                @click="editOp()"
            />
        </div>
        <q-table
            class="q-my-md"
            :data="tableData"
            :columns="columns"
            :pagination.sync="pagination"
            row-key="op_id"
        >
            <!--表格主体-->
            <q-tr
                slot="body"
                slot-scope="props"
                :props="props"
                @click.native="editOp(props.row.op_id)"
                class="cursor-pointer"
            >
                <q-td
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                >
                    {{ col.value }}
                </q-td>
            </q-tr>
        </q-table>
    </div>

</template>

<script>
export default {
    name: 'op',
    data: () => ({
        columns: [
            { name: 'op_id', label: '人员id', field: 'op_id', align: 'left' },
            { name: 'login', label: '登录名', field: 'login', align: 'left' },
            { name: 'name', label: '名称', field: 'name', align: 'left' },
            { name: 'company_name', label: '公司名', field: 'company_name', align: 'left' }
        ],
        tableData: [],
        searchText: '',
        company: {
            value: null,
            options: []
        },
        pagination: {
            rowsPerPage: 10
        }
    }),
    mounted () {
        this.getInfo()
    },
    methods: {
        // 获取人员的数据
        getInfo () {
            this.$axios.post('/v1/auth/getAllOp', {})
                .then(res => { this.tableData = res.data.data.opList })
        },
        // 获取公司列表
        getCompany (val, update, abort) {
            if (this.company.options.length !== 0) {
                // 已加载过
                update()
                return
            }
            this.$axios.get('/v1/comm/getCompany')
                .then(res => {
                    update(() => {
                        this.company.options = res.data.data.map(e => {
                            return { label: e.name, value: e.companyId }
                        })
                    })
                })
        },
        // 选择公司
        selectCompany (id) {
            this.$axios
                .post('/v1/auth/opInCompany', { companyId: id })
                .then(res => {
                    this.tableData = res.data.data.opList
                })
        },
        // 关键字搜索人员
        search () {
            this.$axios
                .post('/v1/auth/getAllOp', { keyword: this.searchText })
                .then(res => {
                    this.tableData = res.data.data.opList
                    this.company.value = null
                })
        },
        // 进入编辑页
        editOp (id) {
            if (id) {
                this.toPath('/plat/system/op/editOp', { opId: id })
            } else {
                this.toPath('/plat/system/op/editOp')
            }
        }
    }

}
</script>
