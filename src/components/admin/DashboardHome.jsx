import { useState, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { toolService } from '../../api/toolService';
import { categoryService } from '../../api/categoryService';
import { workflowService } from '../../api/workflowService';
import { postService } from '../../api/postService';
import { bannerService } from '../../api/bannerService';
import { settingsService } from '../../api/settingsService';
import { userService } from '../../api/userService';
import { FolderTree, Tag, Workflow, FileText, Download, Loader, Users, PieChart, BarChart as BarChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    tools: 0,
    categories: 0,
    workflows: 0,
    posts: 0,
    users: 0
  });
  const [analytics, setAnalytics] = useState({
    heardFrom: {},
    interests: {},
    dailyRegistrations: []
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await adminService.getStats();
        setStats(result.stats);
        setAnalytics(result.analytics);
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
      // Fetch all data from services
      const [tools, categories, workflows, posts, banners, users] = await Promise.all([
        toolService.getAll(),
        categoryService.getAll(),
        workflowService.getAll(),
        postService.getAll(),
        bannerService.getAll(),
        userService.getAll()
      ]);

      // Format data to match import structure
      const exportData = {
        categories,
        workflows,
        tools,
        posts,
        banners,
        users
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
    { label: 'Total Users', value: stats.users, icon: Users, color: 'primary' },
    { label: 'Total Tools', value: stats.tools, icon: FolderTree, color: 'accent' },
    { label: 'Total Workflows', value: stats.workflows, icon: Workflow, color: 'primary' },
    { label: 'Total Posts', value: stats.posts, icon: FileText, color: 'accent' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
          <p className="text-soft-grey">Platform performance and user insights</p>
        </div>
        <button
          onClick={exportAllData}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
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
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10 group"
            >
              <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-soft-grey font-medium uppercase text-xs tracking-wider">{stat.label}</div>
            </div>
          );
        })}
      </div>

      {/* Daily Registrations Chart */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-primary/20 rounded-lg">
            <BarChartIcon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-white">Daily New Users (Last 7 Days)</h3>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.dailyRegistrations} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#B8B8B8', fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#B8B8B8', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#4A90E2' }}
              />
              <Bar
                dataKey="count"
                radius={[6, 6, 0, 0]}
                barSize={40}
              >
                {analytics.dailyRegistrations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#4A90E2' : 'rgba(74, 144, 226, 0.2)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Heard From Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <PieChart className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-white">Where Users Found Us</h3>
          </div>
          <div className="space-y-4">
            {Object.entries(analytics.heardFrom)
              .sort(([, a], [, b]) => b - a)
              .map(([source, count], index) => {
                const percentage = Math.round((count / stats.users) * 100);
                return (
                  <div key={source} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white font-medium">{source}</span>
                      <span className="text-soft-grey">{count} users ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Interests Chart */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-accent/20 rounded-lg">
              <BarChart className="w-5 h-5 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white">User Interests</h3>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(analytics.interests)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([interest, count]) => {
                const percentage = Math.round((count / stats.users) * 100);
                return (
                  <div key={interest} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white font-medium">{interest}</span>
                      <span className="text-soft-grey">{count} selections</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

