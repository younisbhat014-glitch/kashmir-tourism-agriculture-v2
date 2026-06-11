import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, TextInput } from 'react-native';
import { AuthShell, authStyles as styles } from '@/components/auth-shell';
import { colors } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!email || !password) return setError('Enter your email and password.');
    try {
      setSubmitting(true); setError('');
      await login(email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally { setSubmitting(false); }
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your Kashmir Paradise Portal account">
      <Text style={styles.label}>EMAIL ADDRESS</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <Text style={styles.label}>PASSWORD</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={submit} disabled={submitting} style={styles.button}>
        <LinearGradient colors={[colors.deep, colors.teal]} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>{submitting ? 'Signing in...' : 'Sign In'}</Text><Ionicons name="arrow-forward" color={colors.white} size={18} />
        </LinearGradient>
      </Pressable>
      <Text style={styles.switchText}>New here? <Link href="/signup" style={styles.link}>Create account</Link></Text>
    </AuthShell>
  );
}
