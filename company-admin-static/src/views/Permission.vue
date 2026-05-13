<template>
  <div class="permission-page">
    <div class="page-header">
      <h1 class="page-title">权限管理</h1>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="role-card" shadow="never">
          <div slot="header" class="card-header">
            <span>角色列表</span>
            <el-button type="primary" size="mini" @click="showAddRoleDialog">
              <i class="el-icon-plus"></i> 新增
            </el-button>
          </div>
          <div class="role-list">
            <div
              v-for="role in roleList"
              :key="role.id"
              class="role-item"
              :class="{ active: currentRoleId === role.id }"
              @click="selectRole(role)"
            >
              <div class="role-icon" :style="{ backgroundColor: role.color }">
                <i :class="role.icon"></i>
              </div>
              <div class="role-info">
                <div class="role-name">{{ role.name }}</div>
                <div class="role-desc">{{ role.description }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="16">
        <el-card class="permission-card" shadow="never">
          <div slot="header" class="card-header">
            <span>权限配置</span>
            <span v-if="currentRole" class="current-role">
              当前角色：<el-tag size="small">{{ currentRole.name }}</el-tag>
            </span>
          </div>

          <div v-if="currentRole" class="permission-content">
            <el-tree
              ref="permissionTree"
              :data="permissionTreeData"
              :props="treeProps"
              show-checkbox
              node-key="id"
              :default-checked-keys="currentRole.permissions"
              class="permission-tree"
            ></el-tree>

            <div class="permission-actions">
              <el-button type="primary" @click="savePermissions">
                保存权限配置
              </el-button>
              <el-button @click="resetPermissions">
                重置
              </el-button>
            </div>
          </div>

          <div v-else class="empty-tip">
            <i class="el-icon-warning-outline"></i>
            <p>请从左侧选择一个角色进行权限配置</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="新增角色" :visible.sync="addRoleDialogVisible" width="500px">
      <el-form :model="newRoleForm" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="newRoleForm.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="newRoleForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="角色标识">
          <el-input v-model="newRoleForm.code" placeholder="请输入角色标识"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Permission',
  data() {
    return {
      roleList: [
        {
          id: 1,
          name: '超级管理员',
          description: '拥有系统所有权限',
          icon: 'el-icon-s-custom',
          color: '#F56C6C',
          code: 'super_admin',
          permissions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        },
        {
          id: 2,
          name: '系统管理员',
          description: '管理系统配置和用户',
          icon: 'el-icon-setting',
          color: '#409EFF',
          code: 'admin',
          permissions: [1, 2, 3, 4, 5, 6, 7, 8]
        },
        {
          id: 3,
          name: '普通用户',
          description: '基础功能访问权限',
          icon: 'el-icon-user',
          color: '#67C23A',
          code: 'user',
          permissions: [1, 2, 5]
        },
        {
          id: 4,
          name: '访客',
          description: '只读权限',
          icon: 'el-icon-view',
          color: '#909399',
          code: 'guest',
          permissions: [1]
        }
      ],
      currentRoleId: null,
      permissionTreeData: [
        {
          id: 1,
          label: '仪表盘',
          children: [
            { id: 2, label: '查看统计' },
            { id: 3, label: '导出报表' }
          ]
        },
        {
          id: 4,
          label: '用户管理',
          children: [
            { id: 5, label: '查看用户' },
            { id: 6, label: '新增用户' },
            { id: 7, label: '编辑用户' },
            { id: 8, label: '删除用户' }
          ]
        },
        {
          id: 9,
          label: '系统设置',
          children: [
            { id: 10, label: '基础设置' },
            { id: 11, label: '安全设置' },
            { id: 12, label: '日志管理' }
          ]
        }
      ],
      treeProps: {
        children: 'children',
        label: 'label'
      },
      addRoleDialogVisible: false,
      newRoleForm: {
        name: '',
        description: '',
        code: ''
      }
    }
  },
  computed: {
    currentRole() {
      return this.roleList.find(role => role.id === this.currentRoleId)
    }
  },
  methods: {
    selectRole(role) {
      this.currentRoleId = role.id
    },
    showAddRoleDialog() {
      this.addRoleDialogVisible = true
      this.newRoleForm = {
        name: '',
        description: '',
        code: ''
      }
    },
    addRole() {
      if (!this.newRoleForm.name || !this.newRoleForm.code) {
        this.$message.warning('请填写完整信息')
        return
      }
      const newRole = {
        id: Date.now(),
        name: this.newRoleForm.name,
        description: this.newRoleForm.description,
        icon: 'el-icon-user',
        color: '#E6A23C',
        code: this.newRoleForm.code,
        permissions: []
      }
      this.roleList.push(newRole)
      this.addRoleDialogVisible = false
      this.$message.success('角色添加成功')
    },
    savePermissions() {
      const checkedKeys = this.$refs.permissionTree.getCheckedKeys()
      const halfCheckedKeys = this.$refs.permissionTree.getHalfCheckedKeys()
      const allPermissions = [...checkedKeys, ...halfCheckedKeys]
      
      if (this.currentRole) {
        this.currentRole.permissions = allPermissions
        this.$message.success('权限配置保存成功')
      }
    },
    resetPermissions() {
      if (this.currentRole && this.$refs.permissionTree) {
        this.$refs.permissionTree.setCheckedKeys(this.currentRole.permissions)
        this.$message.info('权限已重置')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.permission-page {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .current-role {
      font-size: 14px;
      color: #606266;
    }
  }

  .role-card {
    .role-list {
      .role-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-bottom: 8px;

        &:hover {
          background-color: #f5f7fa;
        }

        &.active {
          background-color: #ecf5ff;
        }

        .role-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          i {
            font-size: 24px;
            color: #fff;
          }
        }

        .role-info {
          .role-name {
            font-size: 14px;
            font-weight: 500;
            color: #303133;
            margin-bottom: 4px;
          }

          .role-desc {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }

  .permission-card {
    .permission-content {
      .permission-tree {
        min-height: 300px;
      }

      .permission-actions {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #ebeef5;
      }
    }

    .empty-tip {
      text-align: center;
      padding: 80px 0;
      color: #909399;

      i {
        font-size: 48px;
        margin-bottom: 16px;
      }

      p {
        font-size: 14px;
      }
    }
  }
}
</style>
