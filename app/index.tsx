
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/button';

export default function WelcomeScreen() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (user) {
    return null; // Will redirect to tabs
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>📦</Text>
          <Text style={styles.title}>DeliveryConnect</Text>
          <Text style={styles.subtitle}>
            Votre plateforme de livraison rapide et fiable
          </Text>
        </View>

        <View style={styles.features}>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🚀</Text>
            <Text style={styles.featureText}>Livraison express</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📍</Text>
            <Text style={styles.featureText}>Suivi en temps réel</Text>
          </View>
          <View style={styles.feature}>
            <Text style={styles.featureIcon}>💳</Text>
            <Text style={styles.featureText}>Paiement sécurisé</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => router.push('/auth')}
            style={styles.getStartedButton}
          >
            Commencer
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    width: '100%',
    marginBottom: 60,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  getStartedButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  loadingText: {
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
});
