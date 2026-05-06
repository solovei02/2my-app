import { useCallback, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useAuth } from '../auth/AuthContext';
import { PostCard } from '../components/PostCard';
import { RootStackParamList } from '../navigation/types';
import { postsApi } from '../services/postsApi';
import { Post } from '../types/post';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Posts'>;

export function PostListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadPosts = useCallback(async (mode: 'loading' | 'refresh' = 'loading') => {
    if (mode === 'loading') {
      setIsLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const data = await postsApi.getAll();
      setPosts(data);
      setError('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadPosts();
    }, [loadPosts]),
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Posts',
      headerRight: () => (
        <View style={styles.headerActions}>
          {user ? (
            <>
              <Pressable
                onPress={() => navigation.navigate('CreatePost')}
                style={({ pressed }) => [styles.headerButton, pressed && styles.headerButtonPressed]}
              >
                <Text style={styles.headerButtonText}>+</Text>
              </Pressable>
              <Pressable
                onPress={() => void logout()}
                style={({ pressed }) => [styles.authButton, pressed && styles.headerButtonPressed]}
              >
                <Text style={styles.authButtonText}>Logout</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              onPress={() => navigation.navigate('Login')}
              style={({ pressed }) => [styles.authButton, pressed && styles.headerButtonPressed]}
            >
              <Text style={styles.authButtonText}>Login</Text>
            </Pressable>
          )}
        </View>
      ),
    });
  }, [logout, navigation, user]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.centeredState}>
            <ActivityIndicator size="large" color="#1976d2" />
            <Text style={styles.helperText}>Loading posts...</Text>
          </View>
        ) : error ? (
          <View style={styles.centeredState}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => void loadPosts()} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PostCard post={item} onPress={() => navigation.navigate('PostDetails', { postId: item.id })} />
            )}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={() => void loadPosts('refresh')} />
            }
            contentContainerStyle={posts.length === 0 ? styles.emptyListContent : styles.listContent}
            ListEmptyComponent={<Text style={styles.helperText}>There are no posts yet.</Text>}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authButton: {
    minHeight: 32,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonPressed: {
    opacity: 0.86,
  },
  headerButtonText: {
    color: '#111827',
    fontSize: 22,
    lineHeight: 22,
    marginTop: -2,
  },
  authButtonText: {
    color: '#111827',
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  centeredState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  helperText: {
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 14,
  },
  errorText: {
    textAlign: 'center',
    color: '#b42318',
    fontSize: 15,
  },
  retryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#111827',
  },
  retryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  separator: {
    height: 0,
  },
});
