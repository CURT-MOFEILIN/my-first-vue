<template>
  <div class="slot-tree" id="tree">
      <el-row style="width: 100%;margin-top: 25px;">
<!--        <el-button class="slot-t-top" type="primary" size="small" @click="handleAddTop">添加顶级节点</el-button>-->
        <el-tree class="expand-tree"
                 v-if="isLoadingTree"
                 :data="treeData"
                 highlight-current
                 node-key="id"
                 :props="treePorps"
                 :expand-on-click-node="false"
                 @node-click="handleNodeClick"
                 ref="tree">
          <span class="slot-t-node" slot-scope="{ node, data }">
            <!-- 未编辑状态 -->
            <span v-show="!node.isEdit">
              <span :class="[data.id >= maxexpandId ? 'slot-t-node--label' : '']">{{ node.label }}</span>
              <span class="slot-t-icons tree-btn">
                <i class="el-icon-plus" :size="iconSize" @click="NodeAdd(node, data)"></i>
                <i class="el-icon-edit" :size="iconSize" @click="NodeEdit(node, data)"></i>
                <i class="el-icon-delete" :size="iconSize" @click="NodeDel(node, data)"></i>
              </span>
            </span>
            <!-- 编辑输入框 -->
            <span v-show="node.isEdit">
              <el-input class="slot-t-input" size="mini" autofocus
                        v-model="data.org_name"
                        :ref="'slotTreeInput'+data.id"
                        @blur.stop="NodeBlur(node, data)"
                        @keyup.enter.native="NodeBlur(node, data)"></el-input>
            </span>
          </span>
        </el-tree>
      </el-row>
    </div>
</template>

<script>
import {getOrgTree, getUserList} from '@/api/api'

export default {
  name: 'orgTree',
  data () {
    return {
      maxexpandId: 999, // 新增节点开始id
      non_maxexpandId: 999, // 新增节点开始id(不更改)
      isLoadingTree: true, // 是否加载节点树
      treeData: [],
      iconSize: 'mini',
      treePorps: {
        label: 'org_name',
        children: 'childList'
      }
    }
  },
  methods: {
    getOrgTree () { // 获取机构树
      getOrgTree().then(result => {
        this.treeData = result.data
        console.log(this.treeData)
      })
    },
    // handleAddTop () { // 增加主节点
    //   getNextTreeId().then(result => {
    //     this.maxexpandId = result.data
    //     this.non_maxexpandId = result.data
    //   })
    //   console.log(this.maxexpandId)
    //   this.$message.success('添加主节点方法')
    // },
    NodeBlur (n, d) { // 输入框失焦
      if (n.isEdit) {
        this.$set(n, 'isEdit', false)
      }
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
      if (d.children && d.children.length !== 0) {
        this.$message.error('此节点有子级，不可删除！')
        return false
      } else {
        this.message.error('后台判断再删除')
        // 新增节点可直接删除，已存在的节点要二次确认
        // 删除操作
        // let DelFun = () => {
        //   let _list = n.parent.data.children || n.parent.data // 节点同级数据
        //   let _index = _list.map((c) => c.id).indexOf(d.id)
        //   console.log(_index)
        //   _list.splice(_index, 1)
        //   this.$message.success('删除成功！')
        // }
        // // 二次确认
        // let ConfirmFun = () => {
        //   this.$confirm('是否删除此节点？', '提示', {
        //     confirmButtonText: '确认',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     DelFun()
        //   }).catch(() => {}
        //   )
        // }
        // 判断是否是新增点
        // d.id > this.non_maxexpandId ? DelFun() : ConfirmFun()
      }
    },
    NodeAdd (n, d) { // 新增节点
      console.log(n.level)
      // 判断层级
      if (n.level >= 3) {
        this.$message.error('最多只支持三级！')
        return false
      }
      // 新增数据
      this.message.success('新增节点成功')
      // 同时展开节点
      if (!n.expanded) {
        n.expanded = true
      }
    },
    // 点击节点方法
    handleNodeClick (data, n, s) {
      data.isEdit = false
      console.log(data.org_name)
      this.org_id = data.id
      let param = {
        org_id: this.org_id,
        pageSize: this.query.pageSize,
        pageNumber: 1
      }
      getUserList(param).then(result => {
        this.$emit('tableData', result.data.rows)
        // this.$emit('query.total',result.data.total)
        // this.tableData = result.data.rows
        // this.query.total = result.data.total
        // this.loading = false
      })
      this.filters.username = ''
    }
    // renderContent (h, {node, data, store}) {
    //   let that = this// 指向vue
    //   return h(TreeRender, {
    //     props: {
    //       DATA: data, // 节点数据
    //       NODE: node, // 节点内容
    //       STORE: store, // 完整树形内容
    //       maxexpandId: that.non_maxexpandId
    //     },
    //     on: { // 绑定方法
    //       nodeAdd: (s, d, n) => that.treeHandleAdd(s, d, n),
    //       nodeEdit: (s, d, n) => that.treeHandleEdit(s, d, n),
    //       nodeDel: (s, d, n) => that.treeHandleDelete(s, d, n)
    //     }
    //   })
    // },
    // // 点击节点方法
    // handleNodeClick (data, n, s) {
    //   data.isEdit = false
    //   console.log(data.org_name)
    // },
    // treeHandleAdd (d, n, s) { // 增加节点
    //   console.log(d, n, s)
    //   if (n.level >= 6) {
    //     this.$message.error('最多只支持五级！')
    //     return false
    //   }
    //   // 添加数据
    //   this.$message.success('添加节点方法')
    //   // 展开节点
    //   if (!n.expanded) {
    //     n.expanded = true
    //   }
    // },
    // treeHandleEdit (s, d, n) { // 编辑节点
    //   console.log(s, d, n)
    //   this.$message.success('编辑节点方法')
    // },
    // treeHandleDelete (s, d, n) { // 删除节点
    //   this.$message({
    //     type: 'success',
    //     message: '删除成功!'
    //   })
    //   // 新增节点直接删除，否则要通过请求数据删除
    // }
  },
  mounted () {
    this.getOrgTree()
  }
}
</script>

<style scoped>
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
