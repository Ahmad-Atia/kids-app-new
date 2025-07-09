import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { useApp } from '../context/AppContext';
import EventService from '../services/EventService';

const categories = ['Alle', 'Outdoor', 'Kultur', 'Sport'];

// Mapping of common locations to coordinates (fallback for events without coords)
const locationCoordinates = {
  'Stadtpark': { latitude: 51.5363, longitude: 7.2005 },
  'Jugendzentrum': { latitude: 51.5309, longitude: 7.2145 },
  'Bolzplatz': { latitude: 51.5340, longitude: 7.2090 },
  'Sporthalle': { latitude: 51.5320, longitude: 7.2080 },
  'Bibliothek': { latitude: 51.5355, longitude: 7.2125 },
  'Schwimmbad': { latitude: 51.5380, longitude: 7.2160 },
  'Spielplatz': { latitude: 51.5345, longitude: 7.2055 },
  'Schule': { latitude: 51.5330, longitude: 7.2110 },
  'Rathaus': { latitude: 51.5350, longitude: 7.2100 },
  'Marktplatz': { latitude: 51.5360, longitude: 7.2115 },
};

// Function to get coordinates for an event
const getEventCoordinates = (event) => {
  // Try to match location string to known coordinates
  const location = event.location || '';
  const matchedLocation = Object.keys(locationCoordinates).find(key => 
    location.toLowerCase().includes(key.toLowerCase())
  );
  
  if (matchedLocation) {
    return locationCoordinates[matchedLocation];
  }
  
  // Default fallback coordinates
  return { latitude: 51.5350, longitude: 7.2100 };
};



export default function MapScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [userLocation, setUserLocation] = useState(null);
  const { user } = useApp();

  useEffect(() => {
    loadEvents();
    getCurrentLocation();
  }, []);

  useEffect(() => {
    // Filter events based on search query and category
    let filtered = events;
    
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(event => {
        if (!event) return false;
        
        const name = event.name || event.title || '';
        const description = event.description || '';
        const location = event.location || '';
        
        return name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               description.toLowerCase().includes(searchQuery.toLowerCase()) ||
               location.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    
    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }
    
    setFilteredEvents(filtered);
  }, [searchQuery, events, selectedCategory]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Standort deaktiviert', 'Bitte erlaube den Standortzugriff.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };
 
   const loadEvents = async () => {
     try {
       const result = await EventService.getAllEvents();
       console.log('[DEBUG] Events loaded:', result);
       if (result.success) {
         // Filter out any null/undefined events
         const validEvents = result.events.filter(event => event != null);
         console.log('[DEBUG] Valid events:', validEvents.length, 'out of', result.events.length);
         setEvents(validEvents);
         setFilteredEvents(validEvents);
       } else {
         console.error('[ERROR] Failed to load events:', result.error);
         Alert.alert('Error', result.error || 'Failed to load events');
       }
     } catch (error) {
       console.error('[ERROR] Exception loading events:', error);
       Alert.alert('Error', 'Failed to load events');
     } finally {
       setLoading(false);
       setRefreshing(false);
     }
   };
 
   const onRefresh = () => {
     setRefreshing(true);
     loadEvents();
   };
 
   
     const handleParticipate = async (event) => {
       if (!user || user.guest) {
         Alert.alert('Login Required', 'Please login to participate in events');
         return;
       }
   
       try {
         const result = await EventService.participateInEvent(event.id, user.id);
         if (result.success) {
           Alert.alert('Success', 'Successfully joined the event!');
           loadEvents(); // Refresh events
         } else {
           Alert.alert('Error', result.error || 'Failed to join event');
         }
       } catch (error) {
         Alert.alert('Error', 'Failed to join event');
       }
     };
   
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 51.5350,
            longitude: 7.2100,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
        >
          {filteredEvents.map((event) => (
            <Marker
              key={event.id}
              coordinate={getEventCoordinates(event)}
            >
              <Callout onPress={() => navigation.navigate('EventDetails', { event })}>
                <View style={{ maxWidth: 200 }}>
                  <Text style={{ fontWeight: 'bold' }}>{event.name || event.title}</Text>
                  <Text>{event.description}</Text>
                  <Text style={{ fontStyle: 'italic' }}>{event.category}</Text>
                  <Text style={{ color: '#888' }}>{event.location}</Text>
                  <Text style={{ color: '#888' }}>{event.date}</Text>
                  <Text style={{ color: 'blue', marginTop: 5 }}>➤ Details anzeigen</Text>
                </View>
              </Callout>
            </Marker>
          ))}

          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Du bist hier"
              pinColor="blue"
            />
          )}
        </MapView>

        {/* Chips-Bar über der Map */}
        <View style={styles.chipContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.chip,
                  selectedCategory === cat && styles.chipActive
                ]}
              >
                <Text style={[
                  styles.chipText,
                  selectedCategory === cat && styles.chipTextActive
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  map: { flex: 1 },

  chipContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    paddingVertical: 6,
  },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  chipActive: {
    backgroundColor: '#2196F3',
    borderColor: '#1976D2',
  },
  chipText: {
    fontSize: 14,
    color: '#333',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
});