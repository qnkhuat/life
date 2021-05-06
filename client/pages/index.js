import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useAuth } from '../lib/auth';


export default function Home() {
  const { auth, loading } = useAuth();

  const router = useRouter();
  useEffect(() => {
    if (!auth && !loading) {
      router.push('/login?next=/test');
    }
  }, [auth, loading]);

  const title = auth ? auth.name : "stranger";

  return (
    <div className="container mx-auto">
      <p>{title}</p>
    </div>
  )
}
