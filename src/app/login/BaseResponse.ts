export interface BaseResponse<T> {
  response: Response;
  length: number;
  result: T;
}
