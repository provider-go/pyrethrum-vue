import { request } from "@/utils/service"
import type * as Role from "./types/role"

/** 增 */
export function createRoleDataApi(data: Role.CreateOrUpdateRoleRequestData) {
  return request({
    url: "/manager/home/role",
    method: "post",
    data
  })
}

/** 删 */
export function deleteRoleDataApi(id: string) {
  return request({
    url: `/manager/home/role?id=${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateRoleDataApi(data: Role.CreateOrUpdateRoleRequestData) {
  return request({
    url: "/manager/home/role",
    method: "put",
    data
  })
}

/** 查 */
export function getRolesDataApi(params: Role.GetRolesRequestData) {
  return request<Role.GetRolesResponseData>({
    url: "/manager/home/roles",
    method: "get",
    params
  })
}
