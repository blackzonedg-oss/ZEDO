
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useDelivery } from '../../contexts/DeliveryContext';
import { Button } from '../../components/button';
import { TextInput } from '../../components/TextInput';
import { PackageSize, DeliverySpeed, Address } from '../../types';

export default function CreateDeliveryScreen() {
  const { user } = useAuth();
  const { createDeliveryRequest, calculatePrice } = useDelivery();
  
  const [pickupAddress, setPickupAddress] = useState<Partial<Address>>({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  
  const [deliveryAddress, setDeliveryAddress] = useState<Partial<Address>>({
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
  });
  
  const [packageInfo, setPackageInfo] = useState({
    size: 'medium' as PackageSize,
    weight: '',
    description: '',
  });
  
  const [deliverySpeed, setDeliverySpeed] = useState<DeliverySpeed>('standard');
  const [isLoading, setIsLoading] = useState(false);

  const packageSizes = [
    { key: 'small', label: 'Petit', icon: '📦', description: 'Jusqu\'à 2kg' },
    { key: 'medium', label: 'Moyen', icon: '📫', description: '2-10kg' },
    { key: 'large', label: 'Grand', icon: '📮', description: 'Plus de 10kg' },
  ];

  const deliverySpeeds = [
    { key: 'standard', label: 'Standard', icon: '🚶', description: '2-4h', price: '+0€' },
    { key: 'express', label: 'Express', icon: '🏃', description: '30min-1h', price: '+80%' },
  ];

  const estimatedPrice = React.useMemo(() => {
    if (pickupAddress.city && deliveryAddress.city) {
      return calculatePrice(
        pickupAddress as Address,
        deliveryAddress as Address,
        packageInfo.size,
        deliverySpeed
      );
    }
    return 0;
  }, [pickupAddress, deliveryAddress, packageInfo.size, deliverySpeed]);

  const handleSubmit = async () => {
    if (!pickupAddress.street || !pickupAddress.city || !deliveryAddress.street || !deliveryAddress.city) {
      Alert.alert('Erreur', 'Veuillez remplir toutes les adresses');
      return;
    }

    if (!packageInfo.description) {
      Alert.alert('Erreur', 'Veuillez décrire le colis');
      return;
    }

    try {
      setIsLoading(true);
      await createDeliveryRequest({
        clientId: user!.id,
        pickupAddress: {
          id: Math.random().toString(),
          label: 'Adresse de récupération',
          ...pickupAddress,
        } as Address,
        deliveryAddress: {
          id: Math.random().toString(),
          label: 'Adresse de livraison',
          ...deliveryAddress,
        } as Address,
        packageSize: packageInfo.size,
        packageWeight: packageInfo.weight ? parseFloat(packageInfo.weight) : undefined,
        packageDescription: packageInfo.description,
        deliverySpeed,
        estimatedPrice,
      });

      Alert.alert('Succès', 'Votre demande de livraison a été créée !', [
        { text: 'OK', onPress: () => router.push('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de créer la demande');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Nouvelle livraison</Text>
        <Text style={styles.subtitle}>Créez votre demande de livraison</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Adresse de récupération</Text>
        <TextInput
          label="Rue et numéro"
          value={pickupAddress.street}
          onChangeText={(text) => setPickupAddress({ ...pickupAddress, street: text })}
          placeholder="123 Rue de la Paix"
        />
        <View style={styles.row}>
          <View style={styles.flex1}>
            <TextInput
              label="Ville"
              value={pickupAddress.city}
              onChangeText={(text) => setPickupAddress({ ...pickupAddress, city: text })}
              placeholder="Paris"
            />
          </View>
          <View style={styles.flex1}>
            <TextInput
              label="Code postal"
              value={pickupAddress.postalCode}
              onChangeText={(text) => setPickupAddress({ ...pickupAddress, postalCode: text })}
              placeholder="75001"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Adresse de livraison</Text>
        <TextInput
          label="Rue et numéro"
          value={deliveryAddress.street}
          onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, street: text })}
          placeholder="456 Avenue des Champs"
        />
        <View style={styles.row}>
          <View style={styles.flex1}>
            <TextInput
              label="Ville"
              value={deliveryAddress.city}
              onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, city: text })}
              placeholder="Lyon"
            />
          </View>
          <View style={styles.flex1}>
            <TextInput
              label="Code postal"
              value={deliveryAddress.postalCode}
              onChangeText={(text) => setDeliveryAddress({ ...deliveryAddress, postalCode: text })}
              placeholder="69000"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📦 Informations du colis</Text>
        
        <Text style={styles.fieldLabel}>Taille du colis</Text>
        <View style={styles.optionGrid}>
          {packageSizes.map((size) => (
            <Pressable
              key={size.key}
              style={[
                styles.optionCard,
                packageInfo.size === size.key && styles.optionCardSelected,
              ]}
              onPress={() => setPackageInfo({ ...packageInfo, size: size.key as PackageSize })}
            >
              <Text style={styles.optionIcon}>{size.icon}</Text>
              <Text style={styles.optionLabel}>{size.label}</Text>
              <Text style={styles.optionDescription}>{size.description}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput
          label="Poids (optionnel)"
          value={packageInfo.weight}
          onChangeText={(text) => setPackageInfo({ ...packageInfo, weight: text })}
          placeholder="2.5"
          keyboardType="decimal-pad"
        />

        <TextInput
          label="Description du colis"
          value={packageInfo.description}
          onChangeText={(text) => setPackageInfo({ ...packageInfo, description: text })}
          placeholder="Documents, vêtements, etc."
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Vitesse de livraison</Text>
        <View style={styles.speedGrid}>
          {deliverySpeeds.map((speed) => (
            <Pressable
              key={speed.key}
              style={[
                styles.speedCard,
                deliverySpeed === speed.key && styles.speedCardSelected,
              ]}
              onPress={() => setDeliverySpeed(speed.key as DeliverySpeed)}
            >
              <Text style={styles.speedIcon}>{speed.icon}</Text>
              <Text style={styles.speedLabel}>{speed.label}</Text>
              <Text style={styles.speedDescription}>{speed.description}</Text>
              <Text style={styles.speedPrice}>{speed.price}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {estimatedPrice > 0 && (
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Prix estimé</Text>
          <Text style={styles.priceValue}>{estimatedPrice.toFixed(2)} €</Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSubmit}
          loading={isLoading}
          style={styles.submitButton}
        >
          Créer la demande
        </Button>
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
    marginBottom: 32,
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  optionCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  optionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  speedGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  speedCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  speedCardSelected: {
    backgroundColor: '#e3f2fd',
    borderColor: '#007AFF',
  },
  speedIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  speedLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  speedDescription: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  speedPrice: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  priceCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
});
