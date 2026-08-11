import { useAppColors } from "@/theme/useAppColors";
import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  rightComponent?: ReactNode;
  children: ReactNode;
};

export default function SectionCard({
  title,
  subtitle,
  rightComponent,
  children,
}: SectionCardProps) {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {title}
          </Text>

          {subtitle ? (
            <Text
              style={[
                styles.subtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightComponent}
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    elevation: 2,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  titleContainer: {
    flex: 1,
    marginRight: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 18,
  },

  content: {
    gap: 12,
  },
});
