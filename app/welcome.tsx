import AppHeader from "@/components/layout/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <AppHeader
        title="Welcome"
        subtitle="Welcome to AquaGuide AI"
        variant="light"
      />

      <View style={styles.content}>
        <Ionicons
          name="fish"
          size={90}
          color="#00BCD4"
          style={{ marginBottom: 25 }}
        />

        <Text style={styles.title}>AquaGuide AI</Text>

        <Text style={styles.subtitle}>
          Your intelligent companion for ornamental fish keeping.
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push("/auth/register")}
        >
          <Text style={styles.registerText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    padding: 24,
  },

  title: {
    textAlign: "center",
    fontSize: 34,
    fontWeight: "800",
    color: "#003B57",
  },

  subtitle: {
    textAlign: "center",
    marginTop: 12,
    color: "#607D8B",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 40,
  },

  loginButton: {
    backgroundColor: "#00BCD4",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },

  registerButton: {
    marginTop: 16,
    borderWidth: 2,
    borderColor: "#00BCD4",
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  registerText: {
    color: "#00BCD4",
    fontWeight: "700",
    fontSize: 18,
  },

  guestText: {
    marginTop: 28,
    textAlign: "center",
    color: "#607D8B",
    fontSize: 16,
    fontWeight: "700",
  },
});
