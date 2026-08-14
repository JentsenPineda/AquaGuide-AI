import { AVATARS, AvatarId } from "@/constants/avatar";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface AvatarPickerProps {
  visible: boolean;
  selectedAvatar: AvatarId;
  onSelect: (avatarId: AvatarId) => void;
  onClose: () => void;
  colors: {
    card: string;
    primary: string;
    textPrimary: string;
    textSecondary: string;
  };
}

export default function AvatarPicker({
  visible,
  selectedAvatar,
  onSelect,
  onClose,
  colors,
}: AvatarPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              backgroundColor: colors.card,
            },
          ]}
        >
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.textPrimary,
                  },
                ]}
              >
                Choose Your Avatar
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                  },
                ]}
              >
                Select an avatar for your profile
              </Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {AVATARS.map((avatar) => {
              const isSelected = selectedAvatar === avatar.id;

              return (
                <Pressable
                  key={avatar.id}
                  onPress={() => onSelect(avatar.id)}
                  style={[
                    styles.avatarOption,
                    isSelected && {
                      borderColor: colors.primary,
                      backgroundColor: `${colors.primary}18`,
                    },
                  ]}
                >
                  <Image source={avatar.source} style={styles.avatarImage} />

                  {isSelected && (
                    <View
                      style={[
                        styles.check,
                        {
                          backgroundColor: colors.primary,
                        },
                      ]}
                    >
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  modal: {
    borderRadius: 24,
    padding: 20,
    maxHeight: "80%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
  },

  subtitle: {
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

  grid: {
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

  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    transform: [{ scale: 1.3 }],
  },

  check: {
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
