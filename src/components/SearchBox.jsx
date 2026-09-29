import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, MicOff, Send, X, FileText } from 'lucide-react';
import SlashCommandMenu, { DOMAIN_OPTIONS } from './SlashCommandMenu';
import { detectDomain } from '../utils/domainDetection';

// Helper to transliterate any Tamil script to Tanglish (English/Roman characters)
function convertToTanglish(text) {
  if (!text) return '';
  const wordMap = {
    'வணக்கம்': 'vanakkam',
    'எப்படி': 'epdi',
    'இருக்கீங்க': 'irukinga',
    'இருக்கீகள்': 'irukingal',
    'என்ன': 'enna',
    'பண்றீங்க': 'panringa',
    'நல்லா': 'nalla',
    'இருக்கேன்': 'iruken',
    'நன்றி': 'nandri',
    'சரி': 'sari',
    'ஆமாம்': 'aamaa',
    'இல்லை': 'illai',
    'வாருங்கள்': 'vaarungal',
    'போயிட்டு': 'poittu',
    'வாங்க': 'vaanga',
    'போங்க': 'poanga',
    'நண்பா': 'nanba',
    'நண்பன்': 'nanban',
    'தம்பி': 'thambi',
    'அக்கா': 'akka',
    'அண்ணா': 'annachi'
  };

  let result = text;
  Object.keys(wordMap).forEach(tamilWord => {
    result = result.replace(new RegExp(tamilWord, 'g'), wordMap[tamilWord]);
  });

  // Map remaining Tamil Unicode characters to Roman letters
  const charMap = {
    'அ': 'a', 'ஆ': 'aa', 'இ': 'i', 'ஈ': 'ee', 'உ': 'u', 'ஊ': 'oo',
    'எ': 'e', 'ஏ': 'ae', 'ஐ': 'ai', 'ஒ': 'o', 'ஓ': 'oa', 'ஔ': 'au',
    'ஃ': 'ak',
    'க': 'ka', 'ங': 'nga', 'ச': 'cha', 'ஞ': 'nya', 'ட': 'ta', 'ண': 'na',
    'த': 'tha', 'ந': 'na', 'ப': 'pa', 'ம': 'ma', 'ய': 'ya', 'ர': 'ra',
    'ல': 'la', 'வ': 'va', 'ழ': 'zha', 'ள': 'la', 'ற': 'ra', 'ன': 'na',
    'ஜ': 'ja', 'ஷ': 'sha', 'ஸ': 'sa', 'ஹ': 'ha', 'க்ஷ': 'ksha',
    'ா': 'aa', 'ி': 'i', 'ீ': 'ee', 'ு': 'u', 'ூ': 'oo',
    'ெ': 'e', 'ே': 'ae', 'ை': 'ai', 'ொ': 'o', 'ோ': 'oa', 'ௌ': 'au',
    '்': ''
  };

  let converted = '';
  for (let i = 0; i < result.length; i++) {
    const char = result[i];
    converted += charMap[char] !== undefined ? charMap[char] : char;
  }
  return converted;
}

