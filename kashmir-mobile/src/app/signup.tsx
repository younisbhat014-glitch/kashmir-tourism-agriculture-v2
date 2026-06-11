import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, TextInput } from 'react-native';
import { AuthShell, authStyles as styles } from '@/components/auth-shell';
import { colors } from '@/constants/app-theme';
import { useAuth } from '@/context/auth-context';

export default function SignupScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name || !email || password.length < 6) return setError('Enter your name, email, and a 6+ character password.');
    try {
      setSubmitting(true); setError('');
      await register(name, email, password);
      router.replace('/(tabs)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally { setSubmitting(false); }
  };

  return (
    <AuthShell title="Create account" subtitle="Your Kashmir journey starts here">
      <Text style={styles.label}>FULL NAME</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Your name" style={styles.input} />
      <Text style={styles.label}>EMAIL ADDRESS</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="you@example.com" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
      <Text style={styles.label}>PASSWORD</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Minimum 6 characters" secureTextEntry style={styles.input} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable onPress={submit} disabled={submitting} style={styles.button}>
        <LinearGradient colors={[colors.deep, colors.teal]} style={styles.buttonGradient}>
          <Text style={styles.buttonText}>{submitting ? 'Creating account...' : 'Create Account'}</Text><Ionicons name="arrow-forward" color={colors.white} size={18} />
        </LinearGradient>
      </Pressable>
      <Text style={styles.switchText}>Already registered? <Link href="/login" style={styles.link}>Sign in</Link></Text>
    </AuthShell>
  );
}
