const conversations = [
  {
    id: 1,
    name: 'TechZone BD',
    lastMessage: 'Your iPhone 15 Pro Max will be delivered tomorrow!',
    time: '10:30 AM',
    unread: true,
  },
  {
    id: 2,
    name: 'Fashion Hub',
    lastMessage: 'Thank you for your order! We are processing it now.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: 3,
    name: 'Home Essentials',
    lastMessage: 'Your return request has been approved.',
    time: '3 days ago',
    unread: false,
  },
];

export default function MessagesPage() {
  return (
    <div className="app-container py-6">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <div className="space-y-4">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`flex items-center gap-4 p-4 bg-surface rounded-lg shadow ${conv.unread ? 'border-l-4 border-primary' : ''}`}
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">store</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <h3 className={`font-semibold ${conv.unread ? 'text-on-background' : 'text-secondary'}`}>
                  {conv.name}
                </h3>
                <span className="text-xs text-secondary">{conv.time}</span>
              </div>
              <p className="text-sm text-secondary truncate">{conv.lastMessage}</p>
            </div>
            {conv.unread && (
              <div className="w-3 h-3 rounded-full bg-primary shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}