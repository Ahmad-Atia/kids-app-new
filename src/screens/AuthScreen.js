import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useApp } from '../context/AppContext';
import AuthService from '../services/AuthService';
import UserService from '../services/UserService';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    address: '',
    dateOfBirth: '',
    interests: []
  });

  const { setUser, setLoading: setAppLoading } = useApp();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;

    setLoading(true);
    setAppLoading(true);

    try {
      if (isLogin) {
        // Login
        if (!formData.email || !formData.password) {
          Alert.alert('Error', 'Please enter email and password');
          return;
        }

        const result = await AuthService.login({
          email: formData.email,
          password: formData.password
        });
        
        if (result.success) {
          setUser(result.user);
          Alert.alert('Success', 'Login successful!');
        } else {
          Alert.alert('Login Failed', result.error || 'Invalid credentials');
        }
      } else {
        // Register
        const validation = UserService.validateUserData(formData);
        
        if (!validation.isValid) {
          Alert.alert('Validation Error', validation.errors.join('\n'));
          return;
        }

        const result = await AuthService.register(formData);
        
        if (result.success) {
          Alert.alert('Success', 'Registration successful! Please login.');
          setIsLogin(true);
          setFormData({
            name: '',
            lastname: '',
            email: '',
            password: '',
            address: '',
            dateOfBirth: '',
            interests: []
          });
        } else {
          Alert.alert('Registration Failed', result.error || 'Registration failed');
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
      setAppLoading(false);
    }
  };

  const handleGuestMode = () => {
    setUser({ guest: true });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>PartiZip Kids</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back!' : 'Join the Community!'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastname}
                onChangeText={(value) => handleInputChange('lastname', value)}
              />
            </>
          )}

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            secureTextEntry
          />

          {!isLogin && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Address (Optional)"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
              />
              <TextInput
                style={styles.input}
                placeholder="Date of Birth (YYYY-MM-DD)"
                value={formData.dateOfBirth}
                onChangeText={(value) => handleInputChange('dateOfBirth', value)}
              />
            </>
          )}

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <Text style={styles.buttonText}>Loading...</Text>
            ) : (
              <Text style={styles.buttonText}>
                {isLogin ? 'Login' : 'Register'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            <Text style={styles.switchText}>
              {isLogin 
                ? "Don't have an account? Register" 
                : "Already have an account? Login"
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.guestButton]}
            onPress={handleGuestMode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Continue as Guest</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  guestButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 15,
    alignItems: 'center',
  },
  switchText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default AuthScreen;
