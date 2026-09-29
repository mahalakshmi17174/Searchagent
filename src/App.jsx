import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { loadUserData, saveUserData } from './utils/storage';
import { initialUserData } from './data/mockData';

// Pages
import Home from './pages/Home';
import GeneralSearch from './pages/GeneralSearch';
import ImagePage from './pages/Image';
import VideoPage from './pages/Video';
import AudioPage from './pages/Audio';
import ResearchPage from './pages/Research';
import MoreTools from './pages/MoreTools';
import HistoryPage from './pages/History';
import SavedPage from './pages/Saved';
import SettingsPage from './pages/Settings';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#fafafa] dark:bg-aurqo-darkBg text-gray-800 dark:text-gray-200">
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 max-w-md">
            <h2 className="text-lg font-bold text-red-500 mb-1">Rendering Error</h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-4 break-words">
              {this.state.error?.message || 'Something went wrong rendering this section.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const { currentUser, updateProfile, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('general');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    setIsResponding(false);
  }, [currentView]);

  // User-specific states
  const [conversations, setConversations] = useState([]);
  const [history, setHistory] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [domainFilter, setDomainFilter] = useState(null);

  // Load user data upon authentication
  useEffect(() => {
    if (isAuthenticated && currentUser?.userId) {
      const uid = currentUser.userId;
      
      // Load or initialize with default demo history/saved if first run for demo users
      const initialUser = initialUserData[uid] || { history: [], saved: [] };
      
      const loadedConvs = loadUserData(uid, 'conversations', []);
      const loadedHistory = loadUserData(uid, 'history', initialUser.history);
      const loadedSaved = loadUserData(uid, 'saved', initialUser.saved);

      setConversations(loadedConvs);
      setHistory(loadedHistory);
      setSavedItems(loadedSaved);
      setActiveConversationId(null);
      setDomainFilter(null);
    }
  }, [isAuthenticated, currentUser?.userId]);

  if (!isAuthenticated) {
    return <ProtectedRoute />;
  }

  // State setters that also save to namespaced localStorage
  const handleSaveConversation = (updatedChat) => {
    const uid = currentUser.userId;

    setConversations((prev) => {
      const index = prev.findIndex((c) => c.id === updatedChat.id);
      const newConvs = index !== -1
        ? prev.map((c) => (c.id === updatedChat.id ? updatedChat : c))
        : [updatedChat, ...prev];
      saveUserData(uid, 'conversations', newConvs);
      return newConvs;
    });

    setHistory((prev) => {
      const historyItem = {
        id: `hist-${Date.now()}`,
        title: updatedChat.title,
        type: 'search',
        domain: updatedChat.domain,
        timestamp: new Date().toLocaleString()
      };
      const newHistory = [historyItem, ...prev];
      saveUserData(uid, 'history', newHistory);
      return newHistory;
    });
  };

  const handleBookmarkMessage = (chatTitle, answerText) => {
    const uid = currentUser.userId;
    const bookmarkItem = {
      id: `saved-${Date.now()}`,
      title: chatTitle,
      content: answerText,
      timestamp: new Date().toLocaleString()
    };

    const newSaved = [bookmarkItem, ...savedItems];
    setSavedItems(newSaved);
    saveUserData(uid, 'saved', newSaved);
    alert('Response bookmarked successfully!');
  };

  const handleDeleteSavedItem = (itemId) => {
    const uid = currentUser.userId;
    const newSaved = savedItems.filter(item => item.id !== itemId);
    setSavedItems(newSaved);
    saveUserData(uid, 'saved', newSaved);
  };

  const handleSelectHistoryItem = (item) => {
    if (item.type === 'search') {
      const match = conversations.find(c => c.title === item.title);
      if (match) {
        setActiveConversationId(match.id);
      } else {
        // Fallback or dynamic reconstruction if chat missing
        setActiveConversationId(null);
      }
      setCurrentView('general');
    } else {
      setCurrentView(item.type);
    }
  };

  const handleSwitchSection = (section) => {
    setCurrentView(section);
  };

  const handleFilterDomain = (domain) => {
    setDomainFilter(domain);
    setActiveConversationId(null);
  };

  // Get active conversations list filtered by domain if selected
  const displayConversations = domainFilter 
    ? conversations.filter(c => c.domain === domainFilter)
    : conversations;

  return (
    <div className="flex h-screen w-screen bg-[#fafafa] dark:bg-aurqo-darkBg text-gray-800 dark:text-gray-100 font-sans transition-colors duration-200 overflow-hidden relative">
      
      {/* Permanent Left Sidebar on Desktop, Slide-in on Mobile */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        conversations={conversations}
        activeConversationId={activeConversationId}
        setActiveConversationId={setActiveConversationId}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onFilterDomain={handleFilterDomain}
        domainFilter={domainFilter}
        isResponding={isResponding}
      />

      {/* Main Workspace content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header */}
        <Header onOpenSidebar={() => setMobileSidebarOpen(true)} isResponding={isResponding} />

        {/* Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
          <ErrorBoundary>
            {(() => {
              switch (currentView) {
                case 'home':
                  return <Home setCurrentView={setCurrentView} />;
                case 'general':
                  return (
                    <GeneralSearch
                      activeConversationId={activeConversationId}
                      setActiveConversationId={setActiveConversationId}
                      conversations={conversations}
                      onSaveConversation={handleSaveConversation}
                      onSwitchSection={handleSwitchSection}
                      onSaveMessageToBookmarks={handleBookmarkMessage}
                      setIsResponding={setIsResponding}
                      domainFilter={domainFilter}
                      onClearDomainFilter={() => setDomainFilter(null)}
                      onFilterDomain={handleFilterDomain}
                    />
                  );
                case 'image':
                  return <ImagePage setIsResponding={setIsResponding} />;
                case 'video':
                  return <VideoPage setIsResponding={setIsResponding} />;
                case 'audio':
                  return <AudioPage setIsResponding={setIsResponding} />;
                case 'research':
                  return <ResearchPage setIsResponding={setIsResponding} />;
                case 'tools':
                  return <MoreTools />;
                case 'history':
                  return <HistoryPage history={history} onSelectHistoryItem={handleSelectHistoryItem} />;
                case 'saved':
                  return <SavedPage savedItems={savedItems} onDeleteSavedItem={handleDeleteSavedItem} />;
                case 'settings':
                  return <SettingsPage />;
                default:
                  return <Home setCurrentView={setCurrentView} />;
              }
            })()}
          </ErrorBoundary>
        </div>
      </div>

      {/* Dynamic Edit Profile Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSave={(newName) => {
          updateProfile(newName);
          setIsProfileModalOpen(false);
        }}
      />
    </div>
  );
}

// Edit Profile Modal Component
function EditProfileModal({ isOpen, onClose, currentUser, onSave }) {
  const [displayName, setDisplayName] = useState(currentUser?.name || '');
  const [username, setUsername] = useState(currentUser?.email ? currentUser.email.split('@')[0] : '');

  useEffect(() => {
    if (isOpen && currentUser) {
      setDisplayName(currentUser.name);
      setUsername(currentUser.email.split('@')[0]);
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const getInitials = (name) => {
    if (!name) return 'ML';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(displayName);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="bg-white dark:bg-[#18191f] w-full max-w-[440px] rounded-[24px] overflow-hidden shadow-2xl z-[110] border border-gray-250 dark:border-zinc-800 transition-all duration-300 transform scale-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-left">Edit profile</h2>

          <div className="flex flex-col items-center mb-6 relative">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-2xl select-none shadow-md">
                {getInitials(displayName)}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white dark:bg-[#2c2d35] border border-gray-200 dark:border-zinc-700 flex items-center justify-center shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 dark:text-gray-300">
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                  <circle cx="12" cy="13" r="3"/>
                </svg>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col text-left">
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-0.5">Display name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-[#f4f4f4] dark:bg-[#202127] border-0 outline-none rounded-xl px-3.5 py-3 text-sm text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-purple-500/20 placeholder-gray-400"
                required
              />
            </div>

            <div className="flex flex-col text-left">
              <label className="text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 px-0.5">Username</label>
              <input
                type="text"
                value={username}
                disabled
                className="w-full bg-[#f4f4f4]/60 dark:bg-[#202127]/60 border-0 outline-none rounded-xl px-3.5 py-3 text-sm text-gray-400 dark:text-zinc-500 font-medium cursor-not-allowed"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-6 mt-6 border-t border-gray-100 dark:border-zinc-800/60">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-semibold rounded-full border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-sm font-semibold rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-colors shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
