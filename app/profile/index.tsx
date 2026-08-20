import AppHeader from "@/components/layout/AppHeader";
import AvatarPicker from "@/components/profile/AvatarPicker";
import { AvatarId, getAvatarSource } from "@/constants/avatar";
import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { updateProfile } from "firebase/auth";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import {
  deleteCurrentUserAccount,
  reauthenticateCurrentUser,
} from "../../services/authService";
import { subscribeToLogs } from "../../services/logbookService";
import { subscribeToReminders } from "../../services/reminderService";

type SettingItemProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

function SettingItem({ icon, title, subtitle, onPress }: SettingItemProps) {
  const colors = useAppColors();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [
        styles.settingItem,
        {
          borderBottomColor: colors.border,
          opacity: pressed && onPress ? 0.75 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.settingIcon,
          {
            backgroundColor: colors.primary + "12",
          },
        ]}
      >
        <Ionicons name={icon} size={21} color={colors.primary} />
      </View>

      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingTitle,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.settingSubtitle,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          {subtitle}
        </Text>
      </View>

      {onPress && (
        <Ionicons
          name="chevron-forward"
          size={19}
          color={colors.textSecondary}
        />
      )}
    </Pressable>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
}) {
  const colors = useAppColors();

  return (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.statIcon,
          {
            backgroundColor: colors.primary + "12",
          },
        ]}
      >
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>

      <Text
        style={[
          styles.statNumber,
          {
            color: colors.textPrimary,
          },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.statLabel,
          {
            color: colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useAppColors();
  const { user, loading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [reminderCount, setReminderCount] = useState(0);
  const [showDeletePasswordModal, setShowDeletePasswordModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [logCount, setLogCount] = useState(0);

  const [displayName, setDisplayName] = useState("");

  const [editing, setEditing] = useState(false);
  const [savingName, setSavingName] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState<AvatarId>("avatar1");

  const [hasSavedAvatar, setHasSavedAvatar] = useState(false);

  // FIX: Avatar picker state
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    if (!loading && !user && !isLoggingOut) {
      router.replace({
        pathname: "/auth/login",
        params: {
          redirect: "profile",
        },
      });
    }
  }, [loading, user, isLoggingOut]);

  useEffect(() => {
    if (!user) return;

    const loadAvatar = async () => {
      try {
        const savedAvatar = await AsyncStorage.getItem(
          `aquaguide_avatar_${user.uid}`,
        );

        if (savedAvatar) {
          setSelectedAvatar(savedAvatar as AvatarId);
          setHasSavedAvatar(true);
        } else {
          setSelectedAvatar("avatar1");
          setHasSavedAvatar(false);
        }
      } catch (error) {
        console.log("Failed to load avatar:", error);

        setSelectedAvatar("avatar1");
        setHasSavedAvatar(false);
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
      setReminderCount(reminders.length);
    });

    const unsubscribeLogs = subscribeToLogs(user.uid, (logs) => {
      setLogCount(logs.length);
    });

    return () => {
      unsubscribeReminders();
      unsubscribeLogs();
    };
  }, [user]);

  const greetingName = useMemo(() => {
    if (!displayName.trim()) {
      return "AquaGuide User";
    }

    return displayName.trim().split(" ")[0];
  }, [displayName]);

  if (loading || !user) {
    return (
      <View
        style={[
          styles.loadingScreen,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const saveDisplayName = async () => {
    if (!user) return;

    const newName = displayName.trim();

    if (!newName) {
      Alert.alert("Name Required", "Please enter a name before saving.");
      return;
    }

    try {
      setSavingName(true);

      await updateProfile(user, {
        displayName: newName,
      });

      await user.reload();

      setDisplayName(newName);
      setEditing(false);
    } catch (error) {
      console.log("Failed to update profile:", error);

      Alert.alert(
        "Unable to Update Profile",
        "We couldn't save your name. Please try again.",
      );
    } finally {
      setSavingName(false);
    }
  };

  const cancelEditing = () => {
    setDisplayName(user.displayName || "");
    setEditing(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logout();

      router.replace("/(tabs)/menu");
    } catch (error) {
      setIsLoggingOut(false);

      console.log("Logout Error:", error);

      Alert.alert(
        "Logout Failed",
        "We couldn't log you out. Please try again.",
      );
    }
  };

  const handleDeleteAccount = () => {
    if (!user) return;

    Alert.alert(
      "Delete Account?",
      "This will permanently delete your AquaGuide AI account and associated fishkeeping data. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Continue",
          onPress: () => {
            setDeletePassword("");
            setShowDeletePasswordModal(true);
          },
        },
      ],
    );
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
        style={styles.container}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom: TAB_BAR_HEIGHT + 30,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* PROFILE HEADER */}

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatarRing,
                {
                  borderColor: colors.primary,
                  backgroundColor: colors.background,
                },
              ]}
            >
              <Image
                source={
                  hasSavedAvatar
                    ? getAvatarSource(selectedAvatar)
                    : require("@/assets/images/Avatar Image/blank-avatar.png")
                }
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>

            <Pressable
              onPress={() => setShowAvatarPicker(true)}
              hitSlop={6}
              style={({ pressed }) => [
                styles.cameraButton,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.card,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Ionicons name="camera-outline" size={18} color="#FFFFFF" />
            </Pressable>
          </View>

          {!editing ? (
            <>
              <Text
                numberOfLines={1}
                style={[
                  styles.profileName,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {displayName || "AquaGuide User"}
              </Text>

              <Pressable
                onPress={() => setEditing(true)}
                style={styles.editProfileButton}
              >
                <Ionicons
                  name="create-outline"
                  size={15}
                  color={colors.primary}
                />

                <Text
                  style={[
                    styles.editProfileText,
                    {
                      color: colors.primary,
                    },
                  ]}
                >
                  Edit Name
                </Text>
              </Pressable>
            </>
          ) : (
            <View style={styles.editContainer}>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.nameInput,
                  {
                    color: colors.textPrimary,
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
                autoCapitalize="words"
                editable={!savingName}
                returnKeyType="done"
                onSubmitEditing={saveDisplayName}
              />

              <View style={styles.editButtons}>
                <Pressable
                  onPress={cancelEditing}
                  disabled={savingName}
                  style={[
                    styles.cancelButton,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.cancelButtonText,
                      {
                        color: colors.textSecondary,
                      },
                    ]}
                  >
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  onPress={saveDisplayName}
                  disabled={savingName}
                  style={[
                    styles.saveButton,
                    {
                      backgroundColor: colors.primary,
                      opacity: savingName ? 0.7 : 1,
                    },
                  ]}
                >
                  {savingName ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={17} color="#FFFFFF" />

                      <Text style={styles.saveButtonText}>Save</Text>
                    </>
                  )}
                </Pressable>
              </View>
            </View>
          )}

          <Text
            numberOfLines={1}
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
              styles.syncBadge,
              {
                backgroundColor: colors.success + "15",
                borderColor: colors.success + "30",
              },
            ]}
          >
            <Ionicons
              name="cloud-done-outline"
              size={15}
              color={colors.success}
            />

            <Text
              style={[
                styles.syncBadgeText,
                {
                  color: colors.success,
                },
              ]}
            >
              Cloud Sync Active
            </Text>
          </View>
        </View>

        {/* QUICK STATS */}

        <View style={styles.sectionHeading}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Your Activity
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Your saved fishkeeping activity
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon="notifications-outline"
            value={reminderCount}
            label="Reminders"
          />

          <StatCard
            icon="book-outline"
            value={logCount}
            label="Logbook Entries"
          />
        </View>

        {/* ACCOUNT SETTINGS */}

        <View style={styles.sectionHeading}>
          <View>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Account
            </Text>

            <Text
              style={[
                styles.sectionSubtitle,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Manage your AquaGuide AI account
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.settingsCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <SettingItem
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your reminder notifications"
            onPress={() => router.push("/profile/notifications")}
          />

          <SettingItem
            icon="key-outline"
            title="Change Password"
            subtitle="Update your account password"
            onPress={() => router.push("/profile/change-password")}
          />

          <SettingItem
            icon="trash-outline"
            title="Delete Account"
            subtitle="Permanently delete your account and data"
            onPress={handleDeleteAccount}
          />
        </View>

        {/* SECURITY INFORMATION */}

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.infoIcon,
              {
                backgroundColor: colors.primary + "12",
              },
            ]}
          >
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color={colors.primary}
            />
          </View>

          <View style={styles.infoContent}>
            <Text
              style={[
                styles.infoTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Account Security
            </Text>

            <Text
              style={[
                styles.infoText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Your profile and fishkeeping data are synced securely with your
              account.
            </Text>
          </View>
        </View>

        {/* LOGOUT */}

        <Pressable
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={({ pressed }) => [
            styles.logoutButton,
            {
              backgroundColor: colors.danger,
              opacity: pressed || isLoggingOut ? 0.75 : 1,
            },
          ]}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={21} color="#FFFFFF" />

              <Text style={styles.logoutText}>Log Out</Text>
            </>
          )}
        </Pressable>
      </ScrollView>

      {/* AVATAR PICKER */}

      <AvatarPicker
        visible={showAvatarPicker}
        selectedAvatar={selectedAvatar}
        onSelect={async (avatarId) => {
          try {
            if (!user) return;

            await AsyncStorage.setItem(
              `aquaguide_avatar_${user.uid}`,
              avatarId,
            );

            setSelectedAvatar(avatarId);
            setHasSavedAvatar(true);
            setShowAvatarPicker(false);
          } catch (error) {
            console.log("Failed to save avatar:", error);

            Alert.alert("Unable to Save Avatar", "Please try again.");
          }
        }}
        onClose={() => setShowAvatarPicker(false)}
        colors={colors}
      />

      <Modal
        visible={showDeletePasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeletingAccount) {
            setShowDeletePasswordModal(false);
            setDeletePassword("");
          }
        }}
      >
        <View style={styles.deleteModalOverlay}>
          <View
            style={[
              styles.deleteModalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <View
              style={[
                styles.deleteModalIcon,
                {
                  backgroundColor: colors.danger + "15",
                },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color={colors.danger}
              />
            </View>

            <Text
              style={[
                styles.deleteModalTitle,
                {
                  color: colors.textPrimary,
                },
              ]}
            >
              Confirm Your Password
            </Text>

            <Text
              style={[
                styles.deleteModalMessage,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Enter your current password to permanently delete your account.
            </Text>

            <TextInput
              value={deletePassword}
              onChangeText={setDeletePassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isDeletingAccount}
              style={[
                styles.deletePasswordInput,
                {
                  color: colors.textPrimary,
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            />

            <View style={styles.deleteModalButtons}>
              <Pressable
                disabled={isDeletingAccount}
                onPress={() => {
                  setShowDeletePasswordModal(false);
                  setDeletePassword("");
                }}
                style={[
                  styles.deleteCancelButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.deleteCancelText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                disabled={isDeletingAccount}
                onPress={async () => {
                  if (!deletePassword.trim()) {
                    Alert.alert(
                      "Password Required",
                      "Please enter your password to continue.",
                    );
                    return;
                  }

                  try {
                    setIsDeletingAccount(true);

                    await reauthenticateCurrentUser(deletePassword);
                    await deleteCurrentUserAccount();

                    setShowDeletePasswordModal(false);
                    setDeletePassword("");

                    Alert.alert(
                      "Account Deleted",
                      "Your AquaGuide AI account and associated data have been deleted.",
                      [
                        {
                          text: "OK",
                          onPress: () => router.replace("/"),
                        },
                      ],
                    );
                  } catch (error: any) {
                    console.error("Delete Account Error:", error);

                    if (
                      error?.code === "auth/wrong-password" ||
                      error?.code === "auth/invalid-credential"
                    ) {
                      Alert.alert(
                        "Incorrect Password",
                        "The password you entered is incorrect. Please try again.",
                      );
                    } else {
                      Alert.alert(
                        "Unable to Delete Account",
                        "We couldn't delete your account. Please try again.",
                      );
                    }
                  } finally {
                    setIsDeletingAccount(false);
                  }
                }}
                style={[
                  styles.deleteConfirmButton,
                  {
                    backgroundColor: colors.danger,
                    opacity: isDeletingAccount ? 0.7 : 1,
                  },
                ]}
              >
                {isDeletingAccount ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.deleteConfirmText}>Delete Account</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  loadingScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },

  /* PROFILE */

  profileCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 9,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  avatarContainer: {
    position: "relative",
    marginBottom: 13,
  },

  avatarRing: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  cameraButton: {
    position: "absolute",

    right: -1,
    bottom: 1,

    width: 36,
    height: 36,

    borderRadius: 18,

    borderWidth: 3,

    justifyContent: "center",
    alignItems: "center",

    elevation: 4,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  profileName: {
    maxWidth: "90%",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
  },

  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",

    paddingVertical: 5,
    paddingHorizontal: 8,

    marginTop: 3,
  },

  editProfileText: {
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 4,
  },

  email: {
    maxWidth: "92%",
    fontSize: 13,
    marginTop: 4,
    textAlign: "center",
  },

  syncBadge: {
    flexDirection: "row",
    alignItems: "center",

    borderRadius: 20,
    borderWidth: 1,

    paddingHorizontal: 11,
    paddingVertical: 6,

    marginTop: 12,
  },

  syncBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    marginLeft: 5,
  },

  /* EDIT NAME */

  editContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 2,
  },

  nameInput: {
    width: "100%",

    height: 48,

    borderRadius: 14,
    borderWidth: 1,

    paddingHorizontal: 13,

    fontSize: 15,

    textAlign: "center",
  },

  editButtons: {
    flexDirection: "row",
    marginTop: 9,
  },

  cancelButton: {
    height: 40,

    paddingHorizontal: 15,

    borderRadius: 12,
    borderWidth: 1,

    justifyContent: "center",
    alignItems: "center",

    marginRight: 7,
  },

  cancelButtonText: {
    fontSize: 12,
    fontWeight: "800",
  },

  saveButton: {
    minWidth: 78,
    height: 40,

    paddingHorizontal: 15,

    borderRadius: 12,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",
  },

  saveButtonText: {
    color: "#FFFFFF",

    fontSize: 12,
    fontWeight: "800",

    marginLeft: 4,
  },

  /* SECTIONS */

  sectionHeading: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
  },

  sectionSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  /* STATS */

  statsRow: {
    flexDirection: "row",
    marginHorizontal: -5,
    marginBottom: 24,
  },

  statCard: {
    flex: 1,

    minHeight: 128,

    borderRadius: 19,
    borderWidth: 1,

    padding: 14,

    marginHorizontal: 5,

    alignItems: "center",
    justifyContent: "center",
  },

  statIcon: {
    width: 43,
    height: 43,

    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",
  },

  statNumber: {
    fontSize: 23,
    fontWeight: "900",
    marginTop: 7,
  },

  statLabel: {
    fontSize: 11,
    marginTop: 2,
    textAlign: "center",
  },

  /* SETTINGS */

  settingsCard: {
    borderRadius: 20,
    borderWidth: 1,

    overflow: "hidden",

    marginBottom: 14,
  },

  settingItem: {
    minHeight: 72,

    paddingHorizontal: 14,
    paddingVertical: 11,

    flexDirection: "row",
    alignItems: "center",

    borderBottomWidth: 1,
  },

  settingIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  settingContent: {
    flex: 1,

    marginLeft: 11,
    marginRight: 8,
  },

  settingTitle: {
    fontSize: 14,
    fontWeight: "800",
  },

  settingSubtitle: {
    fontSize: 10,
    marginTop: 3,
  },

  /* INFO */

  infoCard: {
    borderRadius: 18,
    borderWidth: 1,

    padding: 13,

    flexDirection: "row",
    alignItems: "center",

    marginBottom: 14,
  },

  infoIcon: {
    width: 42,
    height: 42,

    borderRadius: 13,

    justifyContent: "center",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 10,
  },

  infoTitle: {
    fontSize: 13,
    fontWeight: "800",
  },

  infoText: {
    fontSize: 10,
    lineHeight: 16,
    marginTop: 3,
  },

  /* LOGOUT */

  logoutButton: {
    height: 55,

    borderRadius: 17,

    justifyContent: "center",
    alignItems: "center",

    flexDirection: "row",

    marginBottom: 20,

    elevation: 2,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 7,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  logoutText: {
    color: "#FFFFFF",

    fontSize: 15,
    fontWeight: "800",

    marginLeft: 7,
  },

  deleteModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  deleteModalCard: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 22,
    borderWidth: 1,
    padding: 22,
  },

  deleteModalIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 14,
  },

  deleteModalTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },

  deleteModalMessage: {
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
    marginBottom: 18,
  },

  deletePasswordInput: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 14,
  },

  deleteModalButtons: {
    flexDirection: "row",
    marginTop: 14,
  },

  deleteCancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  deleteCancelText: {
    fontSize: 13,
    fontWeight: "800",
  },

  deleteConfirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },

  deleteConfirmText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
});
