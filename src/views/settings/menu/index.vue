<script lang="ts" setup>
import { ref } from "vue"
import { createMenuDataApi, deleteMenuDataApi, updateMenuDataApi, getAllMenusDataApi } from "@/api/menu"
import {
  type GetParentData,
  type CreateOrUpdateMenuRequestData,
  type GetMenuData,
  type GetAllMenuData
} from "@/api/menu/types/menu"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { cloneDeep } from "lodash-es"

defineOptions({
  // 命名当前组件
  name: "Menus"
})

const loading = ref<boolean>(false)

enum Method {
  GET,
  POST,
  PUT,
  DELETE
}

//#region 增
const DEFAULT_FORM_DATA: CreateOrUpdateMenuRequestData = {
  id: 0,
  parentId: 0,
  type: "",
  code: "",
  name: "",
  path: "",
  method: "",
  apiPath: "",
  sequence: "",
  status: ""
}
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = ref<CreateOrUpdateMenuRequestData>(cloneDeep(DEFAULT_FORM_DATA))
const formRules: FormRules<CreateOrUpdateMenuRequestData> = {
  type: [{ required: true, trigger: "blur", message: "请输入菜单类型" }],
  code: [{ required: true, trigger: "blur", message: "请输入菜单编码" }],
  name: [{ required: true, trigger: "blur", message: "请输入菜单名称" }],
  path: [{ required: true, trigger: "blur", message: "请输入菜单访问路径" }]
}
const handleCreateOrUpdate = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    const api = formData.value.id === 0 ? createMenuDataApi : updateMenuDataApi
    api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        dialogVisible.value = false
        getAllMenusData()
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
const handleDelete = (row: GetMenuData) => {
  ElMessageBox.confirm(`正在删除菜单：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteMenuDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getAllMenusData()
    })
  })
}
//#endregion

//#region 改
const handleUpdate = (row: GetMenuData) => {
  dialogVisible.value = true
  formData.value = cloneDeep(row)
}
//#endregion

//#region 增加子菜单
const parentData: GetParentData = {
  id: 0,
  name: ""
}
const subMenuVisible = ref<boolean>(false)
const handleAddSubMenu = (row: GetMenuData) => {
  subMenuVisible.value = true
  parentData.id = row.id
  parentData.name = row.name
}
const handleCreateSub = () => {
  formRef.value?.validate((valid: boolean, fields) => {
    if (!valid) return console.error("表单校验不通过", fields)
    loading.value = true
    formData.value.parentId = parentData.id
    const api = createMenuDataApi
    api(formData.value)
      .then(() => {
        ElMessage.success("操作成功")
        subMenuVisible.value = false
        getAllMenusData()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
//#endregion

//#region 查
const allMenuData = ref<GetAllMenuData[]>([])

const getAllMenusData = () => {
  loading.value = true
  getAllMenusDataApi()
    .then(({ data }) => {
      allMenuData.value = data.list
    })
    .catch(() => {
      allMenuData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
//#endregion
getAllMenusData()
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增菜单</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新当前页">
            <el-button type="primary" :icon="RefreshRight" circle @click="getAllMenusData" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="allMenuData" row-key="id" :tree-props="{ children: 'children' }">
          <el-table-column prop="name" label="菜单名称" align="left" width="200" fixed />
          <el-table-column prop="type" label="菜单类型" align="center" />
          <el-table-column prop="code" label="菜单编码" align="center" />
          <el-table-column prop="path" label="访问路径" align="center" />
          <el-table-column prop="method" label="请求方法" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.method != ''" type="danger" effect="plain">{{ scope.row.method }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="apiPath" label="请求路径" align="center" width="200" />
          <el-table-column prop="sequence" label="排序顺序" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status == `enabled`" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
              <el-button type="success" text bg size="small" @click="handleAddSubMenu(scope.row)">添加子菜单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="formData.id === 0 ? '新增菜单' : '修改菜单'"
      @closed="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="type" label="菜单类型">
          <el-radio-group v-model="formData.type">
            <el-radio-button label="menu" value="menu" />
            <el-radio-button label="button" value="button" />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="code" label="菜单编码">
          <el-input v-model="formData.code" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="菜单名称">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="path" label="访问路径">
          <el-input v-model="formData.path" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="method" label="请求方法">
          <el-select v-model="formData.method">
            <el-option v-for="item in 4" :key="Method[item - 1]" :label="Method[item - 1]" :value="Method[item - 1]" />
          </el-select>
        </el-form-item>
        <el-form-item prop="apiPath" label="请求路径">
          <el-input v-model="formData.apiPath" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="sequence" label="排序顺序" v-if="formData.id !== 0">
          <el-input v-model="formData.sequence" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="formData.status" class="ml-4">
            <el-radio value="enabled" size="large">启用</el-radio>
            <el-radio value="disabled" size="large">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateOrUpdate" :loading="loading">确认</el-button>
      </template>
    </el-dialog>
    <!-- 新增子菜单 -->
    <el-dialog v-model="subMenuVisible" title="新增子菜单" @closed="resetForm" width="30%">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="parentId" label="父菜单">
          <el-select v-model="parentData.id" disabled>
            <el-option :key="parentData.id" :label="parentData.name" :value="parentData.id" />
          </el-select>
        </el-form-item>
        <el-form-item prop="type" label="菜单类型">
          <el-radio-group v-model="formData.type">
            <el-radio-button label="menu" value="menu" />
            <el-radio-button label="button" value="button" />
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="code" label="菜单编码">
          <el-input v-model="formData.code" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="name" label="菜单名称">
          <el-input v-model="formData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="path" label="访问路径">
          <el-input v-model="formData.path" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="method" label="请求方法">
          <el-select v-model="formData.method">
            <el-option v-for="item in 4" :key="Method[item - 1]" :label="Method[item - 1]" :value="Method[item - 1]" />
          </el-select>
        </el-form-item>
        <el-form-item prop="apiPath" label="请求路径">
          <el-input v-model="formData.apiPath" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="sequence" label="排序顺序" v-if="formData.id !== 0">
          <el-input v-model="formData.sequence" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <el-radio-group v-model="formData.status" class="ml-4">
            <el-radio value="enabled" size="large">启用</el-radio>
            <el-radio value="disabled" size="large">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreateSub" :loading="loading">确认</el-button>
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
