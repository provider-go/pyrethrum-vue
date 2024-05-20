export interface CreateOrUpdateMenuRequestData {
  id?: number
  parentId: number
  type: string
  code: string
  name: string
  path: string
  method: string
  apiPath: string
  sequence: string
  status: string
}

export interface GetMenusRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
}

export interface GetMenuData {
  id: number
  parentId: number
  type: string
  code: string
  name: string
  path: string
  method: string
  apiPath: string
  sequence: string
  status: string
  create_time: string
  update_time: string
}

export type GetMenusResponseData = ApiResponseData<{
  list: GetMenuData[]
  total: number
}>

export interface GetAllMenuData {
  id: number
  parentId: number
  type: string
  code: string
  name: string
  path: string
  method: string
  apiPath: string
  sequence: string
  status: string
  create_time: string
  update_time: string
  children: GetAllMenuData[]
}

export type GetAllMenusResponseData = ApiResponseData<{
  list: GetAllMenuData[]
}>

export interface GetParentData {
  id: number
  name: string
}
