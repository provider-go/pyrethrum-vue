<script lang="ts" setup>
import { ref, watch } from "vue"
import { createRoleDataApi, deleteRoleDataApi, updateRoleDataApi, getRolesDataApi } from "@/api/role"
import { type CreateOrUpdateRoleRequestData, type GetRoleData } from "@/api/role/types/role"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "Role"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateRoleRequestData = {
  id: undefined,
  code: "",
  name: "",
  description: "",
  sequence: "0",
  status: "0"
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateRoleRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateRoleRequestData> = {
  code: [{ required: true, trigger: "blur", message: "请输入角色编码" }],
  name: [{ required: true, trigger: "blur", message: "请输入角色名称" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id === undefined ? createRoleDataApi : updateRoleDataApi
    api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getRoleData()
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
const handleDelete = (row: GetRoleData) => {
  ElMessageBox.confirm(`正在删除角色：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteRoleDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getRoleData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: GetRoleData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 查
const roleData = ref<GetRoleData[]>([])

const getRoleData = () => {
  loading.value = true
  getRolesDataApi({
    pageNum: paginationData.currentPage,
    pageSize: paginationData.pageSize
  })
    .then(({ data }) => {
      paginationData.total = data.total
      roleData.value = data.records
    })
    .catch(() => {
      roleData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getRoleData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增角色</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getRoleData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="roleData">
          <el-table-column prop="code" label="角色编码" align="left" width="80" />
          <el-table-column prop="name" label="角色名称" align="left" width="100" />
          <el-table-column prop="description" label="角色描述" align="left" show-overflow-tooltip />
          <el-table-column prop="sequence" label="排序顺序" align="center" width="80" />
          <el-table-column prop="status" label="状态" align="center" width="80">
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
      :title="formData.id === undefined ? '新增角色' : '修改角色'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="code" label="角色编码">
          <el-input v-model="formData.code" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="formData.description" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="sequence" label="排序顺序" v-if="formData.id !== undefined">
          <el-input v-model="formData.sequence" placeholder="请输入" />
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
