<template>
  <div class="info" id="app">
    <LeftNav></LeftNav>
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import LeftNav from '@/components/LeftNav'
export default {
  name: 'app',
  components: {
    LeftNav
  }
}
</script>

<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>
<!--
<template>
  <div class="info" id="app">
    &lt;!&ndash;左侧导航&ndash;&gt;
    <router-view name="aside"></router-view>
    &lt;!&ndash;机构树&ndash;&gt;
    <el-row style="float: left;width: 200px;margin-left: 15%">
      <el-tree :data="orgTree" :props="props" @node-click="handleNodeClick" ref="tree"></el-tree>
    </el-row>

    &lt;!&ndash;用户表&ndash;&gt;
    <el-row style="width: 70%;float: right">
      <el-col :span="20" :push='2'>
        <div>
          <el-form :inline="true">
            <el-form-item style="float: left" label="查询用户信息:">
              <el-input v-model="filters.username" placeholder="请输入姓名"></el-input>
              <el-select v-model="orgs" clearable placeholder="组织机构">
                <el-option
                  v-for="item in orgs"
                  :key="item.id"
                  :label="item.org_name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="getUserInfo">查询</el-button>
              <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="handleAdd">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table">
          &lt;!&ndash;列表&ndash;&gt;
          <el-table :data="tableData" highlight-current-row v-loading="loading" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="id" label="ID" width="120" sortable v-if="show">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="120" sortable>
            </el-table-column>
            <el-table-column prop="age" label="年龄" width="100" sortable>
            </el-table-column>
            <el-table-column prop="org_name" label="所属机构" width="120" sortable>
            </el-table-column>
            <el-table-column prop="create_date" label="创建时间" min-width="180" :formatter="dateFormat" sortable>
            </el-table-column>
            <el-table-column prop="modify_date" label="修改时间" min-width="180" :formatter="dateFormat2" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button type="danger" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background
                         @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="currentPage"
                         :page-sizes="[10, 50]"
                         :page-size="pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <AddUser :dialogAdd="dialogAdd" @update="getUserInfo"></AddUser>
   &lt;!&ndash; <EditUser :dialogEdit="dialogEdit" :form="editForm" @updateEdit="getUserInfo"></EditUser>&ndash;&gt;
  </div>
</template>

<script>
import AddUser from './views/AddUser.vue'
import EditUser from './views/EditUser.vue'
import {getUserList, deleteUser, getOrgs, getOrgTree, getUsersByOrgId} from './api/api'

export default {
  name: 'info',
  data () {
    return {
      filters: {
        username: ''
      },
      props: {
        label: 'org_name',
        children: 'childList'
      },
      show: false,
      orgs: [],
      orgTree: [],
      org_name: '',
      loading: false,
      tableData: [],
      pageSize: 10,
      currentPage: 0,
      total: 0,
      params: {},
      dialogEdit: {
        show: false
      },
      dialogAdd: {
        show: false
      },
      editForm: { // 编辑信息
        id: '',
        name: '',
        age: '',
        orgId: '',
        create_date: '',
        modify_date: ''
      }
    }
  },
  methods: {
    getUserInfo () {
      let para = {
        name: this.filters.username
      }
      this.loading = true
      console.log(this.filters.username)
      getUserList(para).then(result => {
        this.tableData = result.data.rows
        this.total = result.data.total
        this.loading = false
      })
    },
    getOrgList () {
      getOrgs().then(result => {
        this.orgs = result
      })
    },
    getOrgTree () { // 获取机构树
      getOrgTree().then(result => {
        this.orgTree = result.data
        console.log(result)
      })
    },
    // 点击节点方法
    handleNodeClick (data) {
      let param = {
        org_id: data.id
      }
      getUsersByOrgId(param).then(result => {
        this.tableData = result.data.rows
        this.total = result.data.total
        this.loading = false
      })
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogAdd.show = true
    },
    // 显示编辑界面
    handleEdit: function (index, row) {
      this.dialogEdit.show = true
      this.editForm = {
        id: row.id,
        name: row.name,
        age: row.age,
        orgId: row.orgId,
        create_date: row.create_date,
        modify_date: row.modify_date
      }
      console.log(this.editForm)
    },
    handleDelete (index, row) { // 删除用户信息
      let para = {
        id: row.id
      }
      deleteUser(para).then(result => {
        console.log(result)
        console.log('删除信息成功')
        this.getUserInfo() // 删除数据，更新视图
      })
    },
    dateFormat: function (row, clounm) {
      if (row.create_date != null) {
        var date = new Date(row.create_date)
        var year = date.getFullYear()
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        // 拼接
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
    },
    dateFormat2: function (row, clounm) {
      if (row.modify_date != null) {
        var date = new Date(row.modify_date)
        var year = date.getFullYear()
        var month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
        var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
        var seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        // 拼接
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.currentPage = 1
      this.getUserInfo(1, val)
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getUserInfo(val, this.pageSize)
    }
  },
  mounted () {
    this.getUserInfo()
    this.getOrgList()
    this.getOrgTree()
  },
  components: {
    AddUser,
    EditUser
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
-->
