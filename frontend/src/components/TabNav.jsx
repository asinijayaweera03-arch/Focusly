export default function TabNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'todo',     label: 'To-Do',       icon: '✅' },
    { id: 'study',    label: 'Study',        icon: '📚' },
    { id: 'weekly',   label: 'Weekly Log',   icon: '📆' },
    { id: 'tomorrow', label: "Tomorrow",     icon: '🌅' },
    { id: 'analytics', label: 'Analytics',  icon: '📊' },
  ];

  return (
    <div className="tab-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </div>
  );
}