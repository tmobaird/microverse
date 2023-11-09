import * as Haptics from "expo-haptics";

export const basicFeedback = () => {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
};
