<template>
  <div class="addOrg" >
    <el-dialog title="添加机构" :visible.sync="addOrg.show">
      <el-form :model="orgForm" ref="orgForm" label-width="100px" :rules="addOrgRules">
        <el-form-item label="机构名称" prop="add_org_name">
          <el-input v-model="orgForm.add_org_name" clearable maxlength="20" style="width: 500px"></el-input>
        </el-form-item>
        <el-form-item label="机构父级ID" prop="add_org_id" v-show="false">
          <el-input v-model="orgForm.add_org_id" style="width: 500px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addOrg.show = false">取 消</el-button>
        <el-button type="primary" @click="submitOrg()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {addOrg} from '@/api/api'

export default {
  name: 'AddOrg',
  props: {
    addOrg: Object,
    add_org_id: String
  },
  data () {
    return {
      orgForm: {
        add_org_name: '',
        add_org_id: this.add_org_id
      },
      addOrgRules: {
        add_org_name: [{required: true, message: '机构名称不能为空', trigger: 'blur'}]
      }
    }
  },
  methods: {
    submitOrg () {
      this.$refs.orgForm.validate((valid) => {
        if (valid) {
          let postData = this.$qs.stringify({
            org_name: this.orgForm.add_org_name,
            parent_id: this.add_org_id
          })
          console.log(postData)
          addOrg(postData).then(result => {
            this.addOrg.show = false
            this.$message({
              type: 'success',
              message: '新增机构成功!'
            })
            this.$emit('updateOrg', this.add_org_id)
            this.orgForm.add_org_id = ''
            this.orgForm.add_org_name = ''
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
