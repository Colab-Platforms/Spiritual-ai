import { useState, useEffect } from 'react';
import gsap from 'gsap';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabNavigationProps {
  tabs: Tab[];
  defaultTabId?: string;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, defaultTabId }) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTabId) {
      setActiveTabId(tabId);
    }
  };

  useEffect(() => {
    // Fade transition animation
    const contentElement = document.getElementById(`tab-content-${activeTabId}`);
    if (contentElement) {
      gsap.fromTo(
        contentElement,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.inOut' }
      );
    }
  }, [activeTabId]);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="flex gap-4 border-b border-accent-gold/20 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-3 font-inter font-semibold whitespace-nowrap transition-all duration-300 ${
              activeTabId === tab.id
                ? 'text-accent-gold border-b-2 border-accent-gold'
                : 'text-text-light/60 hover:text-text-light border-b-2 border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="relative">
        {activeTab && (
          <div
            id={`tab-content-${activeTabId}`}
            className="opacity-0"
          >
            {activeTab.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;
