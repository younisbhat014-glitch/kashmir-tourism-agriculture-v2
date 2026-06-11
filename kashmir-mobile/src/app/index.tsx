import { Redirect } from 'expo-router';
import { LoadingScreen } from '@/components/loading-screen';
import { useAuth } from '@/context/auth-context';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen label="Opening Kashmir Portal..." />;
  return <Redirect href={user ? '/(tabs)' : '/login'} />;
}
