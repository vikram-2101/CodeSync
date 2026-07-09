import { useAwareness } from "../hooks/useAwareness";

export function PresenceList({ awareness }) {
  const users = useAwareness(awareness);

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>🟢 {user.name}</div>
      ))}
    </div>
  );
}
