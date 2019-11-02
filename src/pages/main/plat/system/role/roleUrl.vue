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
            <q-breadcrumbs-el
                label="角色权限管理"
                :to="'/plat/system/role/rolePower?roleId='+$route.query.roleId"
            />
            <q-breadcrumbs-el label="编辑URL项" />
        </q-breadcrumbs>
        <div class="row items-center text-secondary justify-between">
            <div class="infoGroupTitle">全部URl资源</div>
            <q-btn
                color="primary"
                icon="add_box"
                label="提交修改"
                glossy
                @click="keep"
            ></q-btn>
        </div>

        <q-table
            :columns="columns"
            :data="tableData"
            color="primary"
            row-key="name"
            selection="multiple"
            :selected.sync="selected"
            :pagination.sync="pagination"
            class="q-mt-lg"
        >
        </q-table>
    </div>

</template>

<script>
export default {
    name: 'roleUrl',
    data: () => ({
        columns: [
            { name: 'resource_id', label: '资源id', field: 'resource_id', align: 'left' },
            { name: 'name', label: '名称', field: 'name', align: 'left' },
            { name: 'path', label: '链接', field: 'path', align: 'left' },
            { name: 'enable', label: '是否可用', field: 'enable', align: 'left' },
            { name: 'description', label: '描述', field: 'description', align: 'left' }
        ],
        tableData: [], // 全部URL资源
        beginSelect: [], // 初始选中项
        selected: [], // 当前选择项
        pagination: {
            rowsPerPage: 10
        }

    }),
    mounted () {
        this.getInfo()
    },
    methods: {
        // 获取全部url
        getInfo () {
            this.$axios.post('/v1/auth/getAllResource', {})
                .then((res) => {
                    this.tableData = res.data.data.resourceList.filter(item => item.type === 2)
                    this.getSelect()
                })
        },
        // 获取初始已选中url
        getSelect () {
            this.$axios.post('/v1/auth/getRoleById', { roleId: this.$route.query.roleId })
                .then((res) => {
                    this.beginSelect = res.data.data.urlPermisson
                    this.selected = this.beginSelect
                })
        },
        // 保存修改
        keep () {
            let begin = this.beginSelect.map(e => e.resource_id)
            let now = this.selected.map(e => e.resource_id)
            this.$axios.post('/v1/auth/setPermisson', {
                roleId: this.$route.query.roleId,
                addIds: this.arrCut(now, begin),
                delIds: this.arrCut(begin, now)
            })
                .then(this.formComplete)
        },
        // 数组相减
        arrCut (arr1, arr2) {
            return arr1.filter(e => {
                return arr2.indexOf(e) === -1
            })
        }
    }
}
</script>
