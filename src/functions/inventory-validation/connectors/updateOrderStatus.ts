import { HttpService } from "@nestjs/axios";
import { AxiosRequestConfig } from "axios";
import { makeHTTPRequest } from "src/common/utils";
const httpService = new HttpService();

export async function updateOrderStatus(
  orderData: Record<string, any>
): Promise<any> {
  try {
    const headers: Record<string, string> = {
      "x-api-key": process.env.API_KEY,
    };

    const config: AxiosRequestConfig = { headers };

    const response = (
      await makeHTTPRequest(
        httpService,
        "post",
        `${process.env.DOMAIN}/api/orders/updateStatus/${orderData.id}?status=${orderData.status}`,
        orderData,
        config
      )
    ).data;

    return response;
  } catch (error) {
    throw error;
  }
}
