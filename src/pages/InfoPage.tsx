import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { supabase } from '../supabaseClient';

interface PageContent {
  title: string;
  content: string;
  last_updated: string;
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '2rem',
    textAlign: 'center' as const,
  },
  text: {
    fontSize: '1.125rem',
    lineHeight: '1.75',
    color: '#374151',
    whiteSpace: 'pre-wrap',
  },
  lastUpdated: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginTop: '2rem',
    textAlign: 'right' as const,
  },
  loading: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#6b7280',
  },
  error: {
    textAlign: 'center' as const,
    padding: '2rem',
    color: '#dc2626',
  },
};

export function InfoPage() {
  const [pageContent, setPageContent] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('PageContent')
          .select('title, content, last_updated')
          .eq('page_name', 'info')
          .single();

        if (error) throw error;
        setPageContent(data);
      } catch (err) {
        console.error('Error fetching page content:', err);
        setError('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (error || !pageContent) {
    return (
      <div style={styles.container}>
        <Header />
        <div style={styles.error}>{error || 'Content not found'}</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.content}>
        <h1 style={styles.title}>{pageContent.title}</h1>
        <div style={styles.text}>{pageContent.content}</div>
        <div style={styles.lastUpdated}>
          Last updated: {new Date(pageContent.last_updated).toLocaleDateString()}
        </div>
      </main>
    </div>
  );
}
