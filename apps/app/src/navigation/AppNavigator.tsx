import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';
import { EditPostScreen } from '../screens/EditPostScreen';
import { PostDetailsScreen } from '../screens/PostDetailsScreen';
import { PostListScreen } from '../screens/PostListScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShadowVisible: false,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 14,
          color: '#111827',
        },
        contentStyle: {
          backgroundColor: '#f3f4f6',
        },
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="Posts" component={PostListScreen} options={{ title: 'Posts' }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
      <Stack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'New Post' }} />
      <Stack.Screen name="PostDetails" component={PostDetailsScreen} options={{ title: 'Post' }} />
      <Stack.Screen name="EditPost" component={EditPostScreen} options={{ title: 'Edit Post' }} />
    </Stack.Navigator>
  );
}
