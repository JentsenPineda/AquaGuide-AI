import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { equipmentData } from "../../data/equipmentDatabase";
export default function EquipmentCategory() {
  const { category } = useLocalSearchParams();

  const equipment = equipmentData[category as keyof typeof equipmentData] || [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>
          {String(category).replace("-", " ").toUpperCase()}
        </Text>

        {equipment.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/equipment/equipment-detail",
                params: {
                  category: String(category),
                  equipment: item.id,
                },
              })
            }
          >
            <Image source={item.image} style={styles.image} />

            <View style={styles.content}>
              <Text style={styles.name}>{item.name}</Text>

              <Text style={styles.description}>{item.description}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#08141F",
  },

  container: {
    padding: 20,
  },

  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#102331",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 15,
  },

  image: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },

  content: {
    padding: 15,
  },

  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  description: {
    color: "#B0BEC5",
    marginTop: 5,
  },
});
