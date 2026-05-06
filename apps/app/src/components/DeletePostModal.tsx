import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type DeletePostModalProps = {
  visible: boolean;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeletePostModal({ visible, isDeleting, onCancel, onConfirm }: DeletePostModalProps) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>Delete Post</Text>
          <Text style={styles.description}>Are you sure you want to delete this post?</Text>

          <View style={styles.actions}>
            <Pressable onPress={onCancel} disabled={isDeleting} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>

            <Pressable onPress={onConfirm} disabled={isDeleting} style={styles.dangerButton}>
              <Text style={styles.dangerButtonText}>{isDeleting ? 'Deleting...' : 'Delete'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 18,
    width: 238,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6b7280',
    marginBottom: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  dangerButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 10,
  },
  dangerButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    borderRadius: 18,
    alignItems: 'center',
    paddingVertical: 10,
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
});
