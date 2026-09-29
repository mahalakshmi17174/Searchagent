import React, { useState, useEffect, useRef } from 'react';
import SearchBox from '../components/SearchBox';
import SectionSuggestion from '../components/SectionSuggestion';
import AnimatedAssistantLogo from '../components/AnimatedAssistantLogo';
import LoadingState from '../components/LoadingState';
import { searchQueries } from '../services/searchService';
import { useAuth } from '../context/AuthContext';
import { 
  Star, MessageSquare, Copy, Upload, Pencil, ThumbsDown, RotateCw, 
  MoreHorizontal, Filter, X, Check, Volume2, Flag, CheckCircle2 
} from 'lucide-react';
import { detectSpecializedSection } from '../utils/sectionRouting';
import { detectDomain } from '../utils/domainDetection';
import robotImg from '../assets/robot.png';

export default function GeneralSearch({
  activeConversationId,
  setActiveConversationId,
  conversations,
  onSaveConversation,
  onSwitchSection,
  onSaveMessageToBookmarks,
  setIsResponding,
  domainFilter,
  onClearDomainFilter,
  onFilterDomain
}) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [dislikedIds, setDislikedIds] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [moreMenuId, setMoreMenuId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const activeChat = conversations.find(c => c.id === activeConversationId) || null;

  useEffect(() => {
    if (setIsResponding) {
      setIsResponding(loading);
    }
  }, [loading, setIsResponding]);

  // Toast message helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages, loading]);

  // Action Button Handlers
  const handleCopy = (id, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopiedId(id);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (id, text) => {
    if (navigator.share) {
      navigator.share({ title: 'Tamili Search', text }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Content copied for sharing!');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleEditUserMessage = (text) => {
    const textarea = document.querySelector('form textarea');
    if (textarea) {
      textarea.value = text;
      textarea.focus();
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
      showToast('Message loaded into search box for editing!');
    }
  };

  const handleThumbsDown = (id) => {
    setDislikedIds(prev => {
      const isDisliked = prev.includes(id);
      const next = isDisliked ? prev.filter(item => item !== id) : [...prev, id];
      showToast(isDisliked ? 'Feedback reset' : 'Feedback submitted! Thank you.');
      return next;
    });
  };

  const handleRegenerate = (aiMsgId) => {
    if (!activeChat) return;
    const msgIndex = activeChat.messages.findIndex(m => m.id === aiMsgId);
    let promptText = activeChat.title;
    if (msgIndex > 0 && activeChat.messages[msgIndex - 1].sender === 'user') {
      promptText = activeChat.messages[msgIndex - 1].text;
    }

    setLoading(true);
    showToast('Regenerating response...');

    searchQueries(promptText).then((response) => {
      const updatedMessages = activeChat.messages.map(m => {
        if (m.id === aiMsgId) {
          return {
            ...m,
            text: response.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
        }
        return m;
      });

      const updatedChat = { ...activeChat, messages: updatedMessages };
      onSaveConversation(updatedChat);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const handleReadAloud = (text) => {
    setMoreMenuId(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
      showToast('Reading alound...');
    } else {
      alert('Text-to-speech is not supported in this browser.');
    }
  };

  const handleBookmarkToggle = (msgId, text) => {
    if (!activeChat) return;
    const isBookmarked = bookmarkedIds.includes(msgId);
    if (!isBookmarked) {
      onSaveMessageToBookmarks(activeChat.title, text);
      setBookmarkedIds(prev => [...prev, msgId]);
      showToast('Response bookmarked!');
    } else {
      setBookmarkedIds(prev => prev.filter(id => id !== msgId));
      showToast('Removed from bookmarks');
    }
  };

  const handleSend = (text) => {
    if (!text || !text.trim()) return false;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLoading(true);
    setSuggestion(null);

    const initialDomain = detectDomain(text);

    let targetId = activeConversationId;
    let currentChat = activeChat;

    if (!targetId || !currentChat) {
      targetId = `chat-${Date.now()}`;
      currentChat = {
        id: targetId,
        title: text.length > 35 ? text.substring(0, 35) + '...' : text,
        domain: initialDomain || domainFilter || null,
        messages: [userMsg],
        timestamp: new Date().toLocaleString()
      };
    } else {
      currentChat = {
        ...currentChat,
        domain: currentChat.domain || initialDomain || domainFilter || null,
        messages: [...currentChat.messages, userMsg]
      };
    }

    onSaveConversation(currentChat);
    setActiveConversationId(targetId);

    // Fetch AI response
    searchQueries(text).then((response) => {
      const aiMsg = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRedirect: response.isRedirect,
        targetSection: response.targetSection
      };

      if (response.isRedirect) {
        setSuggestion(response.targetSection);
      }

      const assignedDomain = currentChat.domain || initialDomain || (response.isRedirect ? null : response.domain);

      const finalChat = {
        ...currentChat,
        domain: assignedDomain,
        messages: [...currentChat.messages, aiMsg]
      };

      onSaveConversation(finalChat);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });

    return true;
  };

  const handleTypingChange = (val) => {
    const route = detectSpecializedSection(val);
    if (route) {
      setSuggestion(route.section);
    } else {
      setSuggestion(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#fafafa] dark:bg-aurqo-darkBg text-gray-800 dark:text-gray-200 overflow-hidden relative">
      
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-gray-900/90 dark:bg-white/90 text-white dark:text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {domainFilter && (
          <div className="max-w-3xl mx-auto px-4 py-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between text-xs text-blue-800 dark:text-blue-200 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2 font-bold">
              <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Domain View: <span className="font-extrabold underline">{domainFilter}</span></span>
            </div>
            <button 
              onClick={onClearDomainFilter}
              className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-300 hover:text-blue-900 dark:hover:text-white transition"
            >
              <X className="w-3.5 h-3.5" />
              <span>Show All Conversations</span>
            </button>
          </div>
        )}

        {!activeChat ? (
          domainFilter ? (
            /* Dedicated Domain Workspace: Displays all saved chats in this domain */
            <div className="max-w-3xl mx-auto py-4 space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between p-6 bg-white dark:bg-[#131522] border border-gray-200 dark:border-aurqo-darkBorder rounded-2xl shadow-sm">
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3.5 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                      {domainFilter} Domain Workspace
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Viewing all saved conversations categorized under <span className="font-bold text-blue-600 dark:text-blue-300">{domainFilter}</span> ({conversations.filter(c => c.domain === domainFilter).length} chats)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveConversationId(null);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                >
                  + New {domainFilter} Chat
                </button>
              </div>

              {/* Grid of Saved Domain Chats */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 text-left">
                  Saved {domainFilter} Conversations
                </h4>

                {conversations.filter(c => c.domain === domainFilter).length === 0 ? (
                  <div className="p-8 text-center bg-white dark:bg-[#131522] border border-gray-200 dark:border-aurqo-darkBorder rounded-2xl">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      No saved conversations in <span className="font-bold text-blue-600">{domainFilter}</span> yet.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Type a question below to start your first {domainFilter} conversation!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conversations
                      .filter(c => c.domain === domainFilter)
                      .map((chat) => (
                        <div
                          key={chat.id}
                          onClick={() => setActiveConversationId(chat.id)}
                          className="p-4 bg-white dark:bg-[#131522] border border-gray-200 dark:border-aurqo-darkBorder rounded-2xl hover:border-blue-500/50 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between text-left group"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                                {domainFilter}
                              </span>
                              <span className="text-[10px] text-gray-400">{chat.timestamp}</span>
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                              {chat.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-2">
                              {chat.messages?.[chat.messages.length - 1]?.text || 'No messages'}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <span>Open Conversation</span>
                            <MessageSquare className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Opening Screen: Animated Robot greeting
            <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700 pb-20">
              {/* Animated Robot Scene */}
              <div className="relative mb-3 flex items-center justify-center" style={{ width: 170, height: 170 }}>

                {/* Ring 1 — large slow outer */}
                <span className="absolute w-44 h-44 rounded-full border border-blue-400/20 animate-robot-ring-1" />
                {/* Ring 2 — medium */}
                <span className="absolute w-36 h-36 rounded-full border border-purple-400/25 animate-robot-ring-2" />
                {/* Ring 3 — small fast */}
                <span className="absolute w-28 h-28 rounded-full border border-blue-300/30 animate-robot-ring-3" />

                {/* Aura glow behind robot */}
                <span className="absolute w-28 h-28 rounded-full bg-blue-400/10 blur-2xl animate-robot-aura" />

                {/* Orbiting dot 1 */}
                <span className="absolute w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(96,165,250,0.8)] animate-orbit-1" />
                {/* Orbiting dot 2 */}
                <span className="absolute w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_6px_2px_rgba(192,132,252,0.8)] animate-orbit-2" />
                {/* Orbiting dot 3 */}
                <span className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_2px_rgba(34,211,238,0.8)] animate-orbit-3" />

                {/* Ground shadow */}
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-blue-500/20 blur-lg animate-robot-shadow" />

                {/* Robot image — slightly reduced size + waving animation */}
                <img
                  src={robotImg}
                  alt="AI Assistant Robot Waving"
                  className="relative w-32 sm:w-36 select-none animate-robot-wave
                             drop-shadow-[0_4px_20px_rgba(99,102,241,0.5)]"
                  draggable={false}
                />
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-gray-700 dark:text-gray-300 leading-tight mt-2">
                How can I help you today?
              </h3>
            </div>
          )
        ) : (
          // Active Chat Log
          <div className="max-w-3xl mx-auto space-y-6 pb-24">
            {activeChat.messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col w-full ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {msg.sender === 'user' ? (
                  /* User Message Capsule & Utilities Row */
                  <div className="flex flex-col items-end max-w-[70%] mb-6">
                    <div className="bg-[#ecefff] dark:bg-zinc-800 text-gray-900 dark:text-white rounded-[24px] px-5 py-2.5 text-sm font-medium shadow-sm leading-relaxed text-left">
                      {msg.text}
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 dark:text-zinc-500 mr-3 mt-1.5">
                      {/* Copy */}
                      <button 
                        onClick={() => handleCopy(msg.id, msg.text)} 
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        title="Copy text"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Share */}
                      <button 
                        onClick={() => handleShare(msg.id, msg.text)} 
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        title="Share message"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button 
                        onClick={() => handleEditUserMessage(msg.text)} 
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        title="Edit message"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* AI Plain Text Response & Utilities Row */
                  <div className="flex flex-col items-start max-w-[70%] mb-6 text-left relative">
                    <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-medium whitespace-pre-wrap">
                      {msg.text}
                    </div>

                    {/* Target Navigation Button inside AI content area */}
                    {msg.isRedirect && msg.targetSection && (
                      <div className="pt-2.5">
                        <button
                          onClick={() => onSwitchSection(msg.targetSection)}
                          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#4f3ef5] hover:bg-[#3d2ce0] text-white text-[10px] font-extrabold rounded-xl transition-colors select-none uppercase tracking-wider shadow-sm"
                        >
                          GO TO {msg.targetSection.toUpperCase()} &rarr;
                        </button>
                      </div>
                    )}

                    {/* AI Icon Utilities directly below text */}
                    <div className="flex items-center gap-3 text-gray-400 dark:text-zinc-500 ml-0.5 mt-2 relative">
                      {/* Copy */}
                      <button 
                        onClick={() => handleCopy(msg.id, msg.text)} 
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        title="Copy response"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>

                      {/* Thumbs Down / Dislike */}
                      <button 
                        onClick={() => handleThumbsDown(msg.id)} 
                        className={`transition-colors ${
                          dislikedIds.includes(msg.id) 
                            ? 'text-red-500 fill-red-500/20' 
                            : 'hover:text-red-500 dark:hover:text-red-400'
                        }`} 
                        title="Bad response feedback"
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Share */}
                      <button 
                        onClick={() => handleShare(msg.id, msg.text)} 
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        title="Share response"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>

                      {/* Regenerate */}
                      <button 
                        onClick={() => handleRegenerate(msg.id)} 
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                        title="Regenerate response"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>

                      {/* More Options Dropdown Trigger */}
                      <div className="relative">
                        <button 
                          onClick={() => setMoreMenuId(moreMenuId === msg.id ? null : msg.id)} 
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors" 
                          title="More options"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>

                        {/* More Options Popover */}
                        {moreMenuId === msg.id && (
                          <div className="absolute left-0 bottom-full mb-2 z-50 bg-white dark:bg-[#181926] border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl p-1.5 flex flex-col gap-1 min-w-[130px] animate-in fade-in zoom-in-95">
                            <button
                              onClick={() => handleReadAloud(msg.text)}
                              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-left font-medium"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-blue-500" />
                              <span>Read Aloud</span>
                            </button>
                            <button
                              onClick={() => {
                                handleCopy(msg.id, msg.text);
                                setMoreMenuId(null);
                              }}
                              className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg text-left font-medium"
                            >
                              <Copy className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Copy Text</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Save to bookmarks */}
                      {!msg.isRedirect && (
                        <button 
                          onClick={() => handleBookmarkToggle(msg.id, msg.text)}
                          className={`transition-colors ${
                            bookmarkedIds.includes(msg.id)
                              ? 'text-amber-500 fill-amber-500'
                              : 'hover:text-amber-500'
                          }`} 
                          title="Save to bookmarks"
                        >
                          <Star className={`w-3.5 h-3.5 ${bookmarkedIds.includes(msg.id) ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Simulated typing response indicator */}
            {loading && (
              <div className="flex flex-col items-start max-w-[70%] mb-6">
                <LoadingState message="Tamili is responding..." />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating inputs section */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#fafafa] via-[#fafafa]/90 to-transparent dark:from-aurqo-darkBg dark:via-aurqo-darkBg/95 dark:to-transparent z-30 pointer-events-none">
        <div className="max-w-3xl mx-auto pointer-events-auto">
          {/* Section routing suggestion banner */}
          <SectionSuggestion 
            section={suggestion} 
            onSwitch={onSwitchSection} 
            onClose={() => setSuggestion(null)} 
          />
          <SearchBox 
            onSend={handleSend} 
            onChange={handleTypingChange} 
            onSelectDomainFilter={onFilterDomain}
            disabled={loading} 
          />
        </div>
      </div>
    </div>
  );
}
