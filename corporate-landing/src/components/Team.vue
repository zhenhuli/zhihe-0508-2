<template>
  <section id="team" class="team section">
    <div class="container">
      <h2 class="section-title fade-in">我们的团队</h2>
      <p class="section-subtitle fade-in">
        汇聚行业精英，用专业和热情为您创造价值
      </p>
      
      <div class="team-grid">
        <div 
          v-for="(member, index) in teamMembers" 
          :key="member.id"
          class="team-member fade-in"
          :style="{ transitionDelay: `${index * 0.1}s` }"
        >
          <div class="member-avatar">
            <span class="avatar-emoji">{{ member.avatar }}</span>
          </div>
          <h3 class="member-name">{{ member.name }}</h3>
          <p class="member-title">{{ member.title }}</p>
          <p class="member-bio">{{ member.bio }}</p>
          <div class="member-social">
            <a v-for="social in member.socials" :key="social" href="#" class="social-link">
              {{ social }}
            </a>
          </div>
        </div>
      </div>

      <div class="team-stats fade-in">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <span class="stat-icon">{{ stat.icon }}</span>
          <span class="stat-number">{{ stat.number }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const teamMembers = [
  {
    id: 1,
    avatar: '👨‍💼',
    name: '张明远',
    title: '创始人 & CEO',
    bio: '拥有15年企业服务经验，曾任多家科技公司高管，专注数字化转型战略规划',
    socials: ['🔗', '🐦']
  },
  {
    id: 2,
    avatar: '👩‍💻',
    name: '李思琪',
    title: '技术总监',
    bio: '前大厂技术专家，精通云计算和AI技术，带领团队完成多个大型项目交付',
    socials: ['🔗', '🐙']
  },
  {
    id: 3,
    avatar: '👨‍🎨',
    name: '王浩然',
    title: '产品总监',
    bio: '10年产品设计经验，用户体验专家，擅长将复杂业务转化为简洁产品',
    socials: ['🔗', '🎨']
  },
  {
    id: 4,
    avatar: '👩‍🔬',
    name: '陈雨婷',
    title: '研发负责人',
    bio: '计算机博士，专注人工智能和大数据研究，发表多篇顶级会议论文',
    socials: ['🔗', '📚']
  }
]

const stats = [
  { icon: '👥', number: '200+', label: '团队成员' },
  { icon: '🌍', number: '15+', label: '服务城市' },
  { icon: '🏆', number: '50+', label: '行业奖项' },
  { icon: '💡', number: '100+', label: '技术专利' }
]
</script>

<style scoped lang="scss">
.team {
  background: linear-gradient(180deg, white 0%, #f0f9ff 100%);

  &-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: $spacing-xl;
    margin-top: $spacing-2xl;
  }

  &-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: $spacing-lg;
    margin-top: $spacing-3xl;
  }
}

.team-member {
  background: white;
  border-radius: $border-radius-xl;
  padding: $spacing-2xl;
  text-align: center;
  box-shadow: $shadow-md;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-xl;

    .member-avatar {
      transform: scale(1.1);
    }
  }

  .member-avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto $spacing-lg;
    border-radius: 50%;
    background: linear-gradient(135deg, $primary-color 0%, $accent-color 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    transition: transform $transition-normal;
  }

  .member-name {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $text-dark;
    margin-bottom: $spacing-xs;
  }

  .member-title {
    color: $primary-color;
    font-size: $font-size-sm;
    font-weight: 500;
    margin-bottom: $spacing-md;
  }

  .member-bio {
    color: $text-light;
    font-size: $font-size-sm;
    line-height: 1.6;
    margin-bottom: $spacing-lg;
  }

  .member-social {
    display: flex;
    justify-content: center;
    gap: $spacing-md;

    .social-link {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: $bg-light;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all $transition-normal;

      &:hover {
        background: $primary-color;
        transform: translateY(-2px);
      }
    }
  }
}

.stat-card {
  background: white;
  padding: $spacing-xl;
  border-radius: $border-radius-lg;
  text-align: center;
  box-shadow: $shadow-sm;
  transition: all $transition-normal;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
  }

  .stat-icon {
    font-size: 32px;
    margin-bottom: $spacing-md;
  }

  .stat-number {
    display: block;
    font-size: $font-size-3xl;
    font-weight: 700;
    color: $primary-color;
    margin-bottom: $spacing-xs;
  }

  .stat-label {
    color: $text-light;
    font-size: $font-size-sm;
  }
}

@media (max-width: $breakpoint-md) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-lg;
  }

  .team-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: $spacing-md;
  }

  .team-member {
    padding: $spacing-xl;

    .member-avatar {
      width: 80px;
      height: 80px;
      font-size: 36px;
    }

    .member-name {
      font-size: $font-size-lg;
    }
  }

  .stat-card {
    padding: $spacing-lg;

    .stat-icon {
      font-size: 24px;
    }

    .stat-number {
      font-size: $font-size-2xl;
    }
  }
}

@media (max-width: 480px) {
  .team-grid,
  .team-stats {
    grid-template-columns: 1fr;
  }

  .team-member {
    padding: $spacing-lg;

    .member-avatar {
      width: 64px;
      height: 64px;
      font-size: 28px;
      margin-bottom: $spacing-md;
    }

    .member-bio {
      font-size: $font-size-xs;
    }

    .member-social {
      .social-link {
        width: 30px;
        height: 30px;
        font-size: 14px;
      }
    }
  }
}
</style>
