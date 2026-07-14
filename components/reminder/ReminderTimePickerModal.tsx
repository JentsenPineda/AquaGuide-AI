import React from "react";
import { TimePickerModal } from "react-native-paper-dates";

type Props = {
  visible: boolean;
  hours: number;
  minutes: number;
  onDismiss: () => void;
  onConfirm: (hours: number, minutes: number) => void;
};

export default function ReminderTimePickerModal({
  visible,
  hours,
  minutes,
  onDismiss,
  onConfirm,
}: Props) {
  return (
    <TimePickerModal
      visible={visible}
      onDismiss={onDismiss}
      onConfirm={({ hours, minutes }) => onConfirm(hours, minutes)}
      hours={hours}
      minutes={minutes}
      use24HourClock={false}
      animationType="fade"
      locale="en"
      cancelLabel="Cancel"
      confirmLabel="Done"
    />
  );
}
