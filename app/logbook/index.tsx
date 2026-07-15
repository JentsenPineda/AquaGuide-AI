import AppHeader from "@/components/layout/AppHeader";
import LoginRequired from "@/components/LoginRequired";
import { useAuth } from "@/contexts/AuthContext";
import { deleteLog, LogItem, subscribeToLogs } from "@/services/logbookService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

import {
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
  if (!user) {
    return <LoginRequired />;
  }
  return (
    <View style={styles.screen}>
      <AppHeader
        title="Logbook"
        subtitle="Track your aquarium care history"
        showBack
        variant="light"
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          <Text style={styles.sectionSubtitle}>
            Your aquarium care history will appear here.
          </Text>

          {logs.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyEmoji}>📖</Text>

              <Text style={styles.emptyTitle}>
                Your aquarium journal starts here
              </Text>

              <Text style={styles.emptyDescription}>
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
              {logs.map((log) => (
                <TouchableOpacity
                  key={log.id}
                  style={styles.logCard}
                  activeOpacity={0.9}
                  onLongPress={() => handleDelete(log)}
                >
                  <View
                    style={[
                      styles.logIcon,
                      {
                        backgroundColor: `${
                          activityConfig[
                            log.type as keyof typeof activityConfig
                          ]?.color ?? "#00BCD4"
                        }15`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={
                        activityConfig[log.type as keyof typeof activityConfig]
                          ?.icon ?? "book-outline"
                      }
                      size={20}
                      color={
                        activityConfig[log.type as keyof typeof activityConfig]
                          ?.color ?? "#00BCD4"
                      }
                    />
                  </View>
                  <View style={styles.logHeader}>
                    <View style={styles.logInfo}>
                      <Text style={styles.logTitle}>{log.type}</Text>

                      <Text style={styles.logDate}>
                        {formatLogDate(log.date)}
                      </Text>
                    </View>
                  </View>
                  {log.note ? (
                    <Text style={styles.logNote}>{log.note}</Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    backgroundColor: "#F5F7FA",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

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

  section: {
    marginTop: 28,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },

  sectionSubtitle: {
    marginTop: 6,
    fontSize: 15,
    color: "#64748B",
  },

  emptyCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyEmoji: {
    fontSize: 46,
  },

  emptyTitle: {
    marginTop: 18,
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
  },

  emptyDescription: {
    marginTop: 10,
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 22,
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

  logCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  logHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  logIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E6FAFD",
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
    color: "#0F172A",
  },

  logDate: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748B",
  },

  logNote: {
    marginTop: 16,
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
});
