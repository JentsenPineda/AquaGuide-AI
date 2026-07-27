import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

type Props = {
  images: any[];
  height?: number;
  width?: number;
};

export default function ImageCarousel({
  images,
  height = 180,
  width: imageWidth = width - 40,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const animatedValues = useRef(
    images.map(() => new Animated.Value(0)),
  ).current;

  const flatListRef = useRef<FlatList>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / imageWidth);
    setActiveIndex(index);
    animatedValues.forEach((value, i) => {
      Animated.timing(value, {
        toValue: i === index ? 1 : 0,
        duration: 220,
        useNativeDriver: false,
      }).start();
    });
  };

  return (
    <View
      style={{
        padding: 12,
      }}
    >
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{
              width: imageWidth,
              height,
              borderRadius: 18,
            }}
            resizeMode="cover"
          />
        )}
      />

      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => {
            const width = animatedValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: [8, 24],
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width,
                    opacity: activeIndex === index ? 1 : 0.5,
                  },
                ]}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    position: "absolute",
    bottom: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,.45)",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#fff",
  },
});
