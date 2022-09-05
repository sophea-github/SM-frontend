import Popper from "popper.js";

export interface LoginModel{
  username: string,
  password: string,
  rememberMe: boolean,
}

export interface LoginResponse {
  response: ResponseData;
  data: Data;
}
export interface ResponseData {
  code: number;
  message: string;
}

export interface Data {
  // token
  result: string;
}
export interface UserInfo{
  id: number
  username: string,
  gender: string,
  contact: string,
  email: string,
  imagePath: String,
  dob: any,
  password: string,
  address: string,
  photo: string,
}
