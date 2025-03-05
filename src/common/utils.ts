import { lastValueFrom } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus } from "@nestjs/common";
import { AxiosRequestConfig, AxiosResponse } from "axios";

export async function makeHTTPRequest<T>(
  httpService: HttpService,
  method: "get" | "post" | "put" | "patch" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  try {
    let response: AxiosResponse<T>;

    switch (method) {
      case "get":
        response = await lastValueFrom(httpService.get<T>(url, config));
        break;
      case "post":
        response = await lastValueFrom(httpService.post<T>(url, data, config));
        break;
      case "put":
        response = await lastValueFrom(httpService.put<T>(url, data, config));
        break;
      case "patch": 
        response = await lastValueFrom(httpService.patch<T>(url, data, config));
        break;
      case "delete":
        response = await lastValueFrom(httpService.delete<T>(url, config));
        break;
      default:
        throw new HttpException("Method not supported", 400);
    }

    return response;
  } catch (error) {
    const statusCode =
      error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      error.response?.data || error.message || "Unknown error occurred";

    throw new HttpException(
      {
        message: `HTTP request failed`,
        details: {
          url,
          method,
          statusCode,
          error: message,
          requestConfig: error.config ?? "",
          stack: error.stack,
          code: error.code ?? "ERR_HTTP_REQUEST_FAILED",
        },
      },
      statusCode
    );
  }
}
