<template>
  <div class="hello">
    <el-dialog title="编辑用户信息" :visible.sync="dialogEdit.show">
      <el-form :model="editForm" ref="editForm" label-width="100px" :rules="formRules">
        <el-form-item label="id" prop="id" v-show="false">
          <el-input v-model="editForm.id"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" clearable maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="editForm.age" clearable maxlength="3"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="org_id">
          <el-select v-model="editForm.org_id" clearable placeholder="组织机构" style="width: 100%">
            <el-option
              v-for="item in orgs"
              :key="item.id"
              :label="item.org_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="create_date" >
          <el-input v-model="editForm.create_date" v-bind:readonly="readonly"></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="modify_date" >
          <el-input v-model="editForm.modify_date" v-bind:readonly="readonly"></el-input>
        </el-form-item>
        <!--编辑界面-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit.show = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormEdit('formEdit')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {editUser, getOrgs} from '@/api/api'

export default {
  name: 'EditUser',
  props: {
    dialogEdit: Object,
    editForm: Object
  },
  data () {
    const validateAge = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入年龄'))
        return false
      } else if (isNaN(value)) {
        callback(new Error('请输入数字'))
        return false
      } else {
        callback()
      }
    }
    return {
      formRules: {
        name: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        age: [{required: true, trigger: 'blur', validator: validateAge}],
        org_id: [{required: true, message: '机构不能为空', trigger: 'blur'}]
      },
      readonly: true,
      orgs: []
    }
  },
  methods: {
    dialogFormEdit () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          let params = new URLSearchParams()
          params.append('id', this.editForm.id)
          params.append('name', this.editForm.name)
          params.append('age', this.editForm.age)
          params.append('org_id', this.editForm.org_id)
          editUser(params).then(res => {
            if (res.data === 'success') {
              this.$message({
                type: 'success',
                message: '编辑信息成功'
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data
              })
            }
            this.dialogEdit.show = false
            this.$emit('updateEdit')
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOrgList () {
      getOrgs().then(result => {
        this.orgs = result.data
      })
    }
  },
  mounted () {
    this.getOrgList()
  }
}
</script>

<style scoped>

</style>
