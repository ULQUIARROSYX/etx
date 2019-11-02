<template>
    <div style="width: 500px; max-width: 100%">
        <q-breadcrumbs
            class="text-grey"
            active-color="primary"
        >
            <q-breadcrumbs-el
                label="首页"
                icon="home"
                to="/"
            />
            <q-breadcrumbs-el
                label="系统管理 - 基础数据"
                to="/base"
            />
            <q-breadcrumbs-el
                label="资源管理"
                to="/plat/system/base/res"
            />
            <q-breadcrumbs-el label="资源详情" />
        </q-breadcrumbs>

        <q-form
            @submit="submit"
            class="q-mt-lg"
        >
            <!-- 资源id -->
            <q-input
                v-model="formData.resource_id"
                v-if="!addShow"
                type="number"
                label="资源id（只读）"
                readonly
            ></q-input>
            <!-- 资源类型 -->
            <q-field
                label="类型（只读）"
                stack-label
                readonly
            >
                <template v-slot:control>
                    <div class="q-gutter-md">
                        <q-radio
                            class="q-mr-md"
                            disable
                            v-model="formData.type"
                            :val="1"
                            label="菜单项"
                        />
                        <q-radio
                            class="q-mr-md"
                            disable
                            v-model="formData.type"
                            :val="2"
                            label="URL接口"
                        />
                    </div>
                </template>
            </q-field>

            <!-- 父级菜单 -->
            <q-field
                label="父级菜单"
                hint="点击箭头展开选择，紫色为选中项，默认根目录"
                stack-label
                v-model="formData.parent"
                :rules="[val=>val!==null||'此为必选项']"
                v-if="formData.type===1"
            >
                <template v-slot:control>
                    <div class="full-width">
                        <q-tree
                            color="accent"
                            :nodes="tree.list"
                            node-key="resource_id"
                            :selected.sync="formData.parent"
                            @lazy-load="getMenu"
                        >
                            <template
                                slot="default-header"
                                slot-scope="prop"
                            >
                                <div>
                                    <span>
                                        {{ prop.node.name }}
                                    </span>

                                    <span
                                        class="text-grey-5"
                                        v-if="prop.node.menu_group&&prop.node.menu_group!==''"
                                    >
                                        - {{prop.node.menu_group}}
                                    </span>
                                </div>

                            </template>
                        </q-tree>
                    </div>
                </template>
            </q-field>
            <!-- 分组名 -->
            <q-input
                v-model="formData.menu_group"
                label="分组名"
                hint="仅当父级菜单为根目录时有效"
                class="q-mt-sm"
                v-if="formData.parent==0&&formData.type==1"
            ></q-input>
            <!-- 菜单项图标 -->
            <q-input
                v-model="formData.menu_icon"
                type="text"
                label="菜单项图标"
                hint="仅当父级菜单为根目录时有效"
                class="q-mt-sm"
                v-if="formData.parent==0&&formData.type==1"
            ></q-input>
            <!-- 名称 -->
            <q-input
                v-model="formData.name"
                type="text"
                label="名称"
                class="q-mt-sm"
                :rules="[ val => !!val || '不可为空']"
            ></q-input>
            <!-- 路径 -->
            <q-input
                v-model="formData.path"
                :rules="[ val => !!val || '不可为空']"
                type="text"
                label="路径"
            ></q-input>
            <!-- 排序 -->
            <q-input
                v-model="formData.sort"
                type="number"
                label="排序"
                :rules="[ val => val!=='' || '不可为空']"
            ></q-input>
            <!-- 说明 -->
            <q-input
                v-model="formData.description"
                type="text"
                label="说明"
                :rules="[ val => !!val || '不可为空']"
            ></q-input>
            <!-- 状态 -->
            <q-field
                label="状态"
                stack-label
                hint=""
            >
                <template v-slot:control>
                    <div class="q-gutter-md">
                        <q-radio
                            v-model="formData.enable"
                            :val="0"
                            label="无效"
                            class="q-mr-md"
                            disable
                        />
                        <q-radio
                            v-model="formData.enable"
                            :val="1"
                            label="可用"
                            color="teal"
                            class="q-mr-md"
                        />
                        <q-radio
                            v-model="formData.enable"
                            :val="2"
                            label="禁用"
                            color="red"
                            class="q-mr-md"
                        />
                    </div>
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
                type="submit"
            >
                点击提交表单
            </q-btn>
        </q-form>
    </div>
</template>

<script>
export default {
    name: 'resourceChange',
    data: () => ({
        formData: {
            resource_id: '',
            type: '',
            parent: 0,
            menu_group: '',
            menu_icon: '',
            name: '',
            path: '',
            sort: 0,
            description: '',
            enable: 1
        },
        loginBtnLoading: false,
        addShow: true,
        tree: {
            list: [
                { name: '根目录', resource_id: 0, lazy: true }
            ]
        }
    }),
    mounted () {
        this.getInfo()
    },
    methods: {
        // 获取信息
        getInfo () {
            this.formData.type = this.$route.query.type
            if (this.$route.query.resourceId) {
                this.addShow = false
                this.$axios
                    .post('v1/auth/getResourceById', { resourceId: this.$route.query.resourceId })
                    .then(res => {
                        this.formData = res.data.data.resource
                    })
            }
        },
        // 加载树状图
        getMenu ({ node, key, done, fail }) {
            this.$axios
                .post('/v1/auth/getAllMenu', {})
                .then(res => { done(res.data.data.menu) })
        },
        // 表单验证
        submit () {
            if (!this.addShow) {
                this.$axios
                    .post('/v1/auth/updResource', this.changeForm)
                    .then(this.formComplete)
            } else {
                this.$axios
                    .post('/v1/auth/newResource.do', this.addForm)
                    .then(this.formComplete)
            }
        }
    },
    computed: {
        // 修改资源提交的內容
        changeForm () {
            return {
                resourceId: this.formData.resource_id,
                parent: parseInt(this.formData.parent),
                menuGroup: this.formData.menu_group,
                menuIcon: this.formData.menu_icon,
                name: this.formData.name,
                path: this.formData.path,
                sort: parseInt(this.formData.sort),
                description: this.formData.description,
                enable: this.formData.enable
            }
        },
        // 新增资源提交的内容
        addForm () {
            return {
                type: this.formData.type,
                parent: parseInt(this.formData.parent),
                menuGroup: this.formData.menu_group,
                menuIcon: this.formData.menu_icon,
                name: this.formData.name,
                path: this.formData.path,
                sort: parseInt(this.formData.sort),
                description: this.formData.description
            }
        }
    }
}
</script>

<style scoped>
</style>
