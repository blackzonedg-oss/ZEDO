
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useDelivery } from '../../contexts/DeliveryContext';

export default function TrackingScreen() {
  const { user } = useAuth();
  const { activeDelivery } = useDelivery();

  if (!activeDelivery) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📦</Text>
          <Text style={styles.emptyTitle}>Aucune livraison active</Text>
          <Text style={styles.emptyDescription}>
            Vous n'avez pas de livraison en cours actuellement
          </Text>
        </View>
      </View>
    );
  }

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Demande créée', icon: '📝' },
      { key: 'accepted', label: 'Livreur assigné', icon: '👤' },
      { key: 'picked_up', label: 'Colis récupéré', icon: '📦' },
      { key: 'in_transit', label: 'En transit', icon: '🚗' },
      { key: 'delivered', label: 'Livré', icon: '✅' },
    ];

    const currentIndex = steps.findIndex(step => step.key === activeDelivery.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex,
    }));
  };

  const statusSteps = getStatusSteps();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Suivi de livraison</Text>
        <Text style={styles.deliveryId}>#{activeDelivery.id}</Text>
      </View>

      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>
          📍 Carte de suivi en temps réel
        </Text>
        <Text style={styles.mapSubtext}>
          Note: Les cartes react-native-maps ne sont pas supportées dans Natively actuellement.
          Dans une vraie application, vous verriez ici la position du livreur en temps réel.
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.sectionTitle}>Statut de la livraison</Text>
        <View style={styles.statusTimeline}>
          {statusSteps.map((step, index) => (
            <View key={step.key} style={styles.statusStep}>
              <View style={styles.statusStepLeft}>
                <View style={[
                  styles.statusIcon,
                  step.completed && styles.statusIconCompleted,
                  step.active && styles.statusIconActive,
                ]}>
                  <Text style={styles.statusIconText}>{step.icon}</Text>
                </View>
                {index < statusSteps.length - 1 && (
                  <View style={[
                    styles.statusLine,
                    step.completed && styles.statusLineCompleted,
                  ]} />
                )}
              </View>
              <View style={styles.statusStepRight}>
                <Text style={[
                  styles.statusLabel,
                  step.completed && styles.statusLabelCompleted,
                  step.active && styles.statusLabelActive,
                ]}>
                  {step.label}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.deliveryDetails}>
        <Text style={styles.sectionTitle}>Détails de la livraison</Text>
        
        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>De:</Text>
          <Text style={styles.detailValue}>
            {activeDelivery.pickupAddress.street}, {activeDelivery.pickupAddress.city}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Vers:</Text>
          <Text style={styles.detailValue}>
            {activeDelivery.deliveryAddress.street}, {activeDelivery.deliveryAddress.city}
          </Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Colis:</Text>
          <Text style={styles.detailValue}>{activeDelivery.packageDescription}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Prix:</Text>
          <Text style={styles.detailValue}>{activeDelivery.estimatedPrice.toFixed(2)} €</Text>
        </View>
      </View>

      {activeDelivery.estimatedDeliveryTime && (
        <View style={styles.etaCard}>
          <Text style={styles.etaLabel}>Heure d'arrivée estimée</Text>
          <Text style={styles.etaTime}>
            {new Date(activeDelivery.estimatedDeliveryTime).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      )}
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  deliveryId: {
    fontSize: 14,
    color: '#666666',
  },
  mapPlaceholder: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  mapSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
  },
  statusContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statusTimeline: {
    paddingLeft: 8,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusStepLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  statusIconCompleted: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  statusIconActive: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  statusIconText: {
    fontSize: 16,
  },
  statusLine: {
    width: 2,
    height: 40,
    backgroundColor: '#e0e0e0',
    marginTop: 4,
  },
  statusLineCompleted: {
    backgroundColor: '#4caf50',
  },
  statusStepRight: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 32,
  },
  statusLabel: {
    fontSize: 16,
    color: '#666666',
  },
  statusLabelCompleted: {
    color: '#4caf50',
    fontWeight: '500',
  },
  statusLabelActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  deliveryDetails: {
    marginBottom: 24,
  },
  detailCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  etaCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  etaLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  etaTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
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
