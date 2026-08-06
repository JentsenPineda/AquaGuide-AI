import AppHeader from "@/components/layout/AppHeader";

import NextButton from "@/components/onboarding/NextButton";
import OnboardingSlide from "@/components/onboarding/OnboardingSlide";
import Pagination from "@/components/onboarding/Pagination";
import { onboardingData } from "@/constants/onboarding";
import { useAppColors } from "@/theme/useAppColors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useRef, useState } from "react";

import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
export default function OnboardingScreen() {
  const colors = useAppColors();
  const { width } = useWindowDimensions();

  const flatListRef = useRef<FlatList>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const nextSlide = async () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
      });
    } else {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
      router.replace("/welcome");
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <AppHeader title="Welcome" />

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <OnboardingSlide item={item} />
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.footer}>
        <Pagination currentIndex={currentIndex} total={onboardingData.length} />

        <NextButton
          title={
            currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"
          }
          onPress={nextSlide}
        />

        {currentIndex !== onboardingData.length - 1 && (
          <TouchableOpacity
            style={styles.skipContainer}
            onPress={async () => {
              await AsyncStorage.setItem("hasSeenOnboarding", "true");
              router.replace("/auth/login");
            }}
          >
            <Text
              style={[
                styles.skipText,
                {
                  color: colors.textSecondary,
                },
              ]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
  },

  skipContainer: {
    alignItems: "center",
    marginTop: 18,
  },

  skipText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
