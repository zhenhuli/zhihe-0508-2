<template>
  <div class="table-page">
    <div class="page-header">
      <h1 class="page-title">数据表格</h1>
    </div>

    <el-card class="search-card" shadow="never">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card" shadow="never">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd">
          <i class="el-icon-plus"></i> 新增
        </el-button>
        <el-button type="danger" @click="handleBatchDelete">
          <i class="el-icon-delete"></i> 批量删除
        </el-button>
      </div>

      <el-table
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="ID" width="80" sortable></el-table-column>
        <el-table-column prop="username" label="用户名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="130"></el-table-column>
        <el-table-column prop="role" label="角色" width="100">
          <template slot-scope="scope">
            <el-tag :type="scope.row.role === '管理员' ? 'danger' : 'primary'">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="mini" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Table',
  data() {
    return {
      searchForm: {
        username: '',
        email: '',
        status: ''
      },
      tableData: [],
      selectedRows: [],
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 50
      }
    }
  },
  created() {
    this.loadTableData()
  },
  methods: {
    loadTableData() {
      this.tableData = [
        { id: 1, username: '张三', email: 'zhangsan@example.com', phone: '13800138001', role: '管理员', status: true, createTime: '2024-01-01 10:00:00' },
        { id: 2, username: '李四', email: 'lisi@example.com', phone: '13800138002', role: '普通用户', status: true, createTime: '2024-01-02 11:00:00' },
        { id: 3, username: '王五', email: 'wangwu@example.com', phone: '13800138003', role: '普通用户', status: false, createTime: '2024-01-03 12:00:00' },
        { id: 4, username: '赵六', email: 'zhaoliu@example.com', phone: '13800138004', role: '普通用户', status: true, createTime: '2024-01-04 13:00:00' },
        { id: 5, username: '钱七', email: 'qianqi@example.com', phone: '13800138005', role: '管理员', status: true, createTime: '2024-01-05 14:00:00' },
        { id: 6, username: '孙八', email: 'sunba@example.com', phone: '13800138006', role: '普通用户', status: false, createTime: '2024-01-06 15:00:00' },
        { id: 7, username: '周九', email: 'zhoujiu@example.com', phone: '13800138007', role: '普通用户', status: true, createTime: '2024-01-07 16:00:00' },
        { id: 8, username: '吴十', email: 'wushi@example.com', phone: '13800138008', role: '普通用户', status: true, createTime: '2024-01-08 17:00:00' },
        { id: 9, username: '郑十一', email: 'zheng11@example.com', phone: '13800138009', role: '管理员', status: true, createTime: '2024-01-09 18:00:00' },
        { id: 10, username: '王十二', email: 'wang12@example.com', phone: '13800138010', role: '普通用户', status: true, createTime: '2024-01-10 19:00:00' }
      ]
    },
    handleSearch() {
      this.$message.success('搜索成功')
    },
    handleReset() {
      this.searchForm = {
        username: '',
        email: '',
        status: ''
      }
    },
    handleAdd() {
      this.$message.success('点击新增按钮')
    },
    handleBatchDelete() {
      if (this.selectedRows.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      this.$confirm(`确定要删除选中的 ${this.selectedRows.length} 条数据吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      })
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },
    handleStatusChange(row) {
      this.$message.success(`状态已${row.status ? '启用' : '禁用'}`)
    },
    handleEdit(row) {
      this.$message.success(`编辑用户：${row.username}`)
    },
    handleDelete(row) {
      this.$confirm(`确定要删除用户 ${row.username} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message.success('删除成功')
      })
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page
    }
  }
}
</script>

<style scoped lang="scss">
.table-page {
  .search-card {
    margin-bottom: 20px;

    .search-form {
      margin-bottom: 0;
    }
  }

  .table-card {
    .table-header {
      margin-bottom: 15px;
    }

    .pagination {
      margin-top: 20px;
      text-align: right;
    }
  }
}
</style>
