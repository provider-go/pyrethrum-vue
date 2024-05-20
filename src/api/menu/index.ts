import { request } from "@/utils/service"
import type * as Menu from "./types/menu"

/** 增 */
export function createMenuDataApi(data: Menu.CreateOrUpdateMenuRequestData) {
  return request({
    url: "/manager/home/menu",
    method: "post",
    data
  })
}

/** 删 */
export function deleteMenuDataApi(id: number) {
  return request({
    url: `/manager/home/menu?id=${id}`,
    method: "delete"
  })
}

/** 改 */
export function updateMenuDataApi(data: Menu.CreateOrUpdateMenuRequestData) {
  return request({
    url: "/manager/home/menu",
    method: "put",
    data
  })
}

/** 查 */
export function getMenusDataApi(params: Menu.GetMenusRequestData) {
  return request<Menu.GetMenusResponseData>({
    url: "/manager/home/menus",
    method: "get",
    params
  })
}

/** 查 */
export function getAllMenusDataApi() {
  return request<Menu.GetAllMenusResponseData>({
    url: "/manager/home/allMenus",
    method: "get"
  })
}
