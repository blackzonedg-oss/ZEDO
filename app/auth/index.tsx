
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/button';
import { TextInput } from '../../components/TextInput';
import { UserType } from '../../types';

export default function AuthScreen() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<UserType>('client');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!isLogin && (!formData.name || !formData.phone)) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsLoading(true);
      if (isLogin) {
        await login(formData.email, formData.password, userType);
      } else {
        await register(formData.name, formData.email, formData.password, formData.phone, userType);
      }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Erreur', error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const userTypes = [
    { key: 'client', label: 'Client', icon: '👤', description: 'Envoyer des colis' },
    { key: 'supplier', label: 'Fournisseur', icon: '🏢', description: 'Compte professionnel' },
    { key: 'driver', label: 'Livreur', icon: '🚗', description: 'Effectuer des livraisons' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Retour</Text>
        </Pressable>
        <Text style={styles.title}>
          {isLogin ? 'Connexion' : 'Inscription'}
        </Text>
      </View>

      <View style={styles.userTypeContainer}>
        <Text style={styles.sectionTitle}>Type de compte</Text>
        <View style={styles.userTypeGrid}>
          {userTypes.map((type) => (
            <Pressable
              key={type.key}
              style={[
                styles.userTypeCard,
                userType === type.key && styles.userTypeCardSelected,
              ]}
              onPress={() => setUserType(type.key as UserType)}
            >
              <Text style={styles.userTypeIcon}>{type.icon}</Text>
              <Text style={styles.userTypeLabel}>{type.label}</Text>
              <Text style={styles.userTypeDescription}>{type.description}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.form}>
        {!isLogin && (
          <TextInput
            label="Nom complet"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="Votre nom complet"
          />
        )}

        <TextInput
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          placeholder="votre@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Mot de passe"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          placeholder="Votre mot de passe"
          secureTextEntry
        />

        {!isLogin && (
          <TextInput
            label="Téléphone"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="+33 6 12 34 56 78"
            keyboardType="phone-pad"
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        >
          {isLogin ? 'Se connecter' : 'S\'inscrire'}
        </Button>

        <Pressable
          onPress={() => setIsLogin(!isLogin)}
          style={styles.switchButton}
        >
          <Text style={styles.switchButtonText}>
            {isLogin ? 'Pas de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  userTypeContainer: {
    marginBottom: 32,
  },
  userTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  userTypeCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  userTypeCardSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  userTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  userTypeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  userTypeDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 32,
  },
  buttonContainer: {
    gap: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  switchButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
});
