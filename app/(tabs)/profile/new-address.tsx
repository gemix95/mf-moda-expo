import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { useAuthStore } from '@/services/authStore';
import { router } from 'expo-router';
import { api } from '@/services/api';

export default function NewAddressScreen() {
  const token = useAuthStore((state) => state.token);
  const [isDefault, setIsDefault] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address1: '',
    city: '',
    province: '',
    zip: '',
    country: 'Italy'
  });

  const handleSubmit = async () => { };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={form.firstName}
          onChangeText={(text) => setForm({ ...form, firstName: text })}
          placeholder="Nome"
        />

        <Text style={styles.label}>Cognome</Text>
        <TextInput
          style={styles.input}
          value={form.lastName}
          onChangeText={(text) => setForm({ ...form, lastName: text })}
          placeholder="Cognome"
        />

        <Text style={styles.label}>Numero di telefono</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(text) => setForm({ ...form, phone: text })}
          placeholder="Numero di telefono"
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Indirizzo</Text>
        <TextInput
          style={styles.input}
          value={form.address1}
          onChangeText={(text) => setForm({ ...form, address1: text })}
          placeholder="Via e numero civico"
        />

        <Text style={styles.label}>Città</Text>
        <TextInput
          style={styles.input}
          value={form.city}
          onChangeText={(text) => setForm({ ...form, city: text })}
          placeholder="Città"
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Provincia</Text>
            <TextInput
              style={styles.input}
              value={form.province}
              onChangeText={(text) => setForm({ ...form, province: text })}
              placeholder="Provincia"
            />
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Codice Postale</Text>
            <TextInput
              style={styles.input}
              value={form.zip}
              onChangeText={(text) => setForm({ ...form, zip: text })}
              placeholder="Codice Postale"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Indirizzo di default</Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveButtonText}>Salva</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  saveButton: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#000',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    color: '#ff3b30',
    fontSize: 16,
  },
});