export default function SearchBox({ onSend, onChange, onSelectDomainFilter, placeholder = "Message Tamili...", disabled = false }) {
  const [query, setQuery] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  // Slash menu state
  const [isSlashOpen, setIsSlashOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const formRef = useRef(null);

  // Auto-resize input height based on text lines
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [query]);

  // Compute text typed after slash
  const isSlashActive = query.startsWith('/');
  const userQueryAfterSlash = isSlashActive ? query.slice(1).trim() : '';
  const detectedDomain = isSlashActive && userQueryAfterSlash ? detectDomain(userQueryAfterSlash) : null;

  // Filter & prioritize slash options
  const getFilteredItems = () => {
    if (!isSlashActive) return [];

    let items = [...DOMAIN_OPTIONS];

    // If auto-detected domain exists (e.g. "Food" for "dosa"), prioritize matched item at the top
    if (detectedDomain) {
      const matchIdx = items.findIndex(item => item.category === detectedDomain || item.id === detectedDomain);
      if (matchIdx !== -1) {
        const matchedItem = items[matchIdx];
        items.splice(matchIdx, 1);
        items.unshift(matchedItem);
      }
    } else if (userQueryAfterSlash) {
      const q = userQueryAfterSlash.toLowerCase();
      const filtered = items.filter(item => 
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
      );
      if (filtered.length > 0) {
        items = filtered;
      }
    }

    return items;
  };

  const filteredItems = getFilteredItems();

  useEffect(() => {
    if (isSlashActive && filteredItems.length > 0) {
      setIsSlashOpen(true);
      setSelectedIndex(0);
    } else {
      setIsSlashOpen(false);
    }
  }, [query, isSlashActive]);

  // Close slash menu on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (formRef.current && !formRef.current.contains(e.target)) {
        setIsSlashOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSlashItem = (item) => {
    if (onSelectDomainFilter && (item.type === 'domain' || item.category)) {
      onSelectDomainFilter(item.category || item.id);
    }
    const newText = userQueryAfterSlash ? userQueryAfterSlash : '';
    setQuery(newText);
    setIsSlashOpen(false);
    if (onChange) onChange(newText);
    if (textareaRef.current) textareaRef.current.focus();
  };

  // Speech-to-Text Recognition Handler for Tanglish
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const spokenText = prompt("Voice Input: Speak or type your Tanglish message below:");
      if (spokenText && spokenText.trim()) {
        const updated = query ? `${query} ${spokenText.trim()}` : spokenText.trim();
        setQuery(updated);
        if (onChange) onChange(updated);
      }
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English / Tanglish Roman script recognition

      const initialText = query;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const rawSpeech = (finalTranscript + interimTranscript).trim();
        const tanglishText = convertToTanglish(rawSpeech);
        const fullText = initialText ? `${initialText} ${tanglishText}`.trim() : tanglishText;

        setQuery(fullText);
        if (onChange) onChange(fullText);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (disabled) return;
    const text = query.trim();
    if (!text && !attachedFile) return;

    let fullMessage = text;
    if (attachedFile) {
      fullMessage = text 
        ? `${text}\n\n📎 Attached file: ${attachedFile.name}`
        : `📎 Attached file: ${attachedFile.name}`;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSlashOpen(false);
    onSend(fullMessage);
    setQuery('');
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onChange) onChange('');
  };

  const handleKeyDown = (e) => {
    if (isSlashOpen && filteredItems.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSelectSlashItem(filteredItems[selectedIndex]);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsSlashOpen(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit}
      className="max-w-3xl w-full mx-auto relative z-30 pointer-events-auto flex flex-col bg-white dark:bg-[#121420] border border-gray-200 dark:border-aurqo-darkBorder rounded-[26px] p-2 pr-3 shadow-lg focus-within:border-blue-500/50 dark:focus-within:border-blue-500/40 transition-all"
    >
      {/* Floating Slash Menu */}
      {isSlashOpen && (
        <SlashCommandMenu 
          items={filteredItems}
          selectedIndex={selectedIndex}
          onSelect={handleSelectSlashItem}
          detectedDomain={detectedDomain}
          userQuery={userQueryAfterSlash}
        />
      )}

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />

      {/* File Attachment Chip */}
      {attachedFile && (
        <div className="flex items-center gap-2 px-3 py-1.5 mb-2 ml-2 mt-1 w-max rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">
          <FileText className="w-3.5 h-3.5" />
          <span className="font-semibold truncate max-w-[200px]">{attachedFile.name}</span>
          <button 
            type="button" 
            onClick={removeAttachedFile}
            className="hover:text-red-500 transition-colors ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-end gap-2 w-full">
        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-full text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/30 transition-colors"
          title="Attach file"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Message Textarea */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            if (onChange) onChange(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening... Speak now!" : placeholder}
          className="flex-1 bg-transparent border-0 outline-none resize-none py-2 px-1 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-0 max-h-[180px] min-h-[36px] disabled:opacity-50"
        />

        {/* Voice Mic Button */}
        <button
          type="button"
          onClick={startListening}
          disabled={disabled}
          className={`p-2 rounded-full transition-all ${
            isListening
              ? 'bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 animate-pulse shadow-sm'
              : 'text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-aurqo-darkHover/30'
          }`}
          title={isListening ? "Listening... Click to stop" : "Voice input (Speak to type)"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || (!query.trim() && !attachedFile)}
          className={`p-2 rounded-full transition-colors ${
            !disabled && (query.trim() || attachedFile)
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm cursor-pointer'
              : 'bg-gray-100 dark:bg-aurqo-darkBorder/40 text-gray-300 dark:text-gray-600 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>
    </form>
  );
}

