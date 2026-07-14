import { ScrollView, StyleSheet, View } from "react-native";

import ModuleCard from "@/components/cards/ModuleCard";
import AppHeader from "@/components/layout/AppHeader";

export default function MenuScreen() {
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
          route="/settings"
          iconColor="#607D8B"
          iconBackground="#ECEFF1"
        />

        <ModuleCard
          title="About"
          subtitle="Learn more about AquaGuide AI"
          icon="information-circle-outline"
          route="/about"
          iconColor="#9C27B0"
          iconBackground="#F3E5F5"
        />

        <ModuleCard
          title="Logout"
          subtitle="Sign out from your account"
          icon="log-out-outline"
          route="/logout"
          iconColor="#F44336"
          iconBackground="#FFEBEE"
        />
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
