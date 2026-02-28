import { useState, useEffect, useRef } from 'react';
import { Search, Loader, X, FolderTree, Tag, FileText, Workflow } from 'lucide-react';
import { searchService } from '../../api/searchService';

const GlobalSearch = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        setIsOpen(true);
        try {
          const data = await searchService.searchAll(query);
          setResults(data); // .data object with tools, categories, posts, workflows
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults(null);
        setIsOpen(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleResultClick = (type) => {
    setIsOpen(false);
    setQuery('');
    // Optionally trigger a navigate to the respective editor or tab.
    // Assuming onNavigate can be a callback to set the active tab.
    if (onNavigate) {
      if (type === 'tool') onNavigate('tools');
      else if (type === 'category') onNavigate('categories');
      else if (type === 'post') onNavigate('posts');
      else if (type === 'workflow') onNavigate('workflows');
    }
  };

  return (
    <div className="relative w-full max-w-lg mb-6" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Global Search (Tools, Categories, Posts, Workflows)..."
          className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary text-white placeholder-soft-grey transition-all"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-soft-grey hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (query.trim() !== '') && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : results ? (
            <div className="p-2 space-y-4">
              {Object.keys(results).every(k => results[k].length === 0) && (
                <div className="p-4 text-center text-soft-grey">No results found for "{query}"</div>
              )}

              {/* Tools */}
              {results.tools?.length > 0 && (
                <div>
                  <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold text-soft-grey uppercase tracking-wider">
                    <FolderTree className="w-3 h-3" /> Tools
                  </div>
                  {results.tools.map(tool => (
                    <button
                      key={tool._id}
                      onClick={() => handleResultClick('tool')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                    >
                      {tool.logoUrl ? (
                        <img src={tool.logoUrl} className="w-8 h-8 rounded-lg object-contain bg-white/5" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex flex-shrink-0 items-center justify-center text-primary font-bold">{tool.name[0]}</div>
                      )}
                      <div>
                        <div className="text-white font-medium text-sm">{tool.name}</div>
                        <div className="text-soft-grey text-xs truncate max-w-[300px]">{tool.shortDescription}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Categories */}
              {results.categories?.length > 0 && (
                <div>
                  <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold text-soft-grey uppercase tracking-wider">
                    <Tag className="w-3 h-3" /> Categories
                  </div>
                  {results.categories.map(cat => (
                    <button
                      key={cat._id}
                      onClick={() => handleResultClick('category')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex flex-shrink-0 items-center justify-center text-accent">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{cat.name}</div>
                        <div className="text-soft-grey text-xs truncate max-w-[300px]">{cat.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Workflows */}
              {results.workflows?.length > 0 && (
                <div>
                  <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold text-soft-grey uppercase tracking-wider">
                    <Workflow className="w-3 h-3" /> Workflows
                  </div>
                  {results.workflows.map(wf => (
                    <button
                      key={wf._id}
                      onClick={() => handleResultClick('workflow')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                        <Workflow className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{wf.name}</div>
                        <div className="text-soft-grey text-xs truncate max-w-[300px]">{wf.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Posts */}
              {results.posts?.length > 0 && (
                <div>
                  <div className="px-3 py-1 flex items-center gap-2 text-xs font-semibold text-soft-grey uppercase tracking-wider">
                    <FileText className="w-3 h-3" /> Posts
                  </div>
                  {results.posts.map(post => (
                    <button
                      key={post._id}
                      onClick={() => handleResultClick('post')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3"
                    >
                      {post.imageUrl ? (
                        <img src={post.imageUrl} className="w-8 h-8 rounded-lg shrink-0 object-cover bg-white/5" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg flex-shrink-0 bg-purple-500/20 flex items-center justify-center text-purple-400">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="text-white font-medium text-sm truncate max-w-[300px]">{post.title}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
