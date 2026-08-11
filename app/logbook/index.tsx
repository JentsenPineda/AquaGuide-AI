import AppHeader from "@/components/layout/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { deleteLog, LogItem, subscribeToLogs } from "@/services/logbookService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const activityConfig = {
  Feeding: {
    icon: "restaurant-outline",
    color: "#F59E0B",
  },

  "Water Change": {
    icon: "water-outline",
    color: "#3B82F6",
  },

  "Water Test": {
    icon: "flask-outline",
    color: "#8B5CF6",
  },

  Medication: {
    icon: "medical-outline",
    color: "#EF4444",
  },

  Cleaning: {
    icon: "sparkles-outline",
    color: "#06B6D4",
  },

  "Plant Care": {
    icon: "leaf-outline",
    color: "#22C55E",
  },

  "New Fish": {
    icon: "fish-outline",
    color: "#0EA5E9",
  },

  Observation: {
    icon: "eye-outline",
    color: "#F97316",
  },
} as const;

const formatLogDate = (dateString: string) => {
  const date = new Date(dateString);

  const today = new Date();
  const yesterday = new Date();

  yesterday.setDate(today.getDate() - 1);

  const isToday = date.toDateString() === today.toDateString();
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) {
    return `Today • ${time}`;
  }

  if (isYesterday) {
    return `Yesterday • ${time}`;
  }

  return (
    date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) + ` • ${time}`
  );
};

export default function LogbookScreen() {
  const { user } = useAuth();
  const colors = useAppColors();

  const [logs, setLogs] = useState<LogItem[]>([]);

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const firstName = user?.displayName?.trim().split(" ")[0] || "Aquarist";

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToLogs(user.uid, (updatedLogs) => {
      console.log("ALL LOGS:", updatedLogs);
      setLogs(updatedLogs);
    });

    return unsubscribe;
  }, [user]);

  const handleDelete = (log: LogItem) => {
    if (!user) return;

    Alert.alert("Delete Log", `Delete "${log.type}" log?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteLog(user.uid, log.id);
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (!user) {
      router.replace({
        pathname: "/auth/login",
        params: {
          redirect: "logbook",
        },
      });
    }
  }, [user]);

  if (!user) {
    return (
      <View
        style={[
          styles.loginContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <Ionicons name="lock-closed" size={48} color={colors.primary} />

        <Text
          style={[
            styles.loginText,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          Redirecting to login...
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.screen,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Logbook" showBack />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO */}
        <View style={styles.heroCard}>
          <Text style={styles.heroGreeting}>{greeting}</Text>

          <Text style={styles.heroName}>{firstName}</Text>

          <View style={styles.heroStats}>
            <Text style={styles.heroCount}>{logs.length}</Text>

            <Text style={styles.heroCountLabel}>Total Log Entries</Text>
          </View>

          <View style={styles.heroDivider} />

          <Text style={styles.nextLabel}>Latest Activity</Text>

          {logs.length > 0 ? (
            <>
              <Text style={styles.nextTitle}>{logs[0].type}</Text>

              <Text style={styles.nextTime}>
                {new Date(logs[0].date).toLocaleString()}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.nextTitle}>No logs yet</Text>

              <Text style={styles.nextTime}>
                Start recording your aquarium care.
              </Text>
            </>
          )}
        </View>

        {/* RECENT ACTIVITY */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Recent Activity
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Your aquarium care history will appear here.
          </Text>

          {logs.length === 0 ? (
            <View
              style={[
                styles.emptyCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={styles.emptyEmoji}>📖</Text>

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Your aquarium journal starts here
              </Text>

              <Text
                style={[
                  styles.emptyDescription,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Record feedings, water changes, treatments, maintenance, and
                observations to build your aquarium care history.
              </Text>

              <TouchableOpacity
                style={styles.createButton}
                activeOpacity={0.9}
                onPress={() => router.push("/logbook/create")}
              >
                <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />

                <Text style={styles.createButtonText}>Create First Log</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              {logs.map((log) => {
                const activity =
                  activityConfig[log.type as keyof typeof activityConfig];

                const accentColor = activity?.color ?? colors.primary;

                return (
                  <TouchableOpacity
                    key={log.id}
                    style={[
                      styles.logCard,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                      },
                    ]}
                    activeOpacity={0.9}
                    onLongPress={() => handleDelete(log)}
                  >
                    <View
                      style={[
                        styles.logIcon,
                        {
                          backgroundColor: `${accentColor}15`,
                        },
                      ]}
                    >
                      <Ionicons
                        name={activity?.icon ?? "book-outline"}
                        size={20}
                        color={accentColor}
                      />
                    </View>

                    <View style={styles.logHeader}>
                      <View style={styles.logInfo}>
                        <Text
                          style={[
                            styles.logTitle,
                            {
                              color: colors.textPrimary,
                            },
                          ]}
                        >
                          {log.type}
                        </Text>

                        <Text
                          style={[
                            styles.logDate,
                            {
                              color: colors.textSecondary,
                            },
                          ]}
                        >
                          {formatLogDate(log.date)}
                        </Text>
                      </View>
                    </View>

                    {log.note ? (
                      <Text
                        style={[
                          styles.logNote,
                          {
                            color: colors.textSecondary,
                          },
                        ]}
                      >
                        {log.note}
                      </Text>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => router.push("/logbook/create")}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    marginTop: 16,
    fontSize: 16,
  },

  /* HERO */

  heroCard: {
    backgroundColor: "#0EA5E9",
    borderRadius: 24,
    padding: 24,
  },

  heroGreeting: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.82)",
  },

  heroName: {
    marginTop: 4,
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  heroStats: {
    marginTop: 24,
  },

  heroCount: {
    fontSize: 58,
    fontWeight: "900",
    color: "#FFFFFF",
    lineHeight: 60,
  },

  heroCountLabel: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },

  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 22,
  },

  nextLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.75)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  nextTitle: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  nextTime: {
    marginTop: 8,
    fontSize: 16,
    color: "rgba(255,255,255,0.92)",
  },

  /* RECENT ACTIVITY */

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  sectionSubtitle: {
    marginTop: 6,
    fontSize: 15,
  },

  /* EMPTY STATE */

  emptyCard: {
    marginTop: 18,
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
  },

  emptyEmoji: {
    fontSize: 46,
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "700",
  },

  emptyDescription: {
    marginTop: 10,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  /* LOG CARD */

  logCard: {
    borderRadius: 20,
    padding: 18,
    marginTop: 14,
    borderWidth: 1,
  },

  logHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  logIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },

  logInfo: {
    flex: 1,
    marginLeft: 14,
  },

  logTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  logDate: {
    marginTop: 4,
    fontSize: 13,
  },

  logNote: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
  },

  /* BUTTONS */

  createButton: {
    marginTop: 24,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#00BCD4",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
  },

  createButtonText: {
    marginLeft: 8,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  fab: {
    position: "absolute",
    right: 24,
    bottom: 28,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
});
