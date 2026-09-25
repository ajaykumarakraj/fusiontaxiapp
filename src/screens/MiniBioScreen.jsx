
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MiniBioScreen = ({navigation}) => {
  const [bio, setBio] = useState('');

  const maxLength = 200;

  const saveBio = () => {
    const trimmedBio = bio.trim();

    if (!trimmedBio) {
      return;
    }

    console.log('Mini Bio:', trimmedBio);

    // API call yahan add kar sakte hain
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={23} color="#222" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Mini Bio</Text>

        <View style={styles.headerSpace} />
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}>

          <View style={styles.iconCircle}>
            <Icon
              name="person-outline"
              size={34}
              color="#E50914"
            />
          </View>

          <Text style={styles.heading}>
            Tell travellers a little about you
          </Text>

          <Text style={styles.description}>
            Add a short introduction so other travellers can
            know a little more about you before the journey.
          </Text>

          <Text style={styles.label}>
            Your mini bio
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              value={bio}
              onChangeText={text => {
                if (text.length <= maxLength) {
                  setBio(text);
                }
              }}
              placeholder="Example: Friendly traveller who enjoys music and meeting new people."
              placeholderTextColor="#999"
              multiline
              maxLength={maxLength}
              textAlignVertical="top"
              style={styles.input}
            />

            <Text style={styles.counter}>
              {bio.length}/{maxLength}
            </Text>
          </View>

          <Text style={styles.tipTitle}>
            Tips for a good bio
          </Text>

          <View style={styles.tipRow}>
            <Icon
              name="checkmark-circle"
              size={18}
              color="#E50914"
            />
            <Text style={styles.tipText}>
              Keep it short and friendly
            </Text>
          </View>

          <View style={styles.tipRow}>
            <Icon
              name="checkmark-circle"
              size={18}
              color="#E50914"
            />
            <Text style={styles.tipText}>
              Mention your travel interests
            </Text>
          </View>

          <View style={styles.tipRow}>
            <Icon
              name="checkmark-circle"
              size={18}
              color="#E50914"
            />
            <Text style={styles.tipText}>
              Avoid sharing sensitive personal information
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.saveButton,
              !bio.trim() && styles.disabledButton,
            ]}
            activeOpacity={0.8}
            disabled={!bio.trim()}
            onPress={saveBio}>
            <Text style={styles.saveText}>
              Save Bio
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MiniBioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },

  header: {
    height: 60,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
  },

  headerSpace: {
    width: 42,
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EAF4FF',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 18,
  },

  heading: {
    fontSize: 21,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
  },

  description: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E2E2',
    minHeight: 155,
    padding: 14,
  },

  input: {
    flex: 1,
    minHeight: 115,
    fontSize: 14,
    color: '#222',
    lineHeight: 21,
  },

  counter: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
    marginTop: 5,
  },

  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginTop: 25,
    marginBottom: 12,
  },

  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  tipText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },

  saveButton: {
    height: 52,
    backgroundColor: '#E50914',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  disabledButton: {
    backgroundColor: '#B9D5EF',
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

