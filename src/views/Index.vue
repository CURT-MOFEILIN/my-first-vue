<template>
  <div class="info" id="app">
    <!--<LeftNav></LeftNav>-->
    <!--机构树-->
    <el-row class="slot-tree" style="float: left;width: 15%;margin-top: 25px;margin-left: 25px">
      <el-tree class="expand-tree"
               v-if="isLoadingTree"
               :data.sync="treeData"
               highlight-current
               node-key="id"
               :props="props"
               :expand-on-click-node="false"
               :default-expanded-keys="defaultExpandedKeys"
               @node-click="handleNodeClick"
               ref="tree">
        <span class="slot-t-node" slot-scope="{ node, data }">
          <!-- 未编辑状态 -->
          <span v-show="!node.isEdit">
            <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']">{{ node.label }}</span>
            <span class="slot-t-icons tree-btn">
              <!-- 新增按钮 -->
              <i class="el-icon-plus" :size="iconSize" @click="NodeAdd(node, data)"></i>
              <!-- 编辑按钮 -->
              <i class="el-icon-edit" :size="iconSize" @click="NodeEdit(node, data)"></i>
              <!-- 删除按钮 -->
              <i class="el-icon-delete" :size="iconSize" @click="NodeDel(node, data)"></i>
            </span>
          </span>
          <!-- 编辑输入框 -->
          <span v-show="node.isEdit">
            <el-input class="slot-t-input" size="mini" autofocus
                      v-model="data.org_name"
                      :ref="'slotTreeInput'+data.id"
                      @keyup.enter.native="NodeBlur(node, data)">
            </el-input>
          </span>
        </span>
      </el-tree>
    </el-row>

    <!--用户表-->
    <el-row style="width: 72%;float: right;margin-top: 25px;">
      <el-col :span="20" :push='0'>
        <div>
          <el-form :inline="true">
            <el-form-item style="float: left" label="查询用户信息:">
              <el-input v-model="filters.username" clearable placeholder="请输入姓名" style="width: 180px"></el-input>
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
                         :current-page="query.pageNumber"
                         :page-sizes="[10, 50]"
                         :page-size="query.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="query.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <AddUser :dialogAdd="dialogAdd" @update="getUserInfo"></AddUser>
    <EditUser :dialogEdit="dialogEdit" :edit-form="editForm" @updateEdit="getUserInfo"></EditUser>
    <AddOrg :addOrg="addOrg" v-bind:add_org_id="add_org_id" @updateOrg="expandNode"></AddOrg>
  </div>
</template>

<script>
import AddUser from './AddUser'
import EditUser from './EditUser'
import dateUtil from '@/utils/dateUtil'
import LeftNav from '@/components/LeftNav'
import {getUserList, deleteUser, getOrgTree, editOrg, delOrg} from '@/api/api'
import AddOrg from './AddOrg'

