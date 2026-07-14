import SectionCard from "@/components/cards/SectionCard";
import AppHeader from "@/components/layout/AppHeader";
import LoginRequired from "@/components/LoginRequired";
import ReminderCard, {
    ReminderRepeat,
    ReminderType,
} from "@/components/reminder/ReminderCard";
import { useAuth } from "@/contexts/AuthContext";
import {
    deleteReminder as deleteReminderFromFirestore,
    subscribeToReminders,
} from "@/services/reminderService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ReminderItem = {
  id: string;
  type: ReminderType;
  repeat: ReminderRepeat;
  weekDay?: string;
  monthDay?: number;
  time: string;
  note?: string;
};

export default function ReminderScreen() {
  const { user } = useAuth();

  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = subscribeToReminders(
      user.uid,
      (updatedReminders: ReminderItem[]) => {
        setReminders(updatedReminders);
      },
    );

    return unsubscribe;
  }, [user]);

  const deleteReminder = async (id: string) => {
    if (!user) return;

    try {
      await deleteReminderFromFirestore(user.uid, id);
    } catch (error) {
      console.log("Delete Reminder Error:", error);
    }
  };

  if (!user) {
    return <LoginRequired />;
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Reminder"
        subtitle="Manage your upcoming fish care tasks"
        showBack
        variant="light"
      />

      <View style={styles.container}>
        <SectionCard
          title="Active Reminders"
          subtitle="Keep track of scheduled aquarium care."
          rightComponent={
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/reminder/create")}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          }
        >
          <View style={styles.summary}>
            <Text style={styles.summaryNumber}>{reminders.length}</Text>

            <Text style={styles.summaryLabel}>Active Reminders</Text>
          </View>
        </SectionCard>

        <SectionCard
          title="Today's Schedule"
          subtitle="Your scheduled fish care reminders."
        >
          {reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={42} color="#B0BEC5" />

              <Text style={styles.emptyTitle}>No reminders scheduled</Text>

              <Text style={styles.emptySubtitle}>
                Tap the + button above to create your first reminder.
              </Text>
            </View>
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
        </SectionCard>
      </View>
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
    padding: 20,
  },

  addButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#00BCD4",
    justifyContent: "center",
    alignItems: "center",
  },

  summary: {
    alignItems: "center",
    paddingVertical: 12,
  },

  summaryNumber: {
    fontSize: 42,
    fontWeight: "700",
    color: "#00BCD4",
  },

  summaryLabel: {
    marginTop: 6,
    color: "#607D8B",
    fontSize: 15,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },

  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 22,
    paddingHorizontal: 10,
  },
});
