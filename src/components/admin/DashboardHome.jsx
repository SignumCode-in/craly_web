import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FolderTree, Tag, Workflow, FileText } from 'lucide-react';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    tools: 0,
    categories: 0,
    workflows: 0,
    posts: 0
  });
  const [loading, setLoading] = useState(true);

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
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
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

