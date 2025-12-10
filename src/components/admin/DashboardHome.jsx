import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FolderTree, Tag, Workflow, FileText, Download, Loader } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    tools: 0,
    categories: 0,
    workflows: 0,
    posts: 0
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [toolsSnap, categoriesSnap, workflowsSnap, postsSnap] = await Promise.all([
          getDocs(collection(db, 'tools')),
          getDocs(collection(db, 'categories')),
          getDocs(collection(db, 'workflows')),
          getDocs(collection(db, 'posts'))
        ]);

        setStats({
          tools: toolsSnap.size,
          categories: categoriesSnap.size,
          workflows: workflowsSnap.size,
          posts: postsSnap.size
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const exportAllData = async () => {
    setExporting(true);
    try {
      // Fetch all collections
      const [toolsSnap, categoriesSnap, workflowsSnap, postsSnap, bannersSnap, settingsSnap] = await Promise.all([
        getDocs(collection(db, 'tools')),
        getDocs(collection(db, 'categories')),
        getDocs(collection(db, 'workflows')),
        getDocs(collection(db, 'posts')),
        getDocs(collection(db, 'banners')),
        getDocs(collection(db, 'settings'))
      ]);

      // Format data to match import structure
      const exportData = {
        categories: categoriesSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            iconName: data.iconName || '',
            toolCount: data.toolCount || 0,
            description: data.description || ''
          };
        }),
        workflows: workflowsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            iconName: data.iconName || '',
            duration: data.duration || '',
            steps: data.steps || (data.journey?.length || 0),
            journey: data.journey || []
          };
        }),
        tools: toolsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || '',
            category: data.category || '',
            shortDescription: data.shortDescription || '',
            longDescription: data.longDescription || '',
            url: data.url || '',
            logoUrl: data.logoUrl || '',
            pricing: data.pricing || 'Freemium',
            tags: data.tags || [],
            isTrending: data.isTrending || false,
            likesCount: data.likesCount || 0
          };
        }),
        posts: postsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            postId: data.postId || doc.id,
            title: data.title || '',
            body: data.body || '',
            tool: data.tool || {},
            imageUrl: data.imageUrl || '',
            tags: data.tags || [],
            likes: data.likes || 0,
            timestamp: data.timestamp || null
          };
        }),
        banners: bannersSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || '',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            link: data.link || '',
            linkText: data.linkText || '',
            position: data.position || 'top',
            order: data.order || 0,
            enabled: data.enabled !== undefined ? data.enabled : true
          };
        }),
        settings: settingsSnap.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        })
      };

      // Create JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `craly-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  const statCards = [
    { label: 'Total Tools', value: stats.tools, icon: FolderTree, color: 'primary' },
    { label: 'Total Categories', value: stats.categories, icon: Tag, color: 'accent' },
    { label: 'Total Workflows', value: stats.workflows, icon: Workflow, color: 'primary' },
    { label: 'Total Posts', value: stats.posts, icon: FileText, color: 'accent' }
  ];

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <button
          onClick={exportAllData}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              Export All Data
            </>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colorClass = stat.color === 'primary' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent';
          return (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-soft-grey">{stat.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardHome;

