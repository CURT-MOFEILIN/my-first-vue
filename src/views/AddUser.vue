<template>
  <div class="hello" >
    <el-dialog title="添加用户" :visible.sync="dialogAdd.show">
      <el-form :model="form" ref="userForm" label-width="100px" :rules="formRules">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" clearable maxlength="20" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model="form.age" clearable maxlength="3" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="机构" prop="org_id">
          <el-select v-model="form.org_id" clearable placeholder="组织机构" style="width: 500px">
            <el-option
              v-for="item in orgs"
              :key="item.id"
              :label="item.org_name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd.show = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormAdd()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addUser, getOrgs} from '@/api/api'
import {isString} from '@/utils/validate'

export default {
  name: 'AddUser',
  props: {
    dialogAdd: Object,
    name: String,
    age: String,
    org_id: String
  },
  data () {
    const validateString = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入姓名'))
      } else if (!isString(value)) {
        callback(new Error('请输入文字'))
      } else {
        callback()
      }
    }
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
      form: {
        name: '',
        age: '',
        org_id: ''
      },
      formRules: {
        name: [{required: true, message: '用户名不能为空', trigger: 'blur', validator: validateString}],
        age: [{required: true, trigger: 'blur', validator: validateAge}],
        org_id: [{required: true, message: '请选择所属机构', trigger: 'blur'}]
      },
      orgs: []
    }
  },
  methods: {
    dialogFormAdd () {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          let postData = this.$qs.stringify({
            name: this.form.name,
            age: this.form.age,
            org_id: this.form.org_id
          })
          addUser(postData).then(res => {
            if (res.data === 'success') {
              this.$message({
                type: 'success',
                message: '编辑信息成功'
              })
            } else {
              this.dialogAdd.show = false
              this.$emit('update')
            }
          })
          this.form.name = ''
          this.form.age = ''
          this.form.org_id = ''
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
