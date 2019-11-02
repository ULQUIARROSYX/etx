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
            <q-breadcrumbs-el
                label="系统管理 - 角色管理"
                to="/plat/system/role"
            />
            <q-breadcrumbs-el label="人员管理" />
        </q-breadcrumbs>
        <div class="row justify-between items-center">
            <div class="infoGroupTitle">角色内人员列表</div>
            <div class="row items-center">
                <q-btn
                    color="red"
                    round
                    size="sm"
                    icon="delete"
                    class="q-mr-md"
                    v-show="opIds.length>0"
                    @click="deleteOp"
                ></q-btn>
                <q-btn
                    glossy
                    color="secondary"
                    icon="add_box"
                    label="分配新人员"
                    @click="opSelect"
                ></q-btn>
            </div>
        </div>
        <q-table
            class="q-mt-md"
            color="primary"
            :data="data"
            :columns="columns"
            row-key="name"
            selection="multiple"
            :selected.sync="selected"
            :pagination.sync="pagination"
        />
    </div>

</template>

<script>
export default {
    name: 'roleOp',
    data: () => ({
        columns: [
            { name: 'op_id', label: '人员id', field: 'op_id', align: 'left' },
            { name: 'name', label: '名称', field: 'name', align: 'left' },
            { name: 'login', label: '登录名', field: 'login', align: 'left' },
            { name: 'company_id', label: '公司id', field: 'company_id', align: 'left' },
            { name: 'description', label: '描述', field: 'description', align: 'left' }
        ],
        data: [
            {
                op_id: '',
                name: '',
                login: '',
                cdate: '',
                company_id: '',
                description: '',
                enable: '',
                last_login: ''
            }
        ],
        selected: [],
        pagination: {
            rowsPerPage: 10
        }

    }),
    mounted () {
        this.getInfo()
    },
    methods: {
        // 获取信息
        getInfo () {
            this.$axios.post('/v1/auth/opInRole', { roleId: this.$route.query.roleId })
                .then((res) => {
                    this.data = res.data.data.opList
                })
        },

        // 删除选中人员
        deleteOp () {
            this.$axios.post('/v1/auth/setRoleOp', {
                roleId: this.$route.query.roleId,
                action: 'delete',
                opIds: this.opIds
            })
                .then((res) => {
                    if (res.data.code === 0) {
                        this.data = this.data.filter(opItem => {
                            return this.opIds.indexOf(opItem.op_id) === -1
                        })
                    }
                })
        },
        // 选择新人员
        opSelect () {
            this.toPath('/plat/system/role/opSelect', { roleId: this.$route.query.roleId })
        }
    },
    computed: {
        opIds () { return this.selected.map(e => e.op_id) }
    }
}
</script>
