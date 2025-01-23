import React, { useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, Dimensions } from 'react-native';

interface ScrollablePickerProps {
  items: { id: string; label: string }[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function ScrollablePicker({ items, selectedId, onSelect }: ScrollablePickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSelect = (id: string, index: number) => {
    onSelect(id);
    const itemWidth = 120;
    const screenWidth = Dimensions.get('window').width;
    const offset = Math.max(0, (itemWidth * index) - (screenWidth / 2) + (itemWidth / 2));
    scrollViewRef.current?.scrollTo({ x: offset, animated: true });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        ref={scrollViewRef}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.button,
              selectedId === item.id && styles.selectedButton,
            ]}
            onPress={() => handleSelect(item.id, index)}
          >
            <Text style={[
              styles.text,
              selectedId === item.id && styles.selectedText,
            ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedButton: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  text: {
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
});