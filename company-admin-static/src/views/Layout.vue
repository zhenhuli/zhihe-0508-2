<template>
  <el-container class="layout-container">
    <el-aside width="200px" class="sidebar">
      <div class="logo">
        <h2>企业管理系统</h2>
      </div>
      <el-menu
        default-active="1"
        class="el-menu-vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        :router="true"
      >
        <el-menu-item index="/dashboard">
          <i class="el-icon-s-platform"></i>
          <span slot="title">仪表盘</span>
        </el-menu-item>
        <el-menu-item index="/table">
          <i class="el-icon-s-grid"></i>
          <span slot="title">数据表格</span>
        </el-menu-item>
        <el-menu-item index="/form">
          <i class="el-icon-edit"></i>
          <span slot="title">表单页面</span>
        </el-menu-item>
        <el-menu-item index="/permission">
          <i class="el-icon-lock"></i>
          <span slot="title">权限管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <span class="breadcrumb-text">首页 / {{ currentPageTitle }}</span>
        </div>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <i class="el-icon-user-solid"></i>
              管理员
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Layout',
  computed: {
    currentPageTitle() {
      return this.$route.meta.title || '仪表盘'
    }
  }
}
</script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
}

.sidebar {
  background-color: #304156;
  height: 100%;
  overflow: hidden;

  .logo {
    height: 60px;
    line-height: 60px;
    text-align: center;
    background-color: #263445;

    h2 {
      color: #fff;
      font-size: 16px;
      font-weight: 500;
    }
  }

  .el-menu-vertical {
    border-right: none;
  }
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;

  .header-left {
    .breadcrumb-text {
      color: #606266;
      font-size: 14px;
    }
  }

  .header-right {
    .user-info {
      cursor: pointer;
      color: #606266;
      display: flex;
      align-items: center;
      gap: 5px;
    }
  }
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
