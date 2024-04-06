import { AxiosError } from "axios";
import { ToastAndroid } from "react-native";

export const Toast = (err: AxiosError | string): void =>
  ToastAndroid.showWithGravity(
    typeof err === "string" ? err : err.message,
    ToastAndroid.BOTTOM,
    ToastAndroid.LONG
  );
