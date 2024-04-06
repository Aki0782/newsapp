import Config from "react-native-config";

const newsApiUrl = `${Config.BASE_URL as string}/v2`;

export default {
  getHeadlines(): performRequestTypes {
    return {
      url: `${newsApiUrl}/top-headlines?pageSize=100`
    };
  }
};
