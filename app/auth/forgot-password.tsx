import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function ForgotPasswordScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Forgot Password" }} />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Coming Soon</Text>

          <Text style={styles.subtitle}>
            Forgot Password will be available in a future update.
          </Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2FBFD",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#003B57",
  },

  subtitle: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 16,
    color: "#607D8B",
  },
});
