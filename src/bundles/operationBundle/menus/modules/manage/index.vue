<template>
  <el-dialog :title="options ? '编辑菜单':'新增菜单'" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <el-form ref="form" label-width="80px" :model="form" class="jc-manage-form">
      <el-form-item label="菜单名称" prop="resName" :rules="rules.Len50">
        <el-input v-model="form.resName" placeholder="请输入菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="pid">
        <el-cascader v-model="form.pid" :options="menus" filterable :props="{ expandTrigger: 'hover',checkStrictly: true,emitPath: false }"></el-cascader>
      </el-form-item>

      <!-- 菜单类型 -->
      <el-form-item label="菜单类型" prop="type">
        <el-select v-model="form.deviceType" placeholder="请选择菜单类型">
          <el-option
            v-for="item in menuType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="菜单图标" prop="icon">
        <el-input v-model="form.icon" placeholder="请输入菜单图标"></el-input>
      </el-form-item>
      <el-form-item label="菜单地址" prop="url" :rules="rules.Len50">
        <el-input v-model="form.url" placeholder="请输入菜单地址"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="sort" :rules="rules.Int">
        <el-input v-model.number="form.sort" placeholder="请输入序号"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { menusList, menusSave } from '@/api/menus'
import { getStringRule, getIntegerRule } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'

let defaultForm = { resName: '', sort: 1, pid: '', url: '', icon: '' }

export default {
  name: 'SystemMenusManage',
  mixins: [FormMixins],
  props: {
    filter: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      menus: [],
      rules: {
        Len50: getStringRule(1, 50),
        Int: getIntegerRule()
      },
      menuType: [
        {
          label: 'PC端',
          value: null
        },
        {
          label: 'APP端',
          value: 2
        }
      ],
      deviceType: null // 保存查询条件中的菜单类型
    }
  },
  watch: {
    'form.deviceType'() {
      this.initData()
    },
    filter(filter) {
      this.deviceType = filter.deviceType
    }
  },
  methods: {
    initData() {
      menusList({ deviceType: this.form.deviceType }).then(res => {
        this.menus = this.formatMenus(res)
      })
    },
    formatMenus(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          trees.push({ value: item.resId, label: item.resName, ...(item.children && item.children.length ? { children: this.formatMenus(item.children) } : {}) })
        })
      }
      return trees
    },
    formatFormData() {
      if (this.options) {
        return {
          resId: this.options.resId,
          resName: this.options.resName,
          sort: this.options.sort,
          pid: this.options.pid,
          url: this.options.url,
          icon: this.options.icon,
          deviceType: this.options.deviceType //当前菜单类型
        }
      } else {
        return {
          ...defaultForm,
          deviceType: this.deviceType
        }
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          menusSave(this.form).then(() => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$emit('save-success')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  }
}
</script>
