import { useEffect } from 'react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types';
import { useUserListStore } from '../../store/useUserListStore';

export default function UserList() {
  const { currentReceiver, setCurrentReceiver } = useChatStore();
  const currentUser = useAuthStore((s) => s.user);
  const { users, fetchUsers } = useUserListStore();

  useEffect(() => {
    if (!users.length) fetchUsers();
  }, [fetchUsers, users.length]);

  const filteredUsers = users.filter((user: User) => user.id !== currentUser?.id);

  if (!users.length) return <div className="p-4">Loading users...</div>;
  if (!filteredUsers.length) return <div className="p-4">No users found</div>;

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4">Chats</h2>
      <div className="space-y-2 overflow-y-auto pr-1">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => setCurrentReceiver(user.id)}
            className={`no-dark-mode p-3 text-pink-400 rounded-lg cursor-pointer flex items-center ${
              currentReceiver === user.id ? 'bg-blue-200' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-full text-left flex items-center gap-2 rounded-lg">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="no-dark-mode font-medium">{user?.username || 'Unknown'}</p>
                {user.email && (
                  <p className="no-dark-mode text-xs text-gray-500">{user.email}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
