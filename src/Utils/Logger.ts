import { AxiosError } from "axios";

export const Logger = (err: AxiosError | unknown): void => {
  console.log(JSON.stringify(err, null, 2));
};
