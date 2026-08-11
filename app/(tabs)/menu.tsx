import ModuleCard from "@/components/cards/ModuleCard";
import AppHeader from "@/components/layout/AppHeader";

import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";
import { Alert, StyleSheet, View } from "react-native";

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
              router.replace("/(tabs)/menu");
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
      <AppHeader title="Menu" />

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.cardWrapper}>
            <ModuleCard
              title="Profile"
              subtitle="Your account"
              icon="person-circle-outline"
              route="/profile"
              iconColor="#2196F3"
              iconBackground="#E3F2FD"
            />
          </View>

          <View style={styles.cardWrapper}>
            <ModuleCard
              title="Reminder"
              subtitle="Care schedules"
              icon="alarm-outline"
              route="/reminder"
              iconColor="#FF9800"
              iconBackground="#FFF3E0"
            />
          </View>
        </View>

        {/* ROW 2 */}
        <View style={styles.row}>
          <View style={styles.cardWrapper}>
            <ModuleCard
              title="Care Logbook"
              subtitle="Fish history"
              icon="book-outline"
              route="/logbook"
              iconColor="#4CAF50"
              iconBackground="#E8F5E9"
            />
          </View>

          <View style={styles.cardWrapper}>
            <ModuleCard
              title="Settings"
              subtitle="Customize app"
              icon="settings-outline"
              route="/profile/dark-mode"
              iconColor="#607D8B"
              iconBackground="#ECEFF1"
            />
          </View>
        </View>

        {/* ROW 3 */}
        <View style={styles.row}>
          <View style={styles.cardWrapper}>
            <ModuleCard
              title="About"
              subtitle="About AquaGuide AI"
              icon="information-circle-outline"
              route="/profile/about"
              iconColor="#9C27B0"
              iconBackground="#F3E5F5"
            />
          </View>

          <View style={styles.cardWrapper}>
            <ModuleCard
              title="Privacy Policy"
              subtitle="Your privacy"
              icon="shield-checkmark-outline"
              route="/profile/privacy-policy"
              iconColor="#3F51B5"
              iconBackground="#E8EAF6"
            />
          </View>
        </View>

        {/* LOGGED IN / LOGGED OUT */}
        {user ? (
          <View style={styles.fullWidthCard}>
            <ModuleCard
              title="Logout"
              subtitle="Sign out from your account"
              icon="log-out-outline"
              onPress={handleLogout}
              iconColor="#F44336"
              iconBackground="#FFEBEE"
            />
          </View>
        ) : (
          <View style={styles.row}>
            <View style={styles.cardWrapper}>
              <ModuleCard
                title="Login"
                subtitle="Sign in"
                icon="log-in-outline"
                route="/auth/login"
                iconColor="#00BCD4"
                iconBackground="#E8FAFD"
              />
            </View>

            <View style={styles.cardWrapper}>
              <ModuleCard
                title="Create Account"
                subtitle="Register"
                icon="person-add-outline"
                route="/auth/register"
                iconColor="#4CAF50"
                iconBackground="#E8F5E9"
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 20,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  cardWrapper: {
    width: "49%",
  },

  fullWidthCard: {
    width: "100%",
    marginTop: 2,
  },
});
