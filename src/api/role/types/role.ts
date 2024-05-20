export interface CreateOrUpdateRoleRequestData {
  id?: string
  code: string
  name: string
  description: string
  sequence?: string
  status?: string
}

export interface GetRolesRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
}

export interface GetRoleData {
  id: string
  code: string
  name: string
  description: string
  sequence: string
  status: string
  create_time: string
  update_time: string
}

export type GetRolesResponseData = ApiResponseData<{
  records: GetRoleData[]
  total: number
}>
