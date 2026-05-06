import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Post } from '../types/post';
import { formatPostDate } from '../utils/formatPostDate';

type PostCardProps = {
  post: Post;
  onPress: () => void;
};

export function PostCard({ post, onPress }: PostCardProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
      <View>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.meta}>
          {post.authorName} - {formatPostDate(post.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardPressed: {
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  meta: {
    fontSize: 11,
    color: '#6b7280',
  },
});
