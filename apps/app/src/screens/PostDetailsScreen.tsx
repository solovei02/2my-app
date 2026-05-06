import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../auth/AuthContext';
import { DeletePostModal } from '../components/DeletePostModal';
import { RootStackParamList } from '../navigation/types';
import { postsApi } from '../services/postsApi';
import { Post } from '../types/post';
import { formatPostDate } from '../utils/formatPostDate';

type DetailsRoute = RouteProp<RootStackParamList, 'PostDetails'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'PostDetails'>;

export function PostDetailsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DetailsRoute>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [error, setError] = useState('');

  const loadPost = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await postsApi.getOne(route.params.postId);
      setPost(data);
      setError('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load post');
    } finally {
      setIsLoading(false);
    }
  }, [route.params.postId]);

  useFocusEffect(
    useCallback(() => {
      void loadPost();
    }, [loadPost]),
  );

  const handleDelete = async () => {
    if (!post) {
      return;
    }

    setIsDeleting(true);

    try {
      await postsApi.remove(post.id);
      setDeleteModalVisible(false);
      Alert.alert('Post deleted', 'The post has been removed from the list.');
      navigation.navigate('Posts');
    } catch (requestError) {
      Alert.alert('Delete failed', requestError instanceof Error ? requestError.message : 'Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <DeletePostModal
        visible={deleteModalVisible}
        isDeleting={isDeleting}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={() => void handleDelete()}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {isLoading ? (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#1976d2" />
            <Text style={styles.helperText}>Loading post...</Text>
          </View>
        ) : error || !post ? (
          <View style={styles.centeredState}>
            <Text style={styles.errorText}>{error || 'Post not found'}</Text>
            <Pressable onPress={() => void loadPost()} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Reload</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View style={styles.contentBlock}>
              <Text style={styles.title}>{post.title}</Text>
              <Text style={styles.meta}>
                {post.authorName} - {formatPostDate(post.createdAt)}
              </Text>
              <Text style={styles.content}>{post.content}</Text>
            </View>

            {user?.id === post.authorId && (
              <View style={styles.actions}>
                <Pressable
                  onPress={() => navigation.navigate('EditPost', { postId: post.id })}
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.primaryButtonText}>Edit Post</Text>
                </Pressable>

                <Pressable
                  onPress={() => setDeleteModalVisible(true)}
                  style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.dangerButtonText}>Delete Post</Text>
                </Pressable>
              </View>
            )}
          </>
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
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  contentBlock: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 10,
  },
  content: {
    fontSize: 14,
    lineHeight: 22,
    color: '#111827',
  },
  actions: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#1976d2',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  dangerButton: {
    backgroundColor: '#dc2626',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonPressed: {
    opacity: 0.86,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  dangerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  helperText: {
    color: '#6b7280',
    fontSize: 14,
  },
  errorText: {
    textAlign: 'center',
    color: '#b42318',
    fontSize: 15,
  },
  secondaryButton: {
    backgroundColor: '#111827',
    borderRadius: 6,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
