import React from "react";
import { DatePickerModal } from "react-native-paper-dates";

type Props = {
  visible: boolean;
  date: Date;
  onDismiss: () => void;
  onConfirm: (date: Date) => void;
};

export default function ReminderDatePickerModal({
  visible,
  date,
  onDismiss,
  onConfirm,
}: Props) {
  return (
    <DatePickerModal
      locale="en"
      mode="single"
      visible={visible}
      date={date}
      onDismiss={onDismiss}
      onConfirm={({ date }) => {
        if (date) {
          onConfirm(date);
        }
      }}
      saveLabel="Done"
      label="Select Date"
    />
  );
}
