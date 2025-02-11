import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

export function NewArrivalsBanner() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Arrivals</Text>
      <Text style={styles.subtitle}>Ogni giorno più di 150 nuovi prodotti arrivano in boutique</Text>
      <TouchableOpacity>
        <Text style={styles.link}>Scopri</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF5EA',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  link: {
    fontSize: 16,
    fontWeight: 500,
    textDecorationLine: 'underline',
  },
});