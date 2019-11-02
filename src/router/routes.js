
const routes = [
    { path: '/login', component: () => import('pages/login') },
    {
        path: '/',
        component: () => import('layouts/main'),
        'children': [
            // 首页
            { path: '', component: () => import('pages/main/Index') },
            // 测试
            { path: 'demo', component: () => import('pages/demo') },
            // 平台
            {
                path: 'plat',
                component: () => import('pages/main/plat'),
                children: [
                    // 售票渠道
                    {
                        path: 'agent',
                        component: () => import('pages/main/plat/agent'),
                        children: [
                            // 直连渠道
                            {
                                path: 'directly',
                                component: () => import('pages/main/plat/agent/directly'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/agent/directly/agent') },
                                    { path: 'agentInfo', component: () => import('pages/main/plat/agent/directly/agentInfo') },
                                    { path: 'editAgent', component: () => import('pages/main/plat/agent/directly/editAgent') },
                                    { path: 'editConfig', component: () => import('pages/main/plat/agent/directly/editConfig') }
                                ]
                            },
                            // 外链管理
                            {
                                path: 'outside',
                                component: () => import('pages/main/plat/agent/outside'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/agent/outside/outside') }
                                ]
                            },
                            // 第三方售票渠道
                            {
                                path: 'third',
                                component: () => import('pages/main/plat/agent/third'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/agent/third/third') }
                                ]
                            },
                            // 销售管理
                            {
                                path: 'sell',
                                component: () => import('pages/main/plat/agent/sell'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/agent/sell/sell') }
                                ]
                            }
                        ]
                    },
                    // 项目管理
                    {
                        path: 'project',
                        component: () => import('pages/main/plat/project'),
                        children: [
                            // 营销活动
                            {
                                path: 'activity',
                                component: () => import('pages/main/plat/project/activity'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/project/activity/activity') },
                                    { path: 'proInfo', component: () => import('pages/main/plat/project/activity/proInfo') },
                                    { path: 'editPro', component: () => import('pages/main/plat/project/activity/editPro') }
                                ]
                            },
                            // 电子票项目
                            {
                                path: 'eTicket',
                                component: () => import('pages/main/plat/project/eTicket'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/project/eTicket/pro') },
                                    { path: 'proInfo', component: () => import('pages/main/plat/project/eTicket/proInfo') },
                                    { path: 'editPro', component: () => import('pages/main/plat/project/eTicket/editPro') },
                                    { path: 'ticket', component: () => import('pages/main/plat/project/eTicket/ticket') },
                                    { path: 'editTicket', component: () => import('pages/main/plat/project/eTicket/editTicket') },
                                    { path: 'produce', component: () => import('pages/main/plat/project/eTicket/produce') }
                                ]
                            },
                            // 售票服务
                            {
                                path: 'sell',
                                component: () => import('pages/main/plat/project/sell'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/project/sell/pro') },
                                    { path: 'proInfo', component: () => import('pages/main/plat/project/sell/proInfo') },
                                    { path: 'editPro', component: () => import('pages/main/plat/project/sell/editPro') },
                                    { path: 'ticket', component: () => import('pages/main/plat/project/sell/ticket') },
                                    { path: 'editTicket', component: () => import('pages/main/plat/project/sell/editTicket') },
                                    { path: 'editStock', component: () => import('pages/main/plat/project/sell/editStock') }
                                ]
                            },
                            // 门禁验票
                            {
                                path: 'test',
                                component: () => import('pages/main/plat/project/test'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/project/test/pro') },
                                    { path: 'proInfo', component: () => import('pages/main/plat/project/test/proInfo') },
                                    { path: 'editPro', component: () => import('pages/main/plat/project/test/editPro') }
                                ]
                            },
                            // 选位服务
                            {
                                path: 'choose',
                                component: () => import('pages/main/plat/project/choose'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/project/choose/choose') }
                                ]
                            }
                        ]
                    },
                    // 内容管理
                    {
                        path: 'content',
                        component: () => import('pages/main/plat/content'),
                        children: [
                            { path: '', component: () => import('pages/main/plat/content/columns') },
                            { path: 'articles', component: () => import('pages/main/plat/content/articles') },
                            { path: 'editArticle', component: () => import('pages/main/plat/content/editArticle') },
                            { path: 'editColumn', component: () => import('pages/main/plat/content/editColumn') }
                        ]
                    },
                    // 公司管理
                    {
                        path: 'company',
                        component: () => import('pages/main/plat/company'),
                        children: [
                            { path: '', component: () => import('pages/main/plat/company/company') },
                            { path: 'editCompany', component: () => import('pages/main/plat/company/editCompany') },
                            { path: 'companyOp', component: () => import('pages/main/plat/company/companyOp') }
                        ]
                    },
                    // 系统管理
                    {
                        path: 'system',
                        component: () => import('pages/main/plat/system'),
                        children: [
                            {
                                path: 'base',
                                component: () => import('pages/main/plat/system/base'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/system/base/base') },
                                    // 资源管理
                                    {
                                        path: 'res',
                                        component: () => import('pages/main/plat/system/base/res'),
                                        children: [
                                            { path: '', component: () => import('pages/main/plat/system/base/res/res') },
                                            { path: 'editRes', component: () => import('pages/main/plat/system/base/res/editRes') }
                                        ]
                                    },
                                    // 场地管理
                                    {
                                        path: 'venues',
                                        component: () => import('pages/main/plat/system/base/venues'),
                                        children: [
                                            { path: '', component: () => import('pages/main/plat/system/base/venues/venues') },
                                            { path: 'editVenues', component: () => import('pages/main/plat/system/base/venues/editVenues') }
                                        ]
                                    }
                                ]
                            },
                            // 操作员
                            {
                                path: 'op',
                                component: () => import('pages/main/plat/system/op'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/system/op/op') },
                                    { path: 'editOp', component: () => import('pages/main/plat/system/op/editOp') }
                                ]
                            },
                            // 角色
                            {
                                path: 'role',
                                component: () => import('pages/main/plat/system/role'),
                                children: [
                                    { path: '', component: () => import('pages/main/plat/system/role/role') },
                                    { path: 'editRole', component: () => import('pages/main/plat/system/role/editRole') },
                                    { path: 'opSelect', component: () => import('pages/main/plat/system/role/opSelect') },
                                    { path: 'roleAdmin', component: () => import('pages/main/plat/system/role/roleAdmin') },
                                    { path: 'roleMenu', component: () => import('pages/main/plat/system/role/roleMenu') },
                                    { path: 'roleOp', component: () => import('pages/main/plat/system/role/roleOp') },
                                    { path: 'rolePower', component: () => import('pages/main/plat/system/role/rolePower') },
                                    { path: 'roleUrl', component: () => import('pages/main/plat/system/role/roleUrl') }
                                ]
                            }
                        ]
                    }
                ]
            },
            // 主办方
            {
                path: 'host',
                component: () => import('pages/main/host'),
                children: [
                    // 渠道管理
                    { path: 'agent', component: () => import('pages/main/host/agent/agent') },
                    { path: 'editAgent', component: () => import('pages/main/host/agent/editAgent') }
                ]
            }
        ]
    },
    // 账户中心
    {
        path: '/account',
        component: () => import('layouts/account'),
        children: [
            { path: '', component: () => import('pages/account/shezhi/shezhi') },
            // 账户设置
            { path: 'shezhi', name: 'shezhi', component: () => import('pages/account/shezhi/shezhi') },
            { path: 'changeInfo', name: 'changeInfo', component: () => import('pages/account/shezhi/changeInfo') },
            { path: 'password', name: 'password', component: () => import('pages/account/password/password') },
            { path: 'message', name: 'message', component: () => import('pages/account/message/message') }
        ]
    }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404')
    })
}

export default routes
