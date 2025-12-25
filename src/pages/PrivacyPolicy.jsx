import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const PrivacyPolicy = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const docRef = doc(db, 'settings', 'privacyPolicy');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().content || '');
      } else {
        setContent('<p>Privacy policy content will be available soon.</p>');
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
      setContent('<p>Error loading privacy policy. Please try again later.</p>');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-white/10 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-bold">Craly</span>
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-soft-grey hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>
        <div
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
          style={{
            color: '#FFFFFF'
          }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-soft-grey">
              © 2025 Craly Technologies. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link to="/" className="text-soft-grey hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/privacy" className="text-soft-grey hover:text-white transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-soft-grey hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
          color: #FFFFFF;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        .prose h1 { font-size: 2em; font-weight: bold; }
        .prose h2 { font-size: 1.5em; font-weight: bold; }
        .prose h3 { font-size: 1.25em; font-weight: bold; }
        .prose p {
          color: #B8B8B8;
          margin: 1em 0;
          line-height: 1.6;
        }
        .prose ul, .prose ol {
          color: #B8B8B8;
          margin: 1em 0;
          padding-left: 2em;
        }
        .prose li {
          margin: 0.5em 0;
        }
        .prose a {
          color: #4A90E2;
          text-decoration: underline;
        }
        .prose a:hover {
          color: #6BA3E8;
        }
        .prose pre {
          background: rgba(255, 255, 255, 0.1);
          padding: 16px;
          border-radius: 8px;
          margin: 16px 0;
          overflow-x: auto;
        }
        .prose pre code {
          color: #4A90E2;
          font-family: 'Courier New', monospace;
          font-size: 14px;
        }
        .prose code {
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 6px;
          border-radius: 4px;
          color: #4A90E2;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }
        .prose table {
          border-collapse: collapse;
          width: 100%;
          margin: 16px 0;
        }
        .prose table td,
        .prose table th {
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 12px;
          text-align: left;
        }
        .prose table th {
          background: rgba(255, 255, 255, 0.1);
          font-weight: 600;
          color: #FFFFFF;
        }
        .prose table td {
          color: #B8B8B8;
        }
        .prose blockquote {
          border-left: 4px solid #4A90E2;
          padding-left: 20px;
          margin: 16px 0;
          color: #B8B8B8;
          font-style: italic;
        }
        .prose hr {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          margin: 24px 0;
        }
        .prose strong {
          color: #FFFFFF;
          font-weight: 600;
        }
        .prose em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default PrivacyPolicy;




