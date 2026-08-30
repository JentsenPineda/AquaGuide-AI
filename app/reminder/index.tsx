import SectionCard from "@/components/cards/SectionCard";
import AppHeader from "@/components/layout/AppHeader";
import ReminderCard, {
  ReminderRepeat,
  ReminderType,
} from "@/components/reminder/ReminderCard";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import {
  deleteReminder as deleteReminderFromFirestore,
  subscribeToReminders,
} from "@/services/reminderService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  const { colorScheme } = useTheme();
  const colors = useAppColors();

  const isDark = colorScheme === "dark";

  const modeBackground = isDark
    ? require("../../assets/images/dark-mode-bg.png")
    : require("../../assets/images/light-mode-bg.png");

  const firstName = user?.displayName?.split(" ")[0] || "Aquarist";

  const [reminders, setReminders] = useState<ReminderItem[]>([]);

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

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

  useEffect(() => {
    if (!user) {
      router.replace({
        pathname: "/auth/login",
        params: {
          redirect: "reminder",
        },
      });
    }
  }, [user]);

  if (!user) {
    return (
      <View style={styles.loginContainer}>
        <Image
          source={modeBackground}
          resizeMode="cover"
          style={styles.backgroundImage}
        />

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
    <View style={styles.screen}>
      {/* ================================================================ */}
      {/* LIGHT / DARK BACKGROUND                                         */}
      {/* ================================================================ */}

      <Image
        source={modeBackground}
        resizeMode="cover"
        style={styles.backgroundImage}
      />

      {/* ================================================================ */}
      {/* APP HEADER                                                       */}
      {/* ================================================================ */}

      <AppHeader title=" Reminder " showBack />

      <ScrollView
        contentContainerStyle={[styles.container, styles.content]}
        showsVerticalScrollIndicator={false}
      >
        {/* ============================================================ */}
        {/* HERO                                                         */}
        {/* ============================================================ */}

        <View style={styles.heroCard}>
          <Text style={styles.heroGreeting}>{greeting}</Text>

          <Text style={styles.heroName}>{firstName}</Text>

          <View style={styles.heroStats}>
            <Text style={styles.heroCount}>{reminders.length}</Text>

            <Text style={styles.heroCountLabel}>
              Active Reminder
              {reminders.length !== 1 ? "s" : ""}
            </Text>
          </View>

          <View style={styles.heroDivider} />

          <Text style={styles.nextLabel}>Next Reminder</Text>

          {reminders.length > 0 ? (
            <>
              <Text style={styles.nextTitle}>{reminders[0].type}</Text>

              <Text style={styles.nextTime}>
                🕒 Today • {reminders[0].time}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.nextTitle}>You're all caught up!</Text>

              <Text style={styles.nextTime}>
                Tap the + button to create your first reminder.
              </Text>
            </>
          )}
        </View>

        {/* ============================================================ */}
        {/* TODAY'S SCHEDULE                                              */}
        {/* ============================================================ */}

        <SectionCard
          title="Today's Schedule"
          subtitle="Your scheduled fish care reminders."
        >
          {reminders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-outline"
                size={42}
                color={colors.textMuted}
              />

              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                No reminders scheduled
              </Text>

              <Text
                style={[
                  styles.emptySubtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
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
      </ScrollView>

      {/* ================================================================ */}
      {/* ADD REMINDER                                                    */}
      {/* ================================================================ */}

      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => router.push("/reminder/create")}
      >
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  /*
   * Main screen remains transparent so the mode-specific
   * background image can be displayed underneath the content.
   */
  screen: {
    flex: 1,
  },

  /*
   * Full-screen light/dark background.
   */
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },

  /*
   * Login redirect state.
   */
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loginText: {
    marginTop: 16,
    fontSize: 16,
  },

  container: {
    flexGrow: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /*
   * HERO
   *
   * This remains a solid feature panel.
   * It is intentionally NOT transparent.
   */
  heroCard: {
    backgroundColor: "#0EA5E9",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },

  heroGreeting: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.82)",
    letterSpacing: 0.3,
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
    color: "rgba(255,255,255,0.88)",
  },

  heroDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.18)",
    marginVertical: 22,
  },

  nextLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.75)",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  nextTitle: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  nextTime: {
    marginTop: 8,
    fontSize: 16,
    color: "rgba(255,255,255,0.92)",
  },

  /*
   * EMPTY STATE
   */
  emptyState: {
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
  },

  emptySubtitle: {
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 10,
  },

  /*
   * FLOATING ADD BUTTON
   */
  fab: {
    position: "absolute",
    right: 24,
    bottom: 28,

    width: 62,
    height: 62,
    borderRadius: 31,

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
