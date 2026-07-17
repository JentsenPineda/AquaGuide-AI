import ModuleCard from "@/components/cards/ModuleCard";
import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, View } from "react-native";

export default function MenuScreen() {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to sign out of AquaGuide AI?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logout();

              router.dismissAll();

              router.navigate("/(tabs)/menu");
            } catch {
              Alert.alert("Error", "Unable to logout.");
            }
          },
        },
      ],
    );
  };
  return (
    <View style={styles.container}>
      <AppHeader title="Menu" subtitle="Manage your account and application" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <ModuleCard
          title="Profile"
          subtitle="View and edit your account"
          icon="person-circle-outline"
          route="/profile"
          iconColor="#2196F3"
          iconBackground="#E3F2FD"
        />

        <ModuleCard
          title="Reminder"
          subtitle="Manage upcoming care schedules"
          icon="alarm-outline"
          route="/reminder"
          iconColor="#FF9800"
          iconBackground="#FFF3E0"
        />

        <ModuleCard
          title="Care Logbook"
          subtitle="View your fish care history"
          icon="book-outline"
          route="/logbook"
          iconColor="#4CAF50"
          iconBackground="#E8F5E9"
        />

        <ModuleCard
          title="Settings"
          subtitle="Customize AquaGuide AI"
          icon="settings-outline"
          route="/profile/dark-mode"
          iconColor="#607D8B"
          iconBackground="#ECEFF1"
        />

        <ModuleCard
          title="About"
          subtitle="Learn more about AquaGuide AI"
          icon="information-circle-outline"
          route="/profile/about"
          iconColor="#9C27B0"
          iconBackground="#F3E5F5"
        />

        {user ? (
          <ModuleCard
            title="Logout"
            subtitle="Sign out from your account"
            icon="log-out-outline"
            onPress={handleLogout}
            iconColor="#F44336"
            iconBackground="#FFEBEE"
          />
        ) : (
          <>
            <ModuleCard
              title="Login"
              subtitle="Sign in to access reminders and logbook"
              icon="log-in-outline"
              route="/auth/login"
              iconColor="#00BCD4"
              iconBackground="#E8FAFD"
            />

            <ModuleCard
              title="Create Account"
              subtitle="Register a new AquaGuide AI account"
              icon="person-add-outline"
              route="/auth/register"
              iconColor="#4CAF50"
              iconBackground="#E8F5E9"
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
  },
});
