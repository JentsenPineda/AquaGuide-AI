import { ImageSourcePropType } from "react-native";

export const AVATARS = [
  {
    id: "avatar1",
    source: require("../assets/images/Avatar Image/avatar1.webp"),
  },
  {
    id: "avatar2",
    source: require("../assets/images/Avatar Image/avatar2.webp"),
  },
  {
    id: "avatar3",
    source: require("../assets/images/Avatar Image/avatar3.webp"),
  },
  {
    id: "avatar4",
    source: require("../assets/images/Avatar Image/avatar4.webp"),
  },
  {
    id: "avatar5",
    source: require("../assets/images/Avatar Image/avatar5.webp"),
  },
  {
    id: "avatar6",
    source: require("../assets/images/Avatar Image/avatar6.webp"),
  },
  {
    id: "avatar7",
    source: require("../assets/images/Avatar Image/avatar7.webp"),
  },
  {
    id: "avatar8",
    source: require("../assets/images/Avatar Image/avatar8.webp"),
  },
  {
    id: "avatar9",
    source: require("../assets/images/Avatar Image/avatar9.webp"),
  },
  {
    id: "avatar10",
    source: require("../assets/images/Avatar Image/avatar10.webp"),
  },
  {
    id: "avatar11",
    source: require("../assets/images/Avatar Image/avatar11.webp"),
  },
  {
    id: "avatar12",
    source: require("../assets/images/Avatar Image/avatar12.webp"),
  },
  {
    id: "avatar13",
    source: require("../assets/images/Avatar Image/avatar13.webp"),
  },
  {
    id: "avatar14",
    source: require("../assets/images/Avatar Image/avatar14.webp"),
  },
  {
    id: "avatar15",
    source: require("../assets/images/Avatar Image/avatar15.webp"),
  },
  {
    id: "avatar16",
    source: require("../assets/images/Avatar Image/avatar16.webp"),
  },
  {
    id: "avatar17",
    source: require("../assets/images/Avatar Image/avatar17.webp"),
  },
  {
    id: "avatar18",
    source: require("../assets/images/Avatar Image/avatar18.webp"),
  },
  {
    id: "avatar19",
    source: require("../assets/images/Avatar Image/avatar19.webp"),
  },
  {
    id: "avatar20",
    source: require("../assets/images/Avatar Image/avatar20.webp"),
  },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

export const DEFAULT_AVATAR_ID: AvatarId = "avatar1";

export function getAvatarSource(
  avatarId: string | null | undefined,
): ImageSourcePropType {
  return (
    AVATARS.find((avatar) => avatar.id === avatarId)?.source ??
    AVATARS[0].source
  );
}
