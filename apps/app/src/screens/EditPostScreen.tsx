import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { PostForm } from '../components/PostForm';
import { RootStackParamList } from '../navigation/types';
import { postsApi } from '../services/postsApi';
import { PostFormValue, PostInput } from '../types/post';

type EditRoute = RouteProp<RootStackParamList, 'EditPost'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditPost'>;

const emptyPost: PostFormValue = {
  title: '',
  content: '',
};

export function EditPostScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<EditRoute>();
  const [initialValue, setInitialValue] = useState<PostFormValue>(emptyPost);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPost = async () => {
      try {
        const post = await postsApi.getOne(route.params.postId);

        if (isMounted) {
          setInitialValue({
            title: post.title,
            content: post.content,
          });
        }
      } catch (requestError) {
        Alert.alert('Loading failed', requestError instanceof Error ? requestError.message : 'Please try again.');
        navigation.goBack();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadPost();

    return () => {
      isMounted = false;
    };
  }, [navigation, route.params.postId]);

  const handleSubmit = async (value: PostInput) => {
    const payload = {
      title: value.title.trim(),
      content: value.content.trim(),
    };

    if (!payload.title || !payload.content) {
      Alert.alert('Validation error', 'Fill in title and body before saving the post.');
      return;
    }

    setIsSubmitting(true);

    try {
      await postsApi.update(route.params.postId, payload);
      Alert.alert('Post updated', 'Changes have been saved.');
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
        {isLoading ? (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#1976d2" />
            <Text style={styles.helperText}>Loading form data...</Text>
          </View>
        ) : (
          <PostForm
            initialValue={initialValue}
            submitLabel="Save changes"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        )}
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
  centeredState: {
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 14,
  },
});
