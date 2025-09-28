
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeliveryRequest, Driver, Address, PackageSize, DeliverySpeed } from '../types';

interface DeliveryContextType {
  deliveries: DeliveryRequest[];
  activeDelivery: DeliveryRequest | null;
  nearbyDrivers: Driver[];
  isLoading: boolean;
  createDeliveryRequest: (request: Omit<DeliveryRequest, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  acceptDelivery: (deliveryId: string, driverId: string) => Promise<void>;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryRequest['status']) => Promise<void>;
  calculatePrice: (pickupAddress: Address, deliveryAddress: Address, packageSize: PackageSize, speed: DeliverySpeed) => number;
  getDeliveryHistory: (userId: string) => DeliveryRequest[];
}

const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};

export const DeliveryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deliveries, setDeliveries] = useState<DeliveryRequest[]>([]);
  const [activeDelivery, setActiveDelivery] = useState<DeliveryRequest | null>(null);
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadDeliveries();
    loadNearbyDrivers();
  }, []);

  const loadDeliveries = async () => {
    try {
      const deliveriesData = await AsyncStorage.getItem('deliveries');
      if (deliveriesData) {
        const parsedDeliveries = JSON.parse(deliveriesData);
        setDeliveries(parsedDeliveries);
        
        // Find active delivery
        const active = parsedDeliveries.find((d: DeliveryRequest) => 
          ['accepted', 'picked_up', 'in_transit'].includes(d.status)
        );
        setActiveDelivery(active || null);
      }
    } catch (error) {
      console.log('Error loading deliveries:', error);
    }
  };

  const loadNearbyDrivers = async () => {
    // Mock nearby drivers
    const mockDrivers: Driver[] = [
      {
        id: '1',
        name: 'Pierre Martin',
        email: 'pierre@example.com',
        phone: '+33 6 12 34 56 78',
        isOnline: true,
        isVerified: true,
        vehicleType: 'Scooter',
        vehiclePlate: 'AB-123-CD',
        rating: 4.8,
        totalDeliveries: 156,
        currentLocation: { latitude: 48.8566, longitude: 2.3522 },
      },
      {
        id: '2',
        name: 'Marie Dubois',
        email: 'marie@example.com',
        phone: '+33 6 98 76 54 32',
        isOnline: true,
        isVerified: true,
        vehicleType: 'Vélo',
        vehiclePlate: 'N/A',
        rating: 4.9,
        totalDeliveries: 203,
        currentLocation: { latitude: 48.8606, longitude: 2.3376 },
      },
    ];
    setNearbyDrivers(mockDrivers);
  };

  const createDeliveryRequest = async (request: Omit<DeliveryRequest, 'id' | 'createdAt' | 'status'>) => {
    try {
      setIsLoading(true);
      const newDelivery: DeliveryRequest = {
        ...request,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        status: 'pending',
      };

      const updatedDeliveries = [...deliveries, newDelivery];
      setDeliveries(updatedDeliveries);
      await AsyncStorage.setItem('deliveries', JSON.stringify(updatedDeliveries));
    } catch (error) {
      console.log('Error creating delivery request:', error);
      throw new Error('Erreur lors de la création de la demande');
    } finally {
      setIsLoading(false);
    }
  };

  const acceptDelivery = async (deliveryId: string, driverId: string) => {
    try {
      const updatedDeliveries = deliveries.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, driverId, status: 'accepted' as const }
          : delivery
      );
      
      setDeliveries(updatedDeliveries);
      const acceptedDelivery = updatedDeliveries.find(d => d.id === deliveryId);
      setActiveDelivery(acceptedDelivery || null);
      
      await AsyncStorage.setItem('deliveries', JSON.stringify(updatedDeliveries));
    } catch (error) {
      console.log('Error accepting delivery:', error);
    }
  };

  const updateDeliveryStatus = async (deliveryId: string, status: DeliveryRequest['status']) => {
    try {
      const updatedDeliveries = deliveries.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status, actualDeliveryTime: status === 'delivered' ? new Date() : delivery.actualDeliveryTime }
          : delivery
      );
      
      setDeliveries(updatedDeliveries);
      
      if (['delivered', 'cancelled'].includes(status)) {
        setActiveDelivery(null);
      } else {
        const activeDelivery = updatedDeliveries.find(d => d.id === deliveryId);
        setActiveDelivery(activeDelivery || null);
      }
      
      await AsyncStorage.setItem('deliveries', JSON.stringify(updatedDeliveries));
    } catch (error) {
      console.log('Error updating delivery status:', error);
    }
  };

  const calculatePrice = (pickupAddress: Address, deliveryAddress: Address, packageSize: PackageSize, speed: DeliverySpeed): number => {
    // Simple price calculation based on distance and package size
    const basePrice = 5.0;
    const sizeMultiplier = { small: 1, medium: 1.5, large: 2 };
    const speedMultiplier = { standard: 1, express: 1.8 };
    
    // Mock distance calculation (in real app, use geolocation)
    const mockDistance = Math.random() * 10 + 2; // 2-12 km
    const distancePrice = mockDistance * 0.8;
    
    return Math.round((basePrice + distancePrice) * sizeMultiplier[packageSize] * speedMultiplier[speed] * 100) / 100;
  };

  const getDeliveryHistory = (userId: string): DeliveryRequest[] => {
    return deliveries.filter(delivery => 
      delivery.clientId === userId || delivery.driverId === userId
    );
  };

  return (
    <DeliveryContext.Provider value={{
      deliveries,
      activeDelivery,
      nearbyDrivers,
      isLoading,
      createDeliveryRequest,
      acceptDelivery,
      updateDeliveryStatus,
      calculatePrice,
      getDeliveryHistory,
    }}>
      {children}
    </DeliveryContext.Provider>
  );
};
