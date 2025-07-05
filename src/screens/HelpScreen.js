import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';

export default function HelpScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqData = [
    {
      id: 1,
      question: 'How do I create an event?',
      answer: 'To create an event, go to the Home screen and tap the "Create Event" button. Fill in the event details including title, description, date, time, location, and maximum participants. Then tap "Create Event" to publish it.',
    },
    {
      id: 2,
      question: 'How do I join an event?',
      answer: 'Browse events on the Events screen or from the Home screen. Tap on an event to view its details, then tap "Join Event" if you want to participate. You can leave an event anytime before it starts.',
    },
    {
      id: 3,
      question: 'What are communities?',
      answer: 'Communities are groups of people with shared interests. You can join communities to connect with like-minded individuals and see events organized by community members.',
    },
    {
      id: 4,
      question: 'How do I create a community?',
      answer: 'Go to the Community screen and tap "Create Community". Provide a name, description, and set whether it\'s public or private. Once created, you can invite members and organize events.',
    },
    {
      id: 5,
      question: 'Can I use the app without an account?',
      answer: 'Yes, you can browse events and communities as a guest. However, to join events, create communities, or participate in activities, you\'ll need to create an account.',
    },
    {
      id: 6,
      question: 'How do I edit my profile?',
      answer: 'Go to the Profile screen and tap "Edit Profile". You can update your name, email, age, and bio. Don\'t forget to save your changes.',
    },
    {
      id: 7,
      question: 'How do I provide feedback for an event?',
      answer: 'After attending an event, you can rate it and leave feedback. This helps other users and event organizers improve future events.',
    },
    {
      id: 8,
      question: 'How do I report inappropriate content?',
      answer: 'If you encounter inappropriate content or behavior, please use the report feature available in event details or contact our support team.',
    },
  ];

  const filteredFaq = faqData.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'You can reach us at:\n\nEmail: support@partizip.com\nPhone: +1-234-567-8900\n\nWe typically respond within 24 hours.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>
            Find answers to common questions or contact our support team
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {filteredFaq.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.faqItem}
              onPress={() => toggleFaq(item.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqToggle}>
                  {expandedFaq === item.id ? '−' : '+'}
                </Text>
              </View>
              {expandedFaq === item.id && (
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleContactSupport}
          >
            <Text style={styles.actionButtonText}>Contact Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'Feature coming soon')}
          >
            <Text style={styles.actionButtonText}>Report a Bug</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => Alert.alert('Info', 'Feature coming soon')}
          >
            <Text style={styles.actionButtonText}>Request a Feature</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getting Started</Text>
          <Text style={styles.guideText}>
            Welcome to PartiZip! Here's how to get started:
          </Text>
          <Text style={styles.guideStep}>
            1. Create an account or continue as a guest
          </Text>
          <Text style={styles.guideStep}>
            2. Browse events and communities that interest you
          </Text>
          <Text style={styles.guideStep}>
            3. Join events to participate in activities
          </Text>
          <Text style={styles.guideStep}>
            4. Create your own events and invite others
          </Text>
          <Text style={styles.guideStep}>
            5. Join communities to connect with like-minded people
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Still need help? Our support team is here to assist you!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 30,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  faqToggle: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  guideText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  guideStep: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
