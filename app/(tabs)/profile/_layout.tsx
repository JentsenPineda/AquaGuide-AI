import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: "#00BCD4",
        headerBackButtonDisplayMode: "minimal",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="about"
        options={{
          title: "About AquaGuide AI",
        }}
      />

      <Stack.Screen
        name="notifications"
        options={{
          title: "Notifications",
        }}
      />

      <Stack.Screen
        name="privacy-policy"
        options={{
          title: "Privacy Policy",
        }}
      />

      <Stack.Screen
        name="change-password"
        options={{
          title: "Change Password",
        }}
      />

      <Stack.Screen
        name="dark-mode"
        options={{
          title: "Dark Mode",
        }}
      />
    </Stack>
  );
}
