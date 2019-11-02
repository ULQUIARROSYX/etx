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
                label="系统管理 - 角色管理"
                to="/plat/system/role"
            />
            <q-breadcrumbs-el
                label="角色权限管理"
                :to="'/plat/system/role/rolePower?roleId='+$route.query.roleId"
            />
            <q-breadcrumbs-el label="编辑菜单项" />
        </q-breadcrumbs>
        <q-tree
            color="accent"
            :nodes="menuTree"
            node-key="resource_id"
            :ticked.sync="selected"
            tick-strategy="leaf"
        >
            <template
                slot="default-header"
                slot-scope="prop"
            >
                <span>{{ prop.node.resource_id }}&nbsp;-&nbsp; </span>
                <span>{{ prop.node.name }} </span>
                <span
                    class="text-grey-5"
                    v-if="prop.node.menu_group&&prop.node.menu_group!==''"
                >&nbsp;-&nbsp;{{prop.node.menu_group}}</span>
            </template>
        </q-tree>
        <!-- 提交按钮 -->
        <q-btn
            color="info"
            class="q-mr-lg q-mt-lg"
            flat
            label="返回"
            @click="$router.back(-1)"
        />

        <q-btn
            label="提交修改"
            color="primary"
            class="q-mt-lg"
            glossy
            @click="submit"
        />
    </div>
</template>

<script>
export default {
    name: 'roleMenu',
    data: () => ({
        menuTree: [], // 所有的菜单项，多级对象数组
        oneMenuTree: [], // 展开的menuTree
        beginSelected: [], // 最初选择的菜单项，一级数字数组，包含父级id
        selected: [] // 当前选中的菜单项，一级数字数组，不包含父级id
    }),
    mounted () {
        this.getInfo()
    },
    methods: {
        // 获取信息
        getInfo () {
            this.$axios.post('/v1/auth/getAllMenu', {})
                .then((res) => {
                    this.menuTree = res.data.data.menu
                    this.oneMenuTree = this.bian(res.data.data.menu)
                    this.getSelect()
                })
        },
        // 获取已选中的菜单项
        getSelect () {
            this.$axios.post('/v1/auth/getRoleById', { roleId: this.$route.query.roleId })
                .then((res) => {
                    this.beginSelected = this.bian(res.data.data.menu).map(e => e.resource_id)
                    this.selected = this.beginSelected
                })
        },
        // 提交修改
        submit () {
            this.addParentId()
            let delIds = this.arrCut(this.beginSelected, this.selected)
            let addIds = this.arrCut(this.selected, this.beginSelected)
            this.$axios.post('/v1/auth/setPermisson', {
                roleId: this.$route.query.roleId,
                addIds: addIds,
                delIds: delIds
            })
                .then(this.formComplete)
        },
        // 展开含有children的数组
        bian (arr) {
            let result = []
            arr.forEach(ele => {
                result.push(ele)
                if (ele.children) {
                    ele.children.forEach(e => { result.push(e) })
                }
            })
            return result
        },
        // 在选择结果中加入父级id
        addParentId () {
            this.selected.forEach(item => {
                this.oneMenuTree.forEach(menuItem => {
                    if (menuItem.resource_id === item && menuItem.parent !== 0) {
                        this.selected.push(menuItem.parent)
                    }
                })
            })
            this.selected = [...new Set(this.selected)]
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
