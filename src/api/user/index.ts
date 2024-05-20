import { request } from "@/utils/service"
import type * as User from "./types/user"

/** 增 */
export function createUserDataApi(data: User.CreateOrUpdateUserRequestData) {
  return request({
    url: "/manager/home/user",
    method: "post",
    data
  })
}

/** 删 */
export function deleteUserDataApi(id: string) {
  return request({
    url: `/manager/home/user?id=${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateUserDataApi(data: User.CreateOrUpdateUserRequestData) {
  return request({
    url: "/manager/home/user",
    method: "put",
    data
  })
}

/** 查 */
export function getUsersDataApi(params: User.GetUsersRequestData) {
  return request<User.GetUsersResponseData>({
    url: "/manager/home/users",
    method: "get",
    params
  })
}
