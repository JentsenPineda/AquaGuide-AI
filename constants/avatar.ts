import { ImageSourcePropType } from "react-native";

export const AVATARS = [
  {
    id: "avatar1",
    source: require("../assets/images/Avatar Image/avatar1.png"),
  },
  {
    id: "avatar2",
    source: require("../assets/images/Avatar Image/avatar2.png"),
  },
  {
    id: "avatar3",
    source: require("../assets/images/Avatar Image/avatar3.png"),
  },
  {
    id: "avatar4",
    source: require("../assets/images/Avatar Image/avatar4.png"),
  },
  {
    id: "avatar5",
    source: require("../assets/images/Avatar Image/avatar5.png"),
  },
  {
    id: "avatar6",
    source: require("../assets/images/Avatar Image/avatar6.png"),
  },
  {
    id: "avatar7",
    source: require("../assets/images/Avatar Image/avatar7.png"),
  },
  {
    id: "avatar8",
    source: require("../assets/images/Avatar Image/avatar8.png"),
  },
  {
    id: "avatar9",
    source: require("../assets/images/Avatar Image/avatar9.png"),
  },
  {
    id: "avatar10",
    source: require("../assets/images/Avatar Image/avatar10.png"),
  },
  {
    id: "avatar11",
    source: require("../assets/images/Avatar Image/avatar11.png"),
  },
  {
    id: "avatar12",
    source: require("../assets/images/Avatar Image/avatar12.png"),
  },
  {
    id: "avatar13",
    source: require("../assets/images/Avatar Image/avatar13.png"),
  },
  {
    id: "avatar14",
    source: require("../assets/images/Avatar Image/avatar14.png"),
  },
  {
    id: "avatar15",
    source: require("../assets/images/Avatar Image/avatar15.png"),
  },
  {
    id: "avatar16",
    source: require("../assets/images/Avatar Image/avatar16.png"),
  },
  {
    id: "avatar17",
    source: require("../assets/images/Avatar Image/avatar17.png"),
  },
  {
    id: "avatar18",
    source: require("../assets/images/Avatar Image/avatar18.png"),
  },
  {
    id: "avatar19",
    source: require("../assets/images/Avatar Image/avatar19.png"),
  },
  {
    id: "avatar20",
    source: require("../assets/images/Avatar Image/avatar20.png"),
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
