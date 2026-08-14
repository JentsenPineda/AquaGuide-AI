import AppHeader from "@/components/layout/AppHeader";
import AvatarPicker from "@/components/profile/AvatarPicker";
import { AvatarId, getAvatarSource } from "@/constants/avatar";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { subscribeToLogs } from "../../services/logbookService";
import { subscribeToReminders } from "../../services/reminderService";

function SettingItem({
  icon,
  title,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  onPress?: () => void;
}) {
  const colors = useAppColors();
  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        {
          borderBottomColor: colors.border,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={colors.primary} />
        <Text
          style={[
            styles.settingText,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {title}
        </Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}
export default function ProfileScreen() {
  const { user, logout } = useAuth();
  useEffect(() => {
    if (!user) {
      router.replace({
        pathname: "/auth/login",
        params: {
          redirect: "profile",
        },
      });
    }
  }, [user]);

  const colors = useAppColors();

  const [reminderCount, setReminderCount] = useState(0);
  const [logCount, setLogCount] = useState(0);
  const [displayName, setDisplayName] = useState("");
  const [editing, setEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>("avatar1");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadAvatar = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem(
          `aquaguide_avatar_${user.uid}`,
        );

        if (savedAvatar) {
          setSelectedAvatar(savedAvatar as AvatarId);
        }
      } catch (error) {
        console.log("Failed to load avatar:", error);
      }
    };

    loadAvatar();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    setDisplayName(user.displayName || "");
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const unsubscribeReminders = subscribeToReminders(user.uid, (reminders) => {
      console.log("Profile reminders:", reminders.length);
      setReminderCount(reminders.length);
    });

    const unsubscribeLogs = subscribeToLogs(user.uid, (logs) => {
      console.log("Profile logs:", logs.length);
      setLogCount(logs.length);
    });

    return () => {
      unsubscribeReminders();
      unsubscribeLogs();
    };
  }, [user]);
  if (!user) {
    return null;
  }
  const saveDisplayName = async () => {
    if (!user) return;

    try {
      const newName = displayName.trim();

      await updateProfile(user, {
        displayName: newName,
      });

      await user.reload();

      setDisplayName(newName);
      setEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Profile" showBack />

      <ScrollView
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <Image
              source={getAvatarSource(selectedAvatar)}
              style={styles.avatar}
              resizeMode="cover"
            />

            <TouchableOpacity
              style={styles.cameraButton}
              onPress={() => setShowAvatarPicker(true)}
            >
              <Ionicons name="pencil" size={19} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text
            style={[
              styles.name,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            {displayName || "AquaGuide User"}
          </Text>

          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Coming Soon",
                "Editing profile name will be available in the next update.",
              )
            }
          ></TouchableOpacity>

          <Text
            style={[
              styles.email,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            {user.email}
          </Text>

          <View
            style={[
              styles.badge,
              {
                backgroundColor: colors.success + "20",
              },
            ]}
          >
            <Ionicons name="cloud-done" size={16} color={colors.success} />
            <Text
              style={[
                styles.badgeText,
                {
                  color: colors.success,
                },
              ]}
            >
              Cloud Sync
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <View
          style={[
            styles.statsContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Your Statistics
          </Text>

          <View style={styles.stats}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={28}
                color="#00BCD4"
              />
              <Text
                style={[
                  styles.number,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {reminderCount}
              </Text>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Reminders
              </Text>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  borderWidth: 1,
                },
              ]}
            >
              <Ionicons name="book-outline" size={28} color="#00BCD4" />
              <Text
                style={[
                  styles.number,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {logCount}
              </Text>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Logbooks
              </Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={[
              styles.settingsTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Settings
          </Text>

          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            onPress={() => router.push("/profile/notifications")}
          />

          <SettingItem
            icon="key"
            title="Change Password"
            onPress={() => router.push("/profile/change-password")}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: colors.danger,
            },
          ]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <AvatarPicker
        visible={showAvatarPicker}
        selectedAvatar={selectedAvatar}
        onSelect={async (avatarId) => {
          try {
            await AsyncStorage.setItem(
              `aquaguide_avatar_${user?.uid}`,
              avatarId,
            );

            setSelectedAvatar(avatarId);
            setShowAvatarPicker(false);
          } catch (error) {
            console.log("Failed to save avatar:", error);
          }
        }}
        onClose={() => setShowAvatarPicker(false)}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    padding: 20,
  },

  header: {
    alignItems: "center",
    marginTop: 25,
    marginBottom: 35,
    borderRadius: 24,
    padding: 24,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 15,
    color: "#111827",
  },

  email: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 5,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 15,
  },

  badgeText: {
    marginLeft: 6,
    color: "#166534",
    fontWeight: "600",
  },

  number: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 8,
    color: "#111827",
  },

  label: {
    color: "#6B7280",
    marginTop: 5,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },

  input: {
    width: "90%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 15,
    fontSize: 16,
  },

  editButtons: {
    flexDirection: "row",
    marginTop: 12,
  },

  saveButton: {
    backgroundColor: "#00BCD4",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  cancelButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },

  saveButtonText: {
    color: "#fff",
    fontWeight: "700",
  },

  cancelButtonText: {
    color: "#374151",
    fontWeight: "700",
  },

  editName: {
    color: "#00BCD4",
    marginTop: 8,
    fontWeight: "600",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 8,
    marginBottom: 25,
    elevation: 2,
  },

  settingsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },

  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  settingText: {
    marginLeft: 14,
    fontSize: 16,
    color: "#374151",
  },

  content: {
    padding: 20,
    paddingBottom: TAB_BAR_HEIGHT,
    flexGrow: 1,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },

  statsContainer: {
    marginBottom: 25,
    borderRadius: 22,
    padding: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  card: {
    flex: 1,
    borderRadius: 18,
    paddingVertical: 26,
    marginHorizontal: 6,
    alignItems: "center",
  },

  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#00BCD4",
    backgroundColor: "#E5E7EB",
    transform: [{ scale: 1.18 }],
  },

  logoutButton: {
    borderRadius: 18,
    height: 58,
    marginTop: 10,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 15,
  },

  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
    elevation: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  avatarModal: {
    borderRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
  },

  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },

  avatarOption: {
    width: "23%",
    aspectRatio: 1,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  avatarOptionImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },

  selectedCheck: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
});
