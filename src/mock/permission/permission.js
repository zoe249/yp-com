// 导入mockjs 使用数据
// import Mock from 'mockjs'
export default {
  getPermissionById: () => {
    return {
      code: 2000,
      data: {
        parentId: '0',
        name: 'CRM后台管理应用',
        url: 'crm',
        key: 'crm',
        displayOrder: '1',
        logo: 'iconfont icon-icon-test',
        description: 'CRM后台管理应用',
        type: '1'
      }
    }
  },
  getpermissionlist: () => {
    return {
      code: 2000,
      data: {
        data: [
          {
            // 应用
            id: '01',
            parentId: '0',
            name: 'CRM后台管理',
            displayOrder: 1,
            description: 'CRM后台管理系统应用描述',
            logo: 'el-icon-circle-plus',
            permissionKey: 'app',
            type: '1',
            url: 'app',
            permissions: [
              {
                id: '0102',
                parentId: '01',
                name: '用户权限',
                displayOrder: 2,
                description: '用户权限管理',
                logo: 'el-icon-upload',
                permissionKey: 'userpermission',
                type: '2',
                url: 'userpermission',
                permissions: [
                  {
                    // 二级菜单
                    id: '010201',
                    parentId: '0102',
                    name: '菜单管理',
                    displayOrder: 1,
                    description: '菜单管理',
                    logo: 'el-icon-upload',
                    permissionKey: 'permission',
                    type: '2',
                    url: 'permission',
                    permissions: [
                      {
                        // 按钮
                        id: '01020101',
                        parentId: '010201',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010202',
                    parentId: '0102',
                    name: '角色管理',
                    displayOrder: 1,
                    description: '角色管理描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'role',
                    type: '2',
                    url: 'role',
                    permissions: [
                      {
                        // 按钮
                        id: '01020201',
                        parentId: '010201',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010203',
                    parentId: '0102',
                    name: '用户管理',
                    displayOrder: 1,
                    description: '用户管理描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'user',
                    type: '2',
                    url: 'user',
                    permissions: [
                      {
                        // 按钮
                        id: '01020301',
                        parentId: '010201',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010204',
                    parentId: '0102',
                    name: '数据权限',
                    displayOrder: 1,
                    description: '数据权限描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'dataPermission',
                    type: '2',
                    url: 'dataPermission',
                    permissions: [
                      {
                        // 按钮
                        id: '01020401',
                        parentId: '010201',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010205',
                    parentId: '0102',
                    name: '会员列表',
                    displayOrder: 1,
                    description: '会员列表描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'memberList',
                    type: '2',
                    url: 'memberList',
                    permissions: [
                      {
                        // 按钮
                        id: '01020501',
                        parentId: '010205',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  }
                ]
              },
              {
                // 一级菜单
                id: '0103',
                parentId: '01',
                name: '组织渠道',
                displayOrder: 1,
                description: '组织渠道',
                logo: 'el-icon-star-on',
                permissionKey: 'organizationChannel',
                type: '2',
                url: 'organizationChannel',
                permissions: [
                  {
                    // 二级菜单
                    id: '010301',
                    parentId: '0103',
                    name: '组织类型',
                    displayOrder: 1,
                    description: '组织类型描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'organizationType',
                    type: '2',
                    url: 'organizationType',
                    permissions: [
                      {
                        // 按钮
                        id: '01030101',
                        parentId: '010301',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010302',
                    parentId: '0103',
                    name: '组织关系',
                    displayOrder: 1,
                    description: '组织关系描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'organizationRelation',
                    type: '2',
                    url: 'organizationRelation',
                    permissions: [
                      {
                        // 按钮
                        id: '01030201',
                        parentId: '010301',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010303',
                    parentId: '0103',
                    name: '组织管理',
                    displayOrder: 1,
                    description: '组织管理描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'organizationManagement',
                    type: '2',
                    url: 'organizationManagement',
                    permissions: [
                      {
                        // 按钮
                        id: '01030301',
                        parentId: '010301',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010304',
                    parentId: '0103',
                    name: '渠道配置',
                    displayOrder: 1,
                    description: '渠道配置描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'channel',
                    type: '2',
                    url: 'channel',
                    permissions: [
                      {
                        // 按钮
                        id: '01030401',
                        parentId: '010301',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010305',
                    parentId: '0103',
                    name: '终端配置',
                    displayOrder: 1,
                    description: '终端配置描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'terminal',
                    type: '2',
                    url: 'terminal',
                    permissions: [
                      {
                        // 按钮
                        id: '01030501',
                        parentId: '010301',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010306',
                    parentId: '0103',
                    name: '渠道终端',
                    displayOrder: 1,
                    description: '渠道终端描述',
                    logo: 'el-icon-upload',
                    permissionKey: 'channelTerminal',
                    type: '2',
                    url: 'channelTerminal',
                    permissions: [
                      {
                        // 按钮
                        id: '01030601',
                        parentId: '010301',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  }
                ]
              },
              {
                // 一级菜单
                id: '0104',
                parentId: '01',
                name: '会员管理',
                displayOrder: 1,
                description: '会员管理',
                logo: 'el-icon-star-on',
                permissionKey: 'memberManagement',
                type: '2',
                url: 'memberManagement',
                permissions: [
                  {
                    // 二级菜单
                    id: '010401',
                    parentId: '0101',
                    name: '编号规则',
                    displayOrder: 1,
                    description: '编号规则',
                    logo: 'el-icon-upload',
                    permissionKey: 'numberingRules',
                    type: '2',
                    url: 'numberingRules',
                    permissions: [
                      {
                        // 按钮
                        id: '01040101',
                        parentId: '010201',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010402',
                    parentId: '0102',
                    name: '会员标签',
                    displayOrder: 1,
                    description: '会员标签',
                    logo: 'el-icon-upload',
                    permissionKey: 'memberLabel',
                    type: '2',
                    url: 'memberLabel',
                    permissions: [
                      {
                        // 按钮
                        id: '01040102',
                        parentId: '010201',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  },
                  {
                    // 二级菜单
                    id: '010403',
                    parentId: '0103',
                    name: '会员筛选器',
                    displayOrder: 1,
                    description: '会员筛选器',
                    logo: 'el-icon-upload',
                    permissionKey: 'membershipFilter',
                    type: '2',
                    url: 'membershipFilter',
                    permissions: [
                      {
                        // 按钮
                        id: '01040103',
                        parentId: '010201',
                        name: '添加按钮',
                        displayOrder: 1,
                        description: '添加按钮',
                        logo: 'el-icon-upload',
                        permissionKey: 'add',
                        type: '3',
                        url: 'add'
                      }
                    ]
                  }
                ]
              }
            ]
          }
          // {
          //   // 按钮
          //   id: '02',
          //   parentId: '0',
          //   name: '测试应用数据',
          //   displayOrder: 2,
          //   description: '测试应用',
          //   logo: 'el-icon-upload',
          //   permissionKey: 'app2',
          //   type: '1',
          //   url: 'app2'
          // }
        ]
      }
    }
  }
}
