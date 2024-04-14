import RNReactNativeHapticFeedback, { HapticOptions } from "react-native-haptic-feedback";

const options: HapticOptions = {
  ignoreAndroidSystemSettings: true
};

export const Vibrate = (): void => {
  RNReactNativeHapticFeedback.trigger("impactMedium", options);
};
