
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TermsConditionsScreen = ({navigation}) => {
  const sections = [
    {
      id: '1',
      title: '1. Introduction',
      content:
        'Welcome to Fusion Taxi. These Terms and Conditions govern your access to and use of the Fusion Taxi application and its services. By using the app, you agree to comply with these terms. If you do not agree, please discontinue using the service.',
    },
    {
      id: '2',
      title: '2. Eligibility and Account',
      content:
        'You must provide accurate and complete information when creating your account. You are responsible for maintaining the confidentiality of your login credentials and for activities performed through your account. Please notify us if you suspect unauthorized access.',
    },
    {
      id: '3',
      title: '3. Booking and Rides',
      content:
        'Users must provide correct pickup and drop-off details, select the required number of seats, and verify ride information before confirming a booking. Ride availability, routes, estimated arrival times, and fares may vary depending on the circumstances.',
    },
    {
      id: '4',
      title: '4. Payments and Charges',
      content:
        'Applicable ride charges and any additional fees will be communicated through the app or by the service provider. Users are responsible for paying the confirmed amount using the available payment method. Any refund will be handled according to the applicable refund policy.',
    },
    {
      id: '5',
      title: '5. Cancellation Policy',
      content:
        'Users should cancel bookings as early as possible if their plans change. Cancellation fees, if any, will depend on the applicable cancellation policy displayed in the app. Fusion Taxi may cancel or modify a booking where necessary due to safety, availability, or operational issues.',
    },
    {
      id: '6',
      title: '6. User Responsibilities',
      content:
        'Users must behave respectfully toward drivers and other passengers. Harassment, abusive conduct, fraudulent activity, misuse of the app, and illegal activities are prohibited. Users must follow applicable traffic rules and safety instructions during a ride.',
    },
    {
      id: '7',
      title: '7. Driver and Vehicle Safety',
      content:
        'Users should verify the vehicle and driver details provided for their ride before boarding. Do not board a vehicle if the details do not match your booking. Report unsafe conduct or suspicious activity to the appropriate authorities and our support team.',
    },
    {
      id: '8',
      title: '8. Prohibited Activities',
      content:
        'You must not use the app for unlawful purposes, submit misleading information, interfere with app functionality, attempt unauthorized access, or engage in activities that may harm other users or the service.',
    },
    {
      id: '9',
      title: '9. Limitation of Liability',
      content:
        'To the extent permitted by applicable law, Fusion Taxi is not responsible for indirect or consequential losses arising from app usage or service interruptions. Nothing in these terms excludes liability that cannot legally be excluded under applicable law.',
    },
    {
      id: '10',
      title: '10. Changes to These Terms',
      content:
        'Fusion Taxi may update these Terms and Conditions from time to time. Updated terms will be published through the app or another appropriate channel. Continued use of the service after an update may constitute acceptance where permitted by applicable law.',
    },
    {
      id: '11',
      title: '11. Contact Us',
      content:
        'If you have any questions about these Terms and Conditions, please contact our support team using the contact details provided in the app.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor="#FFFFFF"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#111827"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Terms & Conditions</Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Intro Card */}
        <View style={styles.introCard}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="document-text-outline"
              size={34}
              color="#FFFFFF"
            />
          </View>

          <Text style={styles.mainTitle}>
            Terms & Conditions
          </Text>

          <Text style={styles.introText}>
            Please read these terms carefully before using Fusion Taxi.
          </Text>

          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#6B7280"
            />
            <Text style={styles.dateText}>
              Last updated: 13 October 2026
            </Text>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeCard}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#111827"
          />

          <Text style={styles.noticeText}>
            By accessing or using Fusion Taxi, you acknowledge that you
            have read and understood these terms.
          </Text>
        </View>

        {/* Terms Sections */}
        {sections.map((section, index) => (
          <View
            key={section.id}
            style={[
              styles.sectionCard,
              index === sections.length - 1 && styles.lastSection,
            ]}>
            <Text style={styles.sectionTitle}>
              {section.title}
            </Text>

            <Text style={styles.sectionContent}>
              {section.content}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={22}
            color="#6B7280"
          />

          <Text style={styles.footerTitle}>
            Thank you for choosing Fusion Taxi
          </Text>

          <Text style={styles.footerSubtitle}>
            Travel safely and enjoy your journey.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsConditionsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },

  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
  },

  headerRight: {
    width: 40,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 35,
  },

  introCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginBottom: 16,
  },

  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  mainTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },

  introText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 10,
  },

  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },

  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },

  noticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 13,
    marginBottom: 20,
    gap: 10,
  },

  noticeText: {
    flex: 1,
    fontSize: 13,
    color: '#374151',
    lineHeight: 20,
  },

  sectionCard: {
    paddingBottom: 19,
    marginBottom: 19,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 9,
  },

  sectionContent: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 23,
    textAlign: 'left',
  },

  lastSection: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },

  footer: {
    alignItems: 'center',
    paddingTop: 22,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  footerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginTop: 10,
  },

  footerSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
});
