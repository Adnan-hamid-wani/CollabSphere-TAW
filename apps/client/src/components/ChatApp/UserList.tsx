import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { User } from '../../types';

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentReceiver, setCurrentReceiver } = useChatStore();
  const currentUser = useAuthStore((s) => s.user); // 👈 Get logged-in user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await API.get('/users');
        const allUsers = response.data || [];

        // ✅ Filter out current user
        const filtered = allUsers.filter((user: User) => user.id !== currentUser?.id);
        setUsers(filtered);
      } catch (err) {
        setError('Failed to load users');
        console.error('Failed to fetch users:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500 no-dark-mode">{error}</div>;
  if (!users.length) return <div className="p-4">No users found</div>;

  return (
    <div className="p-4">
      <h2 className="font-semibold mb-4 ">Chats</h2>
      <div className=" space-y-2 overflow-y-auto pr-1">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => setCurrentReceiver(user.id)}
            className={`no-dark-mode p-3  text-pink-400 rounded-lg cursor-pointer flex items-center ${
              currentReceiver === user.id ? 'bg-blue-200' : 'hover:bg-gray-100'
            }`}
          >
            <div className="w-full text-left flex items-center gap-2 rounded-lg">
              <img
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.username}`}
                alt={user.username}
                className="w-8 h-8 rounded-full "
              />
              <div>
                <p className="no-dark-mode  font-medium ">{user?.username || 'Unknown'}</p>
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
