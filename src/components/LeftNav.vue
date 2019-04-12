<template>
  <div>
    <div style="width:100%;background-color: #409EFF; overflow: hidden;height: 40px;">
      <span class="demonstration" style="float:left;padding-top:10px;color:white;margin-left:1%">
                首页
      </span>
      <span class="demonstration" style="float:right;padding-top:10px;margin-right:1%">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link" style="color:white">
            admin<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
    </div>
    <div style="background-color: #EBEBEB;height:100%;width: 10%;float: left">
      <div style="margin-top:5px">
        <el-row :gutter="10">
          <el-col >
            <div>
              <el-menu default-active="1" class="el-menu-vertical-demo" style="height:100%" @select="handleSelect">
                <el-menu-item index="1"><i class="el-icon-message"></i>首页</el-menu-item>
                <el-menu-item index="2"><i class="el-icon-menu"></i>设置</el-menu-item>
                <el-menu-item index="3"><i class="el-icon-menu"></i>机构</el-menu-item>
              </el-menu>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    handleSelect (key) {
      switch (key) {
        case '1':
          this.$router.push('/index')
          break
        case '2':
          this.$router.push('/sysSet')
          break
        case '3':
          this.$router.push('/orgTree')
          break
      }
    }
  }
}
</script>
