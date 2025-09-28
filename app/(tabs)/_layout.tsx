
import React from 'react';
import { Tabs } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { IconSymbol } from '../../components/IconSymbol';

export default function TabLayout() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const getTabsForUserType = () => {
    switch (user.userType) {
      case 'client':
      case 'supplier':
        return (
          <>
            <Tabs.Screen
              name="index"
              options={{
                title: 'Accueil',
                tabBarIcon: ({ color }) => <IconSymbol name="house" color={color} />,
              }}
            />
            <Tabs.Screen
              name="create-delivery"
              options={{
                title: 'Nouvelle livraison',
                tabBarIcon: ({ color }) => <IconSymbol name="plus.circle" color={color} />,
              }}
            />
            <Tabs.Screen
              name="tracking"
              options={{
                title: 'Suivi',
                tabBarIcon: ({ color }) => <IconSymbol name="location" color={color} />,
              }}
            />
            <Tabs.Screen
              name="history"
              options={{
                title: 'Historique',
                tabBarIcon: ({ color }) => <IconSymbol name="clock" color={color} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profil',
                tabBarIcon: ({ color }) => <IconSymbol name="person" color={color} />,
              }}
            />
          </>
        );
      case 'driver':
        return (
          <>
            <Tabs.Screen
              name="driver-home"
              options={{
                title: 'Accueil',
                tabBarIcon: ({ color }) => <IconSymbol name="house" color={color} />,
              }}
            />
            <Tabs.Screen
              name="driver-requests"
              options={{
                title: 'Demandes',
                tabBarIcon: ({ color }) => <IconSymbol name="bell" color={color} />,
              }}
            />
            <Tabs.Screen
              name="driver-active"
              options={{
                title: 'Livraison active',
                tabBarIcon: ({ color }) => <IconSymbol name="location" color={color} />,
              }}
            />
            <Tabs.Screen
              name="driver-earnings"
              options={{
                title: 'Gains',
                tabBarIcon: ({ color }) => <IconSymbol name="dollarsign" color={color} />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: 'Profil',
                tabBarIcon: ({ color }) => <IconSymbol name="person" color={color} />,
              }}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          borderTopWidth: 1,
        },
      }}
    >
      {getTabsForUserType()}
    </Tabs>
  );
}
