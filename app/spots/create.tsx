import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, MapPin } from 'lucide-react-native';

const DIFFICULTY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const SPOT_TYPES = ['Street', 'Park', 'Rail', 'Stairs', 'Ledge', 'Manual Pad'];

export default function CreateSpot() {
  const { latitude, longitude } = useLocalSearchParams();
  const router = useRouter();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreate = () => {
    // Here you would typically save the spot to your backend
    console.log({
      name,
      difficulty,
      type,
      image,
      location: { latitude, longitude },
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add New Spot</Text>
        <View style={styles.location}>
          <MapPin size={16} color="#666" />
          <Text style={styles.locationText}>
            {parseFloat(latitude as string).toFixed(6)}, {parseFloat(longitude as string).toFixed(6)}
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Spot Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter spot name"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Difficulty</Text>
          <View style={styles.optionsGrid}>
            {DIFFICULTY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.optionButton,
                  difficulty === level && styles.optionButtonSelected,
                ]}
                onPress={() => setDifficulty(level)}>
                <Text
                  style={[
                    styles.optionText,
                    difficulty === level && styles.optionTextSelected,
                  ]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Spot Type</Text>
          <View style={styles.optionsGrid}>
            {SPOT_TYPES.map((spotType) => (
              <TouchableOpacity
                key={spotType}
                style={[
                  styles.optionButton,
                  type === spotType && styles.optionButtonSelected,
                ]}
                onPress={() => setType(spotType)}>
                <Text
                  style={[
                    styles.optionText,
                    type === spotType && styles.optionTextSelected,
                  ]}>
                  {spotType}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Spot Photo</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <>
                <Camera size={24} color="#666" />
                <Text style={styles.imageUploadText}>Add Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.createButton, (!name || !difficulty || !type) && styles.createButtonDisabled]}
        onPress={handleCreate}
        disabled={!name || !difficulty || !type}>
        <Text style={styles.createButtonText}>Create Spot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  locationText: {
    color: '#666',
  },
  form: {
    flex: 1,
    gap: 25,
  },
  inputGroup: {
    gap: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  optionButtonSelected: {
    backgroundColor: '#000',
  },
  optionText: {
    color: '#000',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  imageUploadText: {
    color: '#666',
    fontSize: 16,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  createButton: {
    backgroundColor: '#000',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonDisabled: {
    backgroundColor: '#666',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});