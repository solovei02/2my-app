import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PostFormValue, PostInput } from '../types/post';

type PostFormProps = {
  initialValue?: PostFormValue;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (value: PostInput) => Promise<void>;
};

const emptyPost: PostFormValue = {
  title: '',
  content: '',
};

export function PostForm({ initialValue = emptyPost, submitLabel, isSubmitting, onSubmit }: PostFormProps) {
  const [title, setTitle] = useState(initialValue.title);
  const [content, setContent] = useState(initialValue.content);

  useEffect(() => {
    setTitle(initialValue.title);
    setContent(initialValue.content);
  }, [initialValue.content, initialValue.title]);

  return (
    <View style={styles.form}>
      <View style={styles.group}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholderTextColor="#9ca3af"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          maxLength={80}
        />
      </View>

      <View style={styles.group}>
        <Text style={styles.label}>Body</Text>
        <TextInput
          placeholderTextColor="#9ca3af"
          style={[styles.input, styles.multilineInput]}
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
        />
      </View>

      <Pressable
        onPress={() =>
          onSubmit({
            title,
            content,
          })
        }
        disabled={isSubmitting}
        style={({ pressed }) => [
          styles.submitButton,
          (pressed || isSubmitting) && styles.submitButtonPressed,
        ]}
      >
        <Text style={styles.submitButtonText}>{isSubmitting ? 'Saving...' : submitLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 18,
  },
  group: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  multilineInput: {
    minHeight: 86,
  },
  submitButton: {
    backgroundColor: '#1976d2',
    borderRadius: 6,
    paddingVertical: 10,
    alignItems: 'center',
  },
  submitButtonPressed: {
    opacity: 0.86,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
