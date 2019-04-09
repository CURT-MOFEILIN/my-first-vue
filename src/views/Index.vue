<template>
  <div class="info" id="app">
    <!--左侧导航-->
    <!--机构树-->
    <el-row style="float: left;width: 180px">
      <el-tree :data="orgTree" :props="props" @node-click="handleNodeClick" ref="tree"></el-tree>
    </el-row>

    <!--用户表-->
    <el-row style="width: 88%;float: right">
      <el-col :span="20" :push='2'>
        <div>
          <el-form :inline="true">
            <el-form-item style="float: left" label="查询用户信息:">
              <el-input v-model="filters.username" clearable placeholder="请输入姓名" style="width: 180px"></el-input>
              <!--<el-select v-model="orgs" clearable placeholder="组织机构" style="width: 180px">
                <el-option
                  v-for="item in orgs"
                  :key="item.id"
                  :label="item.org_name"
                  :value="item.id">
                </el-option>
              </el-select>-->
            </el-form-item>
            <el-form-item style="float: right">
              <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="getUserInfo()">查询</el-button>
              <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="handleAdd">添加</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table">
          <!--列表-->
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
                         :current-page="pageNumber"
                         :page-sizes="[10, 50]"
                         :page-size="pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <AddUser :dialogAdd="dialogAdd" @update="getUserInfo"></AddUser>
    <EditUser :dialogEdit="dialogEdit" :edit-form="editForm" @updateEdit="getUserInfo"></EditUser>
  </div>
</template>

<script>
import AddUser from './AddUser.vue'
import EditUser from './EditUser.vue'
import dateUtil from '@/utils/dateUtil'
import {getUserList, deleteUser, getOrgTree} from '@/api/api'

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
      orgTree: [],
      org_name: '',
      loading: false,
      tableData: [],
      pageSize: 10,
      pageNumber: 1,
      org_id: 0,
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
    getUserInfo (pageNumber, pageSize) {
      let para
      if (pageNumber) {
        para = {
          name: this.filters.username,
          pageSize: this.pageSize,
          pageNumber: pageNumber,
          org_id: this.org_id
        }
      } else {
        para = {
          name: this.filters.username,
          pageSize: this.pageSize,
          pageNumber: this.pageNumber,
          org_id: this.org_id
        }
      }
      this.loading = true
      getUserList(para).then(result => {
        this.tableData = result.data.rows
        this.total = result.data.total
        this.loading = false
      })
    },
    getOrgTree () { // 获取机构树
      getOrgTree().then(result => {
        this.orgTree = result.data
      })
    },
    // 点击节点方法
    handleNodeClick (data) {
      this.org_id = data.id
      let param = {
        org_id: this.org_id,
        pageSize: this.pageSize,
        pageNumber: 1
      }
      getUserList(param).then(result => {
        this.tableData = result.data.rows
        this.total = result.data.total
        this.loading = false
      })
      this.filters.username = ''
    },
    // 显示新增界面
    handleAdd: function () {
      this.dialogAdd.show = true
    },
    // 显示编辑界面
    handleEdit: function (index, row) {
      this.dialogEdit.show = true
      let createDate = dateUtil.dateFormater(row.create_date)
      let modifyDate = dateUtil.dateFormater(row.modify_date)
      this.editForm = {
        id: row.id,
        name: row.name,
        age: row.age,
        org_id: row.org_id,
        create_date: createDate,
        modify_date: modifyDate
      }
    },
    handleDelete (index, row) { // 删除用户信息
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let para = {
          id: row.id
        }
        deleteUser(para).then(result => {
          this.getUserInfo() // 更新视图
          if (result.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      })
    },
    dateFormat: function (row) {
      return dateUtil.dateFormater(row.create_date)
    },
    dateFormat2: function (row) {
      return dateUtil.dateFormater(row.modify_date)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.pageNumber = 1
      this.getUserInfo(1, val)
    },
    handleCurrentChange (val) {
      this.pageNumber = val
      this.getUserInfo(val, this.pageSize)
    }
  },
  created () {
    this.getUserInfo()
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
