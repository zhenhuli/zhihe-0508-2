<template>
  <div class="dashboard">
    <div class="page-header">
      <h1 class="page-title">仪表盘</h1>
    </div>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="6" v-for="(card, index) in statsCards" :key="index">
        <el-card class="stat-card" shadow="hover">
          <div class="card-content">
            <div class="card-icon" :style="{ backgroundColor: card.color }">
              <i :class="card.icon"></i>
            </div>
            <div class="card-info">
              <div class="card-value">{{ card.value }}</div>
              <div class="card-label">{{ card.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <span>访问趋势</span>
          </div>
          <div class="chart-placeholder">
            <el-table :data="trendData" border style="width: 100%">
              <el-table-column prop="date" label="日期" width="120"></el-table-column>
              <el-table-column prop="pv" label="访问量"></el-table-column>
              <el-table-column prop="uv" label="用户数"></el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card" shadow="hover">
          <div slot="header" class="card-header">
            <span>最新动态</span>
          </div>
          <div class="activity-list">
            <div class="activity-item" v-for="(item, index) in activities" :key="index">
              <div class="activity-icon" :style="{ backgroundColor: item.color }">
                <i :class="item.icon"></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ item.title }}</div>
                <div class="activity-time">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      statsCards: [
        { label: '用户总数', value: '12,580', icon: 'el-icon-user', color: '#409EFF' },
        { label: '订单数量', value: '8,846', icon: 'el-icon-s-order', color: '#67C23A' },
        { label: '销售额', value: '¥568,920', icon: 'el-icon-s-finance', color: '#E6A23C' },
        { label: '访问量', value: '256,890', icon: 'el-icon-s-data', color: '#F56C6C' }
      ],
      trendData: [
        { date: '2024-01-01', pv: 1250, uv: 380 },
        { date: '2024-01-02', pv: 1580, uv: 420 },
        { date: '2024-01-03', pv: 1320, uv: 390 },
        { date: '2024-01-04', pv: 1680, uv: 450 },
        { date: '2024-01-05', pv: 1420, uv: 410 }
      ],
      activities: [
        { title: '新用户注册：张三', time: '10分钟前', icon: 'el-icon-user', color: '#409EFF' },
        { title: '订单完成：订单号 #20240105001', time: '30分钟前', icon: 'el-icon-s-check', color: '#67C23A' },
        { title: '系统更新完成', time: '1小时前', icon: 'el-icon-setting', color: '#E6A23C' },
        { title: '库存预警：商品A库存不足', time: '2小时前', icon: 'el-icon-warning', color: '#F56C6C' }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.dashboard {
  .stats-row {
    margin-bottom: 20px;
  }

  .stat-card {
    .card-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 28px;
        color: #fff;
      }
    }

    .card-info {
      .card-value {
        font-size: 24px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 5px;
      }

      .card-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .charts-row {
    .chart-card {
      .card-header {
        font-weight: 500;
      }

      .chart-placeholder {
        height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .activity-list {
        .activity-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .activity-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;

            i {
              color: #fff;
              font-size: 16px;
            }
          }

          .activity-content {
            .activity-title {
              font-size: 14px;
              color: #303133;
              margin-bottom: 3px;
            }

            .activity-time {
              font-size: 12px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}
</style>
