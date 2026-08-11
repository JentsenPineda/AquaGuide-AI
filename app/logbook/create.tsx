import LogDateTimeCard from "@/app/logbook/LogDateTimeCard";
import LogNotesCard from "@/app/logbook/LogNotesCard";
import SaveLogButton from "@/app/logbook/SaveLogButton";
import AppHeader from "@/components/layout/AppHeader";
import ReminderDatePickerModal from "@/components/reminder/ReminderDatePickerModal";
import ReminderTimePickerModal from "@/components/reminder/ReminderTimePickerModal";
import { useAuth } from "@/contexts/AuthContext";
import { addLog } from "@/services/logbookService";
import { useAppColors } from "@/theme/useAppColors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const activities = [
  {
    title: "Feeding",
    description: "Daily feeding activities",
    icon: "restaurant-outline",
    color: "#F59E0B",
  },
  {
    title: "Water Change",
    description: "Routine water replacement",
    icon: "water-outline",
    color: "#3B82F6",
  },
  {
    title: "Water Test",
    description: "Check water quality",
    icon: "flask-outline",
    color: "#8B5CF6",
  },
  {
    title: "Medication",
    description: "Treat sick fish",
    icon: "medical-outline",
    color: "#EF4444",
  },
  {
    title: "Cleaning",
    description: "Tank maintenance",
    icon: "sparkles-outline",
    color: "#06B6D4",
  },
  {
    title: "Plant Care",
    description: "Maintain aquatic plants",
    icon: "leaf-outline",
    color: "#22C55E",
  },
  {
    title: "New Fish",
    description: "Added new fish",
    icon: "fish-outline",
    color: "#0EA5E9",
  },
  {
    title: "Observation",
    description: "Record fish behavior",
    icon: "eye-outline",
    color: "#F97316",
  },
] as const;

