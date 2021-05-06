import { useEffect } from "react";
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';

export default function Info() {
  const { auth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth && !loading) {
      router.push(`/login`);
    }
  }, [auth, loading]);
  return (
    <h3>Fill your info you bitch</h3>
  )
}
