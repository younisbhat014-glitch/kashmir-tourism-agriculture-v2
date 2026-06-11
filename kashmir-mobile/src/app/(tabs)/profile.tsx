import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ScreenHeader } from '@/components/screen-header';
import { colors } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const signOut = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <View style={styles.page}>
      <ScreenHeader title="Profile" subtitle="Your Kashmir Portal account" />
      <View style={styles.content}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase()}</Text></View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.role}>{user?.role === 'admin' ? 'Administrator' : 'Portal Member'}</Text>
        <Pressable onPress={signOut} style={styles.button}><Text style={styles.buttonText}>Sign Out</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.mist },
  content: { alignItems: 'center', padding: 24 },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center', marginTop: 22 },
  avatarText: { color: colors.deep, fontSize: 36, fontWeight: '800' },
  name: { color: colors.ink, fontSize: 24, fontWeight: '800', marginTop: 16 },
  email: { color: colors.muted, marginTop: 5 },
  role: { color: colors.teal, fontWeight: '800', marginTop: 12 },
  button: { backgroundColor: colors.danger, borderRadius: 14, paddingHorizontal: 32, paddingVertical: 14, marginTop: 30 },
  buttonText: { color: colors.white, fontWeight: '800' },
});
