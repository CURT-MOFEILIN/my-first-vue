<template>
  <div style="background-color: #EBEBEB;min-height:800px">
    <div style="width:100%;background-color: #409EFF; overflow: hidden">
      <span class="demonstration" style="float:left;padding-top:10px;color:white;margin-left:1%">
                首页
      </span>
      <!--<span class="demonstration" style="float:right;padding-top:10px;margin-right:1%">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" style="color:white">
            admin<i class="el-icon-caret-bottom el-icon&#45;&#45;right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>-->
    </div>

    <div style="margin-top:5px">
      <el-row :gutter="10">
        <el-col :xs="4" :sm="4" :md="4" :lg="4">
          <div>
            <el-menu default-active="1" class="el-menu-vertical-demo" style="min-height:800px" @select="handleSelect">
              <el-menu-item index="1"><i class="el-icon-message"></i>首页</el-menu-item>
              <el-menu-item index="2"><i class="el-icon-menu"></i>设置</el-menu-item>
            </el-menu>
          </div>
        </el-col>
        <el-col :xs="20" :sm="20" :md="20" :lg="20">
          <!--<div>
            <div style="border: 1px solid #A6A6A6; border-radius:6px; padding:5px; margin:2px; background-color: white">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="item in breadcrumbItems">{{item}}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>
          </div>-->

          <div style="margin-top:10px">
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
export default {
  data () {
    return {
      searchCriteria: '',
      breadcrumbItems: ['首页']
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      switch (key) {
        case '1':
          this.$router.push('/index')
          this.breadcrumbItems = ['首页']
          break
        case '2':
          this.$router.push('/sysSet')
          this.breadcrumbItems = ['设置']
          break
      }
    }
  }
}
</script>
