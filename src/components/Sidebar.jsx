import React, { useState } from 'react';
import { 
  Plus, Home, Search, FolderClosed, Image, Video, Volume2, BookOpen, Grid, 
  History, Bookmark, Settings, X, ChevronDown, ChevronRight, Sparkles, 
  Sliders, User, LifeBuoy, LogOut, ChevronUp, MessageSquare, Compass, FolderKanban,
  Utensils, Cpu, Scissors, GraduationCap, Folder
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AuroqLogo from './AuroqLogo';

const DOMAINS_LIST = [
  { id: 'Food', name: 'Food Domain', icon: Utensils, color: 'text-amber-500 bg-amber-500/10' },
  { id: 'Technology', name: 'Technology Domain', icon: Cpu, color: 'text-blue-500 bg-blue-500/10' },
  { id: 'Textiles', name: 'Textiles Domain', icon: Scissors, color: 'text-purple-500 bg-purple-500/10' },
  { id: 'Education', name: 'Education Domain', icon: GraduationCap, color: 'text-emerald-500 bg-emerald-500/10' }
];

export default function Sidebar({
  currentView,
  setCurrentView,
  mobileOpen,
  setMobileOpen,
  conversations,
  activeConversationId,
  setActiveConversationId,
  onOpenProfileModal,
  onFilterDomain,
  domainFilter,
  isResponding
}) {
  const { currentUser, logout } = useAuth();
  const [isDomainsSectionOpen, setIsDomainsSectionOpen] = useState(true);
  const [expandedDomains, setExpandedDomains] = useState({});
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleDomainExpand = (domainId) => {
    setExpandedDomains(prev => ({
      ...prev,
      [domainId]: !prev[domainId]
    }));
  };

  const getInitials = (name) => {
    if (!name) return 'ML';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileOpen(false);
    onFilterDomain(null);
  };

  const handleConversationClick = (chatId) => {
    setActiveConversationId(chatId);
    setCurrentView('general');
    setMobileOpen(false);
  };

  const handleDomainClick = (domainId) => {
    toggleDomainExpand(domainId);
    if (domainFilter === domainId) {
      onFilterDomain(null);
    } else {
      onFilterDomain(domainId);
      setCurrentView('general');
    }
  };

  const handleProfileOptionClick = (action, view) => {
    setIsProfileOpen(false);
    if (view) {
      setCurrentView(view);
      setMobileOpen(false);
    } else if (action === 'logout') {
      logout();
    } else if (action === 'profile') {
      onOpenProfileModal();
    } else {
      alert(action);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 animate-in fade-in"
        />
      )}

      {/* Left Sidebar Panel */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-aurqo-darkSidebar border-r border-gray-200 dark:border-aurqo-darkBorder/40 flex flex-col h-full flex-shrink-0 select-none transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Brand Logo [A Symbol] AURQO & Close button */}
        <div className="p-5 pb-4 flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => handleNavClick('general')}>
            <AuroqLogo isResponding={isResponding} />
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
          {/* New Chat Button */}
          <button
            onClick={() => {
              setActiveConversationId(null);
              setCurrentView('general');
              setMobileOpen(false);
              onFilterDomain(null);
            }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm mb-2"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>New Chat</span>
          </button>

          {/* General Search */}
          <button
            onClick={() => handleNavClick('general')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold ${
              currentView === 'general' && !domainFilter
                ? 'bg-blue-100/70 dark:bg-blue-950/40 text-blue-700 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/20'
            }`}
          >
            <Search className="w-4.5 h-4.5" />
            <span>General Search</span>
          </button>

          {/* Recent Conversations Section */}
          <div className="pt-4 mt-3 border-t border-gray-200/60 dark:border-aurqo-darkBorder/40">
            <h4 className="px-3.5 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 text-left">
              Recent Conversations
            </h4>
            
            <div className="space-y-0.5">
              {conversations.length === 0 ? (
                <p className="px-3.5 py-2 text-[11px] text-gray-400 dark:text-gray-500 italic text-left">
                  No conversations yet
                </p>
              ) : (
                conversations.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => handleConversationClick(chat.id)}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-150 text-xs text-left font-medium ${
                      activeConversationId === chat.id && currentView === 'general'
                        ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 font-semibold'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/20'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 text-gray-400" />
                    <span className="truncate flex-1">{chat.title}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </nav>

        {/* User profile dropdown container */}
        <div className="p-4 border-t border-gray-200 dark:border-aurqo-darkBorder/40 flex flex-col gap-4 relative">
          
          {/* Click outside to close */}
          {isProfileOpen && (
            <div className="fixed inset-0 z-40 cursor-default" onClick={() => setIsProfileOpen(false)} />
          )}

          {/* Popover overlay menu */}
          {isProfileOpen && (
            <div className="absolute bottom-full left-4 right-4 z-50 mb-2 bg-white dark:bg-[#0c0d12] border border-gray-200 dark:border-aurqo-darkBorder/40 rounded-[20px] p-2 shadow-[0_10px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-200 animate-in fade-in slide-in-from-bottom-2">
              {/* Header card inside popover */}
              <div 
                onClick={() => handleProfileOptionClick('profile')}
                className="flex items-center justify-between p-2.5 rounded-[14px] bg-gray-50/80 dark:bg-aurqo-darkCard/70 border border-gray-100 dark:border-aurqo-darkBorder/20 hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/30 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs select-none shadow-sm">
                    {getInitials(currentUser?.name)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-200">{currentUser?.name || 'User'}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{currentUser?.plan || 'Free'}</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              </div>

              <div className="my-2 border-t border-gray-200 dark:border-aurqo-darkBorder/30" />

              <div className="space-y-0.5">
                <button 
                  onClick={() => handleProfileOptionClick("Upgrade plan: You are already subscribed to the Plus plan!")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/30 transition-colors text-left"
                >
                  <Sparkles className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Upgrade plan</span>
                </button>

                <button 
                  onClick={() => handleProfileOptionClick("Personalization: Personalization options are coming soon!")}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/30 transition-colors text-left"
                >
                  <Sliders className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Personalization</span>
                </button>

                <button 
                  onClick={() => handleProfileOptionClick('profile')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/30 transition-colors text-left"
                >
                  <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Profile</span>
                </button>

                <button 
                  onClick={() => handleProfileOptionClick(null, 'settings')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/30 transition-colors text-left"
                >
                  <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span>Settings</span>
                </button>
              </div>

              <div className="my-2 border-t border-gray-200 dark:border-aurqo-darkBorder/30" />

              <div className="space-y-0.5">
                <button 
                  onClick={() => handleProfileOptionClick("Help: Opening Help Center & Support docs...")}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <LifeBuoy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span>Help</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                </button>

                <button 
                  onClick={() => handleProfileOptionClick('logout')}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-[10px] text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          )}

          {/* Sidebar Bottom Profile Card */}
          <div
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center justify-between p-2 rounded-[14px] bg-gray-50 dark:bg-aurqo-darkCard/50 border border-gray-200/50 dark:border-aurqo-darkBorder/30 cursor-pointer hover:bg-gray-100 dark:hover:bg-aurqo-darkHover/30 transition-colors z-50 relative"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm select-none shadow-sm">
                {getInitials(currentUser?.name)}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-200">{currentUser?.name || 'User'}</span>
                <span className="text-[10px] text-gray-400 font-medium">{currentUser?.plan || 'Free'}</span>
              </div>
            </div>
            {isProfileOpen ? (
              <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