export default function CreateLogbookScreen() {
  const { user } = useAuth();
  const colors = useAppColors();
  const insets = useSafeAreaInsets();

  const [notes, setNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [saving, setSaving] = useState(false);

  const [selectedActivity, setSelectedActivity] = useState("Feeding");
  const [activityMenuVisible, setActivityMenuVisible] = useState(false);

  const selectedActivityData = activities.find(
    (activity) => activity.title === selectedActivity,
  );

  const formatDate = (date: Date) =>
    date.toLocaleDateString([], {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const saveLog = async () => {
    console.log("1. Save button pressed");

    if (!user) {
      console.log("2. No user found");
      return;
    }

    console.log("3. User:", user.uid);

    try {
      setSaving(true);

      console.log("4. Calling addLog...");

      const id = await addLog(user.uid, {
        type: selectedActivity as any,
        note: notes.trim(),
        date: selectedDate.toISOString(),
      });

      console.log("5. Log saved:", id);

      router.back();
    } catch (error) {
      console.log("6. Save Log Error:", error);
    } finally {
      setSaving(false);
      console.log("7. Finished");
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
      <AppHeader title="New Log Entry" showBack />

      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={32}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardOpeningTime={0}
        enableAutomaticScroll
      >
        {/* HERO */}

        <View style={styles.hero}>
          <Text
            style={[
              styles.heroTitle,
              {
                color: colors.textPrimary,
              },
            ]}
          >
            Create a new log
          </Text>

          <Text
            style={[
              styles.heroDescription,
              {
                color: colors.textSecondary,
              },
            ]}
          >
            Keep a complete history of your aquarium maintenance, feeding,
            treatments and observations.
          </Text>
        </View>

        {/* ACTIVITY */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color: colors.textPrimary,
            },
          ]}
        >
          Activity
        </Text>

        <Text
          style={[
            styles.sectionSubtitle,
            {
              color: colors.textSecondary,
            },
          ]}
        >
          Select the aquarium activity you performed.
        </Text>

        <TouchableOpacity
          style={[
            styles.activitySelector,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          activeOpacity={0.85}
          onPress={() => setActivityMenuVisible(true)}
        >
          <View style={styles.activityLeft}>
            <View
              style={[
                styles.activityIcon,
                {
                  backgroundColor: `${selectedActivityData?.color}15`,
                },
              ]}
            >
              <Ionicons
                name={selectedActivityData?.icon ?? "bookmark-outline"}
                size={22}
                color={selectedActivityData?.color ?? colors.primary}
              />
            </View>

            <View style={styles.activityText}>
              <Text
                style={[
                  styles.activityLabel,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Activity
              </Text>

              <Text
                style={[
                  styles.activityValue,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                {selectedActivity}
              </Text>
            </View>
          </View>

          <Ionicons
            name="chevron-down"
            size={22}
            color={colors.textSecondary}
          />
        </TouchableOpacity>

        {/* ACTIVITY MODAL */}

        <Modal
          visible={activityMenuVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setActivityMenuVisible(false)}
        >
          <Pressable
            style={[
              styles.modalOverlay,
              {
                backgroundColor: "rgba(0,0,0,0.45)",
              },
            ]}
            onPress={() => setActivityMenuVisible(false)}
          >
            <Pressable
              style={[
                styles.bottomSheet,
                {
                  backgroundColor: colors.card,
                },
              ]}
              onPress={() => {}}
            >
              <View
                style={[
                  styles.sheetHandle,
                  {
                    backgroundColor: colors.border,
                  },
                ]}
              />

              <Text
                style={[
                  styles.sheetTitle,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Select Activity
              </Text>

              <FlatList
                data={activities}
                keyExtractor={(item) => item.title}
                renderItem={({ item, index }) => (
                  <View>
                    <TouchableOpacity
                      style={styles.sheetItem}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedActivity(item.title);
                        setActivityMenuVisible(false);
                      }}
                    >
                      <View
                        style={[
                          styles.sheetIcon,
                          {
                            backgroundColor: `${item.color}15`,
                          },
                        ]}
                      >
                        <Ionicons
                          name={item.icon}
                          size={22}
                          color={item.color}
                        />
                      </View>

                      <View style={styles.sheetInfo}>
                        <Text
                          style={[
                            styles.sheetItemTitle,
                            {
                              color: colors.textPrimary,
                            },
                          ]}
                        >
                          {item.title}
                        </Text>

                        <Text
                          style={[
                            styles.sheetItemDescription,
                            {
                              color: colors.textSecondary,
                            },
                          ]}
                        >
                          {item.description}
                        </Text>
                      </View>

                      {selectedActivity === item.title && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>

                    {index !== activities.length - 1 && (
                      <View
                        style={[
                          styles.separator,
                          {
                            backgroundColor: colors.border,
                          },
                        ]}
                      />
                    )}
                  </View>
                )}
              />

              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                activeOpacity={0.85}
                onPress={() => setActivityMenuVisible(false)}
              >
                <Text
                  style={[
                    styles.cancelText,
                    {
                      color: colors.textSecondary,
                    },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>

        {/* DATE & TIME */}

        <LogDateTimeCard
          date={formatDate(selectedDate)}
          time={formatTime(selectedDate)}
          onDatePress={() => setShowDatePicker(true)}
          onTimePress={() => setShowTimePicker(true)}
        />

        {/* NOTES */}

        <LogNotesCard value={notes} onChangeText={setNotes} />

        {/* DATE PICKER */}

        <ReminderDatePickerModal
          visible={showDatePicker}
          date={selectedDate}
          onDismiss={() => setShowDatePicker(false)}
          onConfirm={(date) => {
            const updated = new Date(selectedDate);

            updated.setFullYear(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
            );

            setSelectedDate(updated);
            setShowDatePicker(false);
          }}
        />

        {/* TIME PICKER */}

        <ReminderTimePickerModal
          visible={showTimePicker}
          hours={selectedDate.getHours()}
          minutes={selectedDate.getMinutes()}
          onDismiss={() => setShowTimePicker(false)}
          onConfirm={(hours, minutes) => {
            const updated = new Date(selectedDate);

            updated.setHours(hours);
            updated.setMinutes(minutes);

            setSelectedDate(updated);
            setShowTimePicker(false);
          }}
        />
      </KeyboardAwareScrollView>

      {/* SAVE BUTTON */}

      <View
        style={[
          styles.bottomAction,
          {
            paddingBottom: Math.max(insets.bottom, 16),
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <SaveLogButton loading={saving} onPress={saveLog} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingBottom: 140,
  },

  hero: {
    marginBottom: 30,
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
  },

  heroDescription: {
    marginTop: 12,
    fontSize: 17,
    lineHeight: 28,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
  },

  sectionSubtitle: {
    marginTop: 6,
    marginBottom: 18,
    fontSize: 15,
  },

  activitySelector: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  activityText: {
    marginLeft: 14,
  },

  activityLabel: {
    fontSize: 13,
    marginBottom: 4,
  },

  activityValue: {
    fontSize: 17,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },

  bottomSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 36,
    maxHeight: "70%",
  },

  sheetHandle: {
    alignSelf: "center",
    width: 54,
    height: 5,
    borderRadius: 3,
    marginBottom: 18,
  },

  sheetTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
  },

  sheetItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  sheetIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },

  sheetInfo: {
    flex: 1,
    marginLeft: 14,
  },

  sheetItemTitle: {
    fontSize: 17,
    fontWeight: "700",
  },

  sheetItemDescription: {
    marginTop: 4,
    fontSize: 13,
  },

  cancelButton: {
    marginTop: 18,
    height: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  cancelText: {
    fontSize: 17,
    fontWeight: "700",
  },

  separator: {
    height: 1,
    marginLeft: 60,
  },

  bottomAction: {
    paddingHorizontal: 22,
    paddingTop: 12,
    borderTopWidth: 1,
  },
});
