export interface LoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
}

export type LoginResponseData = ApiResponseData<string>

export type UserInfoResponseData = ApiResponseData<{ username: string; roles: string[] }>
