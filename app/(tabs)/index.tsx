
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useDelivery } from '../../contexts/DeliveryContext';
import { Button } from '../../components/button';

export default function HomeScreen() {
  const { user } = useAuth();
  const { activeDelivery, deliveries } = useDelivery();

  if (!user) {
    return null;
  }

  const recentDeliveries = deliveries
    .filter(d => d.clientId === user.id)
    .slice(0, 3);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {getGreeting()}, {user.name} 👋
        </Text>
        <Text style={styles.subtitle}>
          {user.userType === 'supplier' ? 'Gérez vos livraisons professionnelles' : 'Que souhaitez-vous envoyer aujourd\'hui ?'}
        </Text>
      </View>

      {activeDelivery && (
        <View style={styles.activeDeliveryCard}>
          <Text style={styles.cardTitle}>📦 Livraison en cours</Text>
          <Text style={styles.deliveryStatus}>
            Statut: {getStatusText(activeDelivery.status)}
          </Text>
          <Text style={styles.deliveryAddress}>
            Vers: {activeDelivery.deliveryAddress.street}, {activeDelivery.deliveryAddress.city}
          </Text>
          <Button
            onPress={() => router.push('/tracking')}
            style={styles.trackButton}
          >
            Suivre la livraison
          </Button>
        </View>
      )}

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionGrid}>
          <Pressable
            style={styles.actionCard}
            onPress={() => router.push('/create-delivery')}
          >
            <Text style={styles.actionIcon}>📦</Text>
            <Text style={styles.actionTitle}>Nouvelle livraison</Text>
            <Text style={styles.actionDescription}>Créer une demande</Text>
          </Pressable>

          <Pressable
            style={styles.actionCard}
            onPress={() => router.push('/tracking')}
          >
            <Text style={styles.actionIcon}>📍</Text>
            <Text style={styles.actionTitle}>Suivi</Text>
            <Text style={styles.actionDescription}>Suivre vos colis</Text>
          </Pressable>

          <Pressable
            style={styles.actionCard}
            onPress={() => router.push('/history')}
          >
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionTitle}>Historique</Text>
            <Text style={styles.actionDescription}>Vos livraisons</Text>
          </Pressable>

          {user.userType === 'supplier' && (
            <Pressable
              style={styles.actionCard}
              onPress={() => {/* Navigate to dashboard */}}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionTitle}>Tableau de bord</Text>
              <Text style={styles.actionDescription}>Statistiques</Text>
            </Pressable>
          )}
        </View>
      </View>

      {recentDeliveries.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Livraisons récentes</Text>
          {recentDeliveries.map((delivery) => (
            <View key={delivery.id} style={styles.deliveryItem}>
              <View style={styles.deliveryInfo}>
                <Text style={styles.deliveryDestination}>
                  {delivery.deliveryAddress.city}
                </Text>
                <Text style={styles.deliveryDate}>
                  {new Date(delivery.createdAt).toLocaleDateString('fr-FR')}
                </Text>
              </View>
              <View style={styles.deliveryStatus}>
                <Text style={[styles.statusBadge, getStatusStyle(delivery.status)]}>
                  {getStatusText(delivery.status)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    pending: 'En attente',
    accepted: 'Acceptée',
    picked_up: 'Récupérée',
    in_transit: 'En transit',
    delivered: 'Livrée',
    cancelled: 'Annulée',
  };
  return statusMap[status] || status;
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'delivered':
      return { backgroundColor: '#e8f5e8', color: '#2e7d32' };
    case 'in_transit':
    case 'picked_up':
      return { backgroundColor: '#e3f2fd', color: '#1976d2' };
    case 'cancelled':
      return { backgroundColor: '#ffebee', color: '#d32f2f' };
    default:
      return { backgroundColor: '#fff3e0', color: '#f57c00' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  activeDeliveryCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  deliveryStatus: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  deliveryAddress: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 12,
  },
  trackButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 24,
  },
  deliveryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryDestination: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  deliveryDate: {
    fontSize: 12,
    color: '#666666',
  },
  statusBadge: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
