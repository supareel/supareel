export interface IYtAuthorizeUrlResponse {
  url: string;
}

export interface IYtAuthorizationCodeResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}
