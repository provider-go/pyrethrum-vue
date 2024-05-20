<script lang="ts" setup>
import { ref, watch } from "vue"
import { createUserDataApi, deleteUserDataApi, updateUserDataApi, getUsersDataApi } from "@/api/user"
import { type CreateOrUpdateUserRequestData, type GetUserData } from "@/api/user/types/user"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "User"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateUserRequestData = {
  id: undefined,
  username: "",
  password: "",
  name: "",
  phone: "",
  remark: "",
  status: "0"
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateUserRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateUserRequestData> = {
  username: [{ required: true, trigger: "blur", message: "请输入用户名称" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id === undefined ? createUserDataApi : updateUserDataApi
    api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getUserData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
const resetForm = () => {
  formRef.value?.clearValidate()
  formData.value = cloneDeep(DEFAULT_FORM_DATA)
}
//#endregion

//#region 删
const handleDelete = (row: GetUserData) => {
  ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteUserDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getUserData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: GetUserData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const userData = ref<GetUserData[]>([])

const getUserData = () => {
  loading.value = true
  getUsersDataApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize
  })
    .then(({ data }) => {
      paginationData.total = data.total
      userData.value = data.records
    })
    .catch(() => {
      userData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getUserData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getUserData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="userData">
          <el-table-column prop="username" label="用户名" align="left" />
          <el-table-column prop="name" label="姓名" align="left" />
          <el-table-column prop="phone" label="手机号" align="left" />
          <el-table-column prop="remark" label="备注" align="left" />
          <el-table-column prop="status" label="状态" align="left">
            <template #default="scope">
              <el-tag v-if="scope.row.status == 0" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id === undefined ? '新增用户' : '修改用户'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="formData.id === undefined">
          <el-input type="password" v-model="formData.password" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="姓名">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="formData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="remark" label="备注">
          <el-input v-model="formData.remark" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态" v-if="formData.id !== undefined">
          <el-radio-group v-model="formData.status" class="ml-4">
            <el-radio :value="0" size="large">启用</el-radio>
            <el-radio :value="1" size="large">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
