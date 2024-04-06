import axios, { AxiosResponse } from "axios";
import Config from "react-native-config";

import { HTTPMethods } from "@Constants/HTTPMethods";

if (__DEV__) {
  void (async () => {
    const token = Config.API_KEY;

    console.log("TOKEN: ", token);
  })();
}

const performRequest = async ({
  url,
  method = HTTPMethods.GET,
  data
}: performRequestTypes): Promise<AxiosResponse> => {
  const accessToken = Config.API_KEY;
  const headers: { [key: string]: string } = {};

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  try {
    const response = await axios(url, {
      headers,
      method,
      data
    });

    return response;
  } catch (error) {
    console.error("Error performing request:", error);
    throw error;
  }
};

export default { performRequest };
