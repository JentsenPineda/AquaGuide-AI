import { TAB_BAR_HEIGHT } from "@/constants/layout";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import LoginRequired from "../../components/LoginRequired";
import ReminderCard from "../../components/reminder/ReminderCard";
import { useAuth } from "../../contexts/AuthContext";
import {
  addLog as addLogToFirestore,
  deleteLog as deleteLogFromFirestore,
  subscribeToLogs,
} from "../../services/logbookService";
import {
  addReminder as addReminderToFirestore,
  deleteReminder as deleteReminderFromFirestore,
  subscribeToReminders,
} from "../../services/reminderService";
type LogItem = {
  id: string;
  type:
    | "Feeding"
    | "Water Change"
    | "Health Observation"
    | "Disease Treatment"
    | "New Fish Added"
    | "Tank Maintenance";

  note?: string;
  date: string;
};

type ReminderType =
  | "Feeding"
  | "Water Change"
  | "Water Testing"
  | "Medication"
  | "Tank Cleaning"
  | "Plant Maintenance";

type ReminderItem = {
  id: string;
  type: ReminderType;

  repeat: "Daily" | "Weekly" | "Monthly";

  weekDay?: string;
  monthDay?: number;

  time: string;
  note?: string;

  notificationId?: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
export default function LogbookScreen() {
  const { user, loading, logout } = useAuth();

  // ================= STATE =================

  const [logs, setLogs] = useState<LogItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  const [logNote, setLogNote] = useState("");
  const [logType, setLogType] = useState<LogItem["type"]>("Feeding");
  const [logFilter, setLogFilter] = useState("All");

  const filteredLogs =
    logFilter === "All" ? logs : logs.filter((log) => log.type === logFilter);

  const [reminderNote, setReminderNote] = useState("");
  const [reminderType, setReminderType] = useState<ReminderType>("Feeding");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showTimeModal, setShowTimeModal] = useState(false);

  const [repeatType, setRepeatType] = useState<"Daily" | "Weekly" | "Monthly">(
    "Daily",
  );

  const [weekDay, setWeekDay] = useState("Sunday");

  const [monthDay, setMonthDay] = useState(1);

  const [showReminderForm, setShowReminderForm] = useState(false);

  // ================= LOAD DATA =================

  useEffect(() => {
    if (!user?.uid) return;

    requestNotificationPermission();

    const unsubscribeLogs = subscribeToLogs(user.uid, (updatedLogs) => {
      setLogs(updatedLogs);
    });

    const unsubscribeReminders = subscribeToReminders(
      user.uid,
      (updatedReminders) => {
        setReminders(updatedReminders);
      },
    );

    return () => {
      unsubscribeLogs();
      unsubscribeReminders();
    };
  }, [user?.uid]);
  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Notifications are needed for reminders.",
      );
    }
  };

  // ================= SAVE DATA =================

  // ================= ADD LOG =================

  const addLog = async () => {
    if (!user) {
      Alert.alert("Login Required", "Please log in to add a log.");
      return;
    }

    try {
      const newLog: Omit<LogItem, "id"> = {
        type: logType,
        note: logNote,
        date: selectedDate.toLocaleString(),
      };

      await addLogToFirestore(user.uid, newLog);

      setLogType("Feeding");
      setLogNote("");
    } catch (error) {
      console.log("Error adding log:", error);
      Alert.alert("Error", "Failed to save log.");
    }
  };

  // ================= ADD REMINDER =================
  const scheduleReminderNotification = async (
    type: string,
    repeat: string,
    time: Date,
  ) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();

    let trigger: any;

    if (repeat === "Daily") {
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      };
    }

    if (repeat === "Weekly") {
      const days: Record<string, number> = {
        Sunday: 1,
        Monday: 2,
        Tuesday: 3,
        Wednesday: 4,
        Thursday: 5,
        Friday: 6,
        Saturday: 7,
      };

      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: days[weekDay],
        hour: hours,
        minute: minutes,
      };
    }

    if (repeat === "Monthly") {
      trigger = {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: monthDay,
        hour: hours,
        minute: minutes,
      };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${type} Reminder`,
        body: `It's time for ${type.toLowerCase()}.`,
        sound: true,
      },
      trigger,
    });

    return notificationId;
  };
  const addReminder = async () => {
    const notificationId = await scheduleReminderNotification(
      reminderType,
      repeatType,
      selectedDate,
    );

    if (!user) return;

    await addReminderToFirestore(user.uid, {
      type: reminderType,
      repeat: repeatType,
      weekDay: repeatType === "Weekly" ? weekDay : undefined,
      monthDay: repeatType === "Monthly" ? monthDay : undefined,
      notificationId,
      note: reminderNote,
      time: selectedDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setShowReminderForm(false);
    setReminderNote("");
  };

  const deleteReminder = async (id: string) => {
    try {
      console.log("Deleting reminder id:", id);

      const reminder = reminders.find((r) => r.id === id);

      if (reminder?.notificationId) {
        await Notifications.cancelScheduledNotificationAsync(
          reminder.notificationId,
        );
      }

      if (!user) return;

      await deleteReminderFromFirestore(user.uid, id);
      console.log("Reminder deleted successfully.");
    } catch (error) {
      console.log("DELETE ERROR:", error);
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "Feeding":
        return "🍽";

      case "Water Change":
        return "💧";

      case "Health Observation":
        return "🩺";

      case "Disease Treatment":
        return "💊";

      case "New Fish Added":
        return "🐟";

      case "Tank Maintenance":
        return "🧹";

      default:
        return "📖";
    }
  };
  const deleteLog = async (id: string) => {
    if (!user) return;

    console.log("Deleting:", id);

    await deleteLogFromFirestore(user.uid, id);
  };
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 18
        ? "Good Afternoon 🌤️"
        : "Good Evening 🌙";

  const getReminderIcon = (type: ReminderType) => {
    switch (type) {
      case "Feeding":
        return "🍽";

      case "Water Change":
        return "💧";

      case "Water Testing":
        return "🧪";

      case "Medication":
        return "💊";

      case "Tank Cleaning":
        return "🧹";

      case "Plant Maintenance":
        return "🌱";

      default:
        return "📌";
    }
  };
  if (!user) {
    return <LoginRequired />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.title}>
                👋 Welcome, {user?.displayName || "Aquarist"}
              </Text>

              <Text style={styles.subtitle}>{user?.email}</Text>
            </View>

            <Pressable
              onPress={() =>
                Alert.alert("Logout", "Are you sure you want to logout?", [
                  {
                    text: "Cancel",
                    style: "cancel",
                  },
                  {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                      await logout();
                      router.replace("/(tabs)/logbook");
                    },
                  },
                ])
              }
              style={{
                backgroundColor: "#FF6B6B",
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontWeight: "700",
                }}
              >
                Logout
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: "rgba(0,212,255,0.08)",
              borderRadius: 18,
              padding: 16,
              marginTop: 20,
              borderWidth: 1,
              borderColor: "rgba(0,212,255,0.2)",
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 8,
              }}
            >
              {greeting}
            </Text>

            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                lineHeight: 22,
              }}
            >
              Welcome back to AquaGuide AI.
              {"\n"}
              Monitor your fish, track care activities, and never miss an
              important reminder.
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{logs.length}</Text>
              <Text style={styles.statLabel}>📖 Care Logs</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{reminders.length}</Text>
              <Text style={styles.statLabel}>⏰ Active Reminders</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📋 Today's Tasks</Text>

            {reminders.length === 0 ? (
              <Text style={styles.emptyText}>No tasks for today.</Text>
            ) : (
              reminders.slice(0, 3).map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#FFF",
                        fontWeight: "700",
                      }}
                    >
                      {item.type}
                    </Text>

                    <Text
                      style={{
                        color: "#B0BEC5",
                      }}
                    >
                      {item.time}
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: "rgba(0,212,255,0.15)",
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 999,
                    }}
                  >
                    <Pressable
                      style={{
                        backgroundColor: "#00D4FF",
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 999,
                      }}
                    >
                      <Text
                        style={{
                          color: "#000",
                          fontWeight: "800",
                          fontSize: 12,
                        }}
                      >
                        Complete
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>

          {/* REMINDERS */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="alarm-outline" size={18} color="#fff" />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text style={styles.sectionTitle}>Reminders</Text>

                <Pressable
                  style={styles.createReminderBtn}
                  onPress={() => setShowReminderForm(!showReminderForm)}
                >
                  <Ionicons name="add" size={18} color="#000" />
                  <Text style={styles.createReminderText}>Create Reminder</Text>
                </Pressable>
              </View>
            </View>

            {showReminderForm && (
              <>
                <View style={styles.typeRow}>
                  {[
                    "Feeding",
                    "Water Change",
                    "Water Testing",
                    "Medication",
                    "Tank Cleaning",
                    "Plant Maintenance",
                  ].map((type) => (
                    <Pressable
                      key={type}
                      onPress={() => {
                        setReminderType(type as ReminderType);

                        if (type === "Feeding") {
                          setRepeatType("Daily");
                        }

                        if (
                          type === "Water Change" ||
                          type === "Water Testing"
                        ) {
                          setRepeatType("Weekly");
                        }

                        if (type === "Tank Cleaning") {
                          setRepeatType("Monthly");
                        }
                      }}
                      style={[
                        styles.typeBtn,
                        reminderType === type && styles.typeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          reminderType === type && styles.typeTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <TextInput
                  value={reminderNote}
                  onChangeText={setReminderNote}
                  placeholder="Optional note..."
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  style={styles.input}
                />

                <View style={styles.typeRow}>
                  {["Daily", "Weekly", "Monthly"].map((item) => (
                    <Pressable
                      key={item}
                      onPress={() =>
                        setRepeatType(item as "Daily" | "Weekly" | "Monthly")
                      }
                      style={[
                        styles.typeBtn,
                        repeatType === item && styles.typeActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.typeText,
                          repeatType === item && styles.typeTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                {/* WEEKLY SELECTOR */}
                {repeatType === "Weekly" && (
                  <View>
                    <Text style={styles.sectionTitle}>Day of Week</Text>

                    <View style={styles.typeRow}>
                      {[
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ].map((day) => (
                        <Pressable
                          key={day}
                          onPress={() => setWeekDay(day)}
                          style={[
                            styles.typeBtn,
                            weekDay === day && styles.typeActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.typeText,
                              weekDay === day && styles.typeTextActive,
                            ]}
                          >
                            {day}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {/* MONTHLY SELECTOR */}
                {repeatType === "Monthly" && (
                  <View>
                    <Text style={styles.sectionTitle}>Day of Month</Text>

                    <View style={styles.typeRow}>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(
                        (day) => (
                          <Pressable
                            key={day}
                            onPress={() => setMonthDay(day)}
                            style={[
                              styles.typeBtn,
                              monthDay === day && styles.typeActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.typeText,
                                monthDay === day && styles.typeTextActive,
                              ]}
                            >
                              {day}
                            </Text>
                          </Pressable>
                        ),
                      )}
                    </View>
                  </View>
                )}
                <View style={styles.inputRow}>
                  <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowTimeModal(true)}
                  >
                    <Text style={styles.dateButtonText}>🕒 Select Time</Text>
                  </Pressable>

                  <Pressable style={styles.addBtn} onPress={addReminder}>
                    <Ionicons name="add" size={18} color="#000" />
                  </Pressable>
                </View>

                <Text style={styles.selectedInfo}>
                  {`🕒 ${selectedDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`}
                </Text>
              </>
            )}
            {reminders.length === 0 ? (
              <Text style={styles.emptyText}>No reminders yet.</Text>
            ) : (
              reminders.map((item) => (
                <ReminderCard
                  key={item.id}
                  id={item.id}
                  type={item.type}
                  repeat={item.repeat}
                  weekDay={item.weekDay}
                  monthDay={item.monthDay}
                  time={item.time}
                  note={item.note}
                  onDelete={deleteReminder}
                />
              ))
            )}
          </View>

          {/* LOGBOOK */}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="book-outline" size={18} color="#fff" />

              <Text style={styles.sectionTitle}>Care Logbook</Text>
            </View>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                marginBottom: 10,
                opacity: 0.8,
              }}
            >
              Select activity type
            </Text>
            <View style={styles.typeRow}>
              {[
                "Feeding",
                "Water Change",
                "Health Observation",
                "Disease Treatment",
                "New Fish Added",
                "Tank Maintenance",
              ].map((type) => (
                <Pressable
                  key={type}
                  onPress={() => setLogType(type as LogItem["type"])}
                  style={[
                    styles.typeBtn,
                    logType === type && styles.typeActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.typeText,
                      logType === type && styles.typeTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={logNote}
              onChangeText={setLogNote}
              placeholder="Write log note..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={styles.input}
            />

            <Pressable
              onPress={addLog}
              style={{
                backgroundColor: "#00D4FF",
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 12,
              }}
            >
              <Text
                style={{
                  color: "#000",
                  fontWeight: "700",
                  fontSize: 16,
                }}
              >
                Save Log Entry
              </Text>
            </Pressable>
            {filteredLogs.length === 0 ? (
              <Text style={styles.emptyText}>
                📖 Start Your Fish Journal
                {"\n\n"}
                Track:
                {"\n"}• Feeding Records
                {"\n"}• Water Changes
                {"\n"}• Health Observations
                {"\n"}• Treatments
                {"\n\n"}
                Your care history will appear here.
              </Text>
            ) : (
              filteredLogs.map((log) => (
                <View key={log.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardType}>
                      {`${getLogIcon(log.type)} ${log.type}`}
                    </Text>

                    <Pressable onPress={() => deleteLog(log.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FF6B6B"
                      />
                    </Pressable>
                  </View>

                  <Text style={styles.cardTitle}>{log.note}</Text>

                  <Text style={styles.cardDate}>{log.date}</Text>
                </View>
              ))
            )}
          </View>
          <View style={{ height: 40 }} />
        </>
      </ScrollView>

      <Modal visible={showTimeModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Select Time</Text>

            <DateTimePicker
              value={selectedDate}
              mode="time"
              display="spinner"
              onChange={(_, date) => {
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />

            <Pressable
              style={styles.doneButton}
              onPress={() => setShowTimeModal(false)}
            >
              <Text style={styles.doneText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B0F14",
  },

  container: {
    padding: 16,
    gap: 20,
    paddingBottom: TAB_BAR_HEIGHT,
  },

  emptyText: {
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    paddingVertical: 20,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
  },

  subtitle: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },

  section: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    gap: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#fff",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    fontSize: 13,
  },

  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#00D4FF",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  cardTitle: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },

  cardType: {
    color: "#00D4FF",
    fontWeight: "800",
    fontSize: 12,
    marginBottom: 4,
  },

  cardDate: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    marginTop: 4,
  },

  createReminderBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00D4FF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },

  createReminderText: {
    color: "#000",
    fontWeight: "700",
  },

  dateButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: 12,
  },

  dateButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  selectedInfo: {
    color: "#B0BEC5",
    marginTop: 6,
    marginLeft: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: "90%",
    backgroundColor: "#1A1F2B",
    borderRadius: 20,
    padding: 20,
  },

  modalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },

  doneButton: {
    backgroundColor: "#00D4FF",
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },

  doneText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#000",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },

  statCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  statNumber: {
    fontSize: 34,
    fontWeight: "900",
    color: "#00D4FF",
  },

  statLabel: {
    color: "#B0BEC5",
    marginTop: 4,
    fontSize: 12,
  },

  typeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },

  typeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  typeActive: {
    backgroundColor: "#00D4FF",
  },

  typeText: {
    fontSize: 11,
    color: "#fff",
  },

  typeTextActive: {
    color: "#000",
    fontWeight: "800",
  },
});
