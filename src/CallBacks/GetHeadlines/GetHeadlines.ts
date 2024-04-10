import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import API from "../../API";
import news from "../../API/News";

const getHeadLines = async (): Promise<HeadlinesTypes> => {
  const request = news.getHeadlines();
  const response: AxiosResponse<HeadlinesTypes> = await API.performRequest(request);

  return response.data;
};

export const useGetHeadlines = (): UseQueryResult<HeadlinesTypes, unknown> => {
  return useQuery({
    queryKey: ["getHeadlines"],
    queryFn: getHeadLines
  });
};
