
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useDelivery } from '../../contexts/DeliveryContext';
import { DeliveryRequest } from '../../types';

export default function HistoryScreen() {
  const { user } = useAuth();
  const { getDeliveryHistory } = useDelivery();

  if (!user) {
    return null;
  }

  const deliveryHistory = getDeliveryHistory(user.id);

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

  const renderDeliveryItem = (delivery: DeliveryRequest) => (
    <Pressable key={delivery.id} style={styles.deliveryCard}>
      <View style={styles.deliveryHeader}>
        <Text style={styles.deliveryId}>#{delivery.id}</Text>
        <Text style={[styles.statusBadge, getStatusStyle(delivery.status)]}>
          {getStatusText(delivery.status)}
        </Text>
      </View>
      
      <View style={styles.deliveryRoute}>
        <View style={styles.routePoint}>
          <Text style={styles.routeIcon}>📍</Text>
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>De:</Text>
            <Text style={styles.routeAddress}>
              {delivery.pickupAddress.city}
            </Text>
          </View>
        </View>
        
        <View style={styles.routeLine} />
        
        <View style={styles.routePoint}>
          <Text style={styles.routeIcon}>🎯</Text>
          <View style={styles.routeInfo}>
            <Text style={styles.routeLabel}>Vers:</Text>
            <Text style={styles.routeAddress}>
              {delivery.deliveryAddress.city}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.deliveryDetails}>
        <Text style={styles.packageDescription}>
          {delivery.packageDescription}
        </Text>
        <Text style={styles.deliveryDate}>
          {new Date(delivery.createdAt).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.deliveryFooter}>
        <Text style={styles.deliveryPrice}>
          {delivery.finalPrice || delivery.estimatedPrice} €
        </Text>
        {delivery.status === 'delivered' && (
          <Text style={styles.deliveredText}>✅ Livré</Text>
        )}
      </View>
    </Pressable>
  );

  if (deliveryHistory.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Historique</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📋</Text>
          <Text style={styles.emptyTitle}>Aucune livraison</Text>
          <Text style={styles.emptyDescription}>
            Vos livraisons passées apparaîtront ici
          </Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Historique</Text>
        <Text style={styles.subtitle}>
          {deliveryHistory.length} livraison{deliveryHistory.length > 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.deliveryList}>
        {deliveryHistory.map(renderDeliveryItem)}
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  deliveryList: {
    gap: 16,
  },
  deliveryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryId: {
    fontSize: 14,
    fontWeight: '600',
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
  deliveryRoute: {
    marginBottom: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  routeLine: {
    width: 2,
    height: 16,
    backgroundColor: '#e0e0e0',
    marginLeft: 9,
    marginVertical: 4,
  },
  deliveryDetails: {
    marginBottom: 12,
  },
  packageDescription: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: 12,
    color: '#666666',
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  deliveredText: {
    fontSize: 12,
    color: '#4caf50',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
