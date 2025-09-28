
export type UserType = 'client' | 'supplier' | 'driver';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  avatar?: string;
  isVerified?: boolean;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export type PackageSize = 'small' | 'medium' | 'large';
export type DeliverySpeed = 'standard' | 'express';
export type DeliveryStatus = 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';

export interface DeliveryRequest {
  id: string;
  clientId: string;
  driverId?: string;
  pickupAddress: Address;
  deliveryAddress: Address;
  packageSize: PackageSize;
  packageWeight?: number;
  packageDescription: string;
  packagePhoto?: string;
  deliverySpeed: DeliverySpeed;
  estimatedPrice: number;
  finalPrice?: number;
  status: DeliveryStatus;
  createdAt: Date;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  driverRating?: number;
  driverComment?: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isOnline: boolean;
  isVerified: boolean;
  vehicleType: string;
  vehiclePlate: string;
  rating: number;
  totalDeliveries: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'delivery_request' | 'status_update' | 'payment' | 'general';
  isRead: boolean;
  createdAt: Date;
  data?: any;
}
