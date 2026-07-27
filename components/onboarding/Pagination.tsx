import React from "react";
import { StyleSheet, View } from "react-native";

import { useAppColors } from "@/theme/useAppColors";

interface Props {
  currentIndex: number;
  total: number;
}

export default function Pagination({ currentIndex, total }: Props) {
  const colors = useAppColors();

  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index === currentIndex ? colors.primary : colors.border,
              width: index === currentIndex ? 28 : 10,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 24,
  },

  dot: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
