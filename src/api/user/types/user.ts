export interface CreateOrUpdateUserRequestData {
  id?: string
  username: string
  name: string
  password?: string
  phone: string
  remark: string
  status?: string
}

export interface GetUsersRequestData {
  /** 当前页码 */
  pageNum: number
  /** 查询条数 */
  pageSize: number
}

export interface GetUserData {
  id: string
  username: string
  name: string
  phone: string
  remark: string
  status: string
  create_time: string
  update_time: string
}

export type GetUsersResponseData = ApiResponseData<{
  records: GetUserData[]
  total: number
}>
