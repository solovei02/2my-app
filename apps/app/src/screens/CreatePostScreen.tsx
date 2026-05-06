import { useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../auth/AuthContext';
import { PostForm } from '../components/PostForm';
import { RootStackParamList } from '../navigation/types';
import { postsApi } from '../services/postsApi';
import { PostInput } from '../types/post';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePost'>;

export function CreatePostScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (value: PostInput) => {
    if (!user) {
      Alert.alert('Login required', 'Login before creating a post.');
      navigation.navigate('Login');
      return;
    }

    const payload = {
      title: value.title.trim(),
      content: value.content.trim(),
    };

    if (!payload.title || !payload.content) {
      Alert.alert('Validation error', 'Fill in title and body before saving the post.');
      return;
    }

    try {
      setIsSubmitting(true);
      await postsApi.create(payload);
      Alert.alert('Post created', 'The new post was added to the list.');
      navigation.navigate('Posts');
    } catch (requestError) {
      Alert.alert('Save failed', requestError instanceof Error ? requestError.message : 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <PostForm submitLabel="Create post" isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    padding: 12,
  },
});