export default {
  name: 'info',
  data () {
    return {
      breadcrumbItems: ['首页'],
      filters: {
        username: ''
      },
      props: {
        label: 'org_name',
        children: 'childList'
      },
      isLoadingTree: true, // 是否加载节点树
      treeData: [],
      defaultExpandedKeys: [],
      maxexpandId: 9999,
      iconSize: 'mini',
      addOrg: { // 控制新增机构弹窗显示
        show: false
      },
      show: false,
      org_name: '',
      loading: false,
      tableData: [],
      query: {
        pageSize: 10,
        pageNumber: 1,
        total: 0
      },
      params: {},
      dialogEdit: {
        show: false
      },
      dialogAdd: {
        show: false
      },
      add_org_id: '', // 新增机构
      editForm: { // 编辑信息
        id: '',
        name: '',
        age: '',
        org_id: '',
        create_date: '',
        modify_date: ''
      }
    }
  },
  methods: {
    handleSelect (key) {
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
    },
    getUserInfo (pageNumber, pageSize) {
      let para
      if (pageNumber) {
        para = {
          name: this.filters.username,
          pageSize: this.query.pageSize,
          pageNumber: pageNumber,
          org_id: this.org_id
        }
      } else {
        para = {
          name: this.filters.username,
          pageSize: this.query.pageSize,
          pageNumber: this.query.pageNumber,
          org_id: this.org_id
        }
      }
      this.loading = true
      getUserList(para).then(result => {
        this.tableData = result.data.rows
        this.query.total = result.data.total
        this.loading = false
      })
    },
    getOrgTree () { // 获取机构树
      getOrgTree().then(result => {
        this.treeData = result.data
      })
    },
    // 点击节点方法
    handleNodeClick (data, n, s) {
      this.org_id = data.id
      let param = {
        org_id: this.org_id,
        pageSize: this.query.pageSize,
        pageNumber: 1
      }
      getUserList(param).then(result => {
        this.tableData = result.data.rows
        this.query.total = result.data.total
        this.loading = false
      })
      this.filters.username = ''
    },
    NodeBlur (n, d) { // 输入框失焦
      if (n.isEdit) {
        this.$set(n, 'isEdit', false)
      }
      let params = new URLSearchParams()
      params.append('id', d.id)
      params.append('org_name', d.org_name)
      editOrg(params).then(res => {
        if (res.data === 'success') {
          this.$message({
            type: 'success',
            message: '修改机构信息成功'
          })
        } else {
          this.$message({
            type: 'error',
            message: '修改机构信息失败'
          })
        }
      })
    },
    NodeEdit (n, d) { // 编辑节点
      if (!n.isEdit) { // 检测isEdit是否存在or是否为false
        this.$set(n, 'isEdit', true)
      }
      this.$nextTick(() => {
        this.$refs['slotTreeInput' + d.id].$refs.input.focus()
      })
    },
    NodeDel (n, d) { // 删除节点
      if (d.childList && d.childList.length !== 0) {
        this.$message({
          type: 'error',
          message: '此节点有子级，不可删除！'
        })
        return false
      } else {
        let _this = this
        let params = new URLSearchParams()
        params.append('id', d.id)
        delOrg(params).then(res => {
          if (res.data === 'success') {
            this.$message({
              type: 'success',
              message: '删除机构信息成功'
            })
          } else {
            this.$message({
              type: 'error',
              message: res.data
            })
          }
          _this.expandNode(d.parent_id)
        })
      }
    },
    NodeAdd (n, d) { // 新增节点
      // 判断层级
      if (n.level >= 5) {
        this.$message.error('最多只支持五级！')
        return false
      }
      // 新增数据
      this.addOrg.show = true
      this.add_org_id = d.id
      console.log(this.add_org_id)
      // 同时展开节点
      if (!n.expanded) {
        n.expanded = true
      }
    },
    expandNode (id) {
      console.log(2222222222 + '     ' + id)
      getOrgTree().then(result => {
        this.treeData = result.data
      })
      this.defaultExpandedKeys = []
      this.defaultExpandedKeys.push(id)
      this.getUserInfo()
      // let keys = this.$refs.tree.getCheckedKeys() // 取得当前选择的node-key
      // this.$refs.tree.updateKeyChildren(keys,treeData) // 更新node-key的子节点

      // console.log(111111111111111 + this.defaultExpandedKeys)
    },
    // 显示人员新增界面
    handleAdd: function () {
      this.dialogAdd.show = true
    },
    // 显示人员编辑界面
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
      this.query.pageNumber = 1
      this.getUserInfo(1, val)
    },
    handleCurrentChange (val) {
      this.query.pageNumber = val
      this.getUserInfo(val, this.pageSize)
    }
  },
  created () {
    this.getUserInfo()
    this.getOrgTree()
  },
  components: {
    AddUser,
    EditUser,
    AddOrg,
    LeftNav
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
}
.tree-expand .tree-label.tree-new{
  font-weight:600;
}
.tree-expand .tree-label{
  font-size:0.9em;
}
.tree-expand .tree-label .edit{
  width:80%;
}
.tree-expand .tree-btn{
  display:none;
  float:right;
  margin-right:20px;
}
.tree-expand .tree-btn i{
  color:#8492a6;
  font-size:0.9em;
  margin-right:3px;
}
.slot-tree{
  height: 80%;
  margin: 0 auto;
  padding: 10px;
  max-width: 600px;
  overflow-y: auto;
}
/*顶部按钮*/
.slot-tree .slot-t-top{
  margin-bottom: 15px;
}
.slot-tree .slot-t-node span{
  display: inline-block;
}
/*节点*/
.slot-tree .slot-t-node--label{
  font-weight: 600;
}
/*输入框*/
.slot-tree .slot-t-input .el-input__inner{
  height: 26px;
  line-height: 26px;
}
/*按钮列表*/
.slot-tree .slot-t-node .slot-t-icons{
  display: none;
  margin-left: 10px;
}
.slot-tree .slot-t-icons .el-button+.el-button{
  margin-left: 6px;
}
.slot-tree .el-tree-node__content:hover .slot-t-icons{
  display: inline-block;
}
</style>
