import { useEffect, useState } from "react";

import type { Awareness } from "y-protocols/awareness";

export interface PresenceUser {
  id: number;
  name: string;
}

export function useAwareness(awareness: Awareness) {
  const [users, setUsers] = useState<PresenceUser[]>([]);

  useEffect(() => {
    function updateUsers() {
      const states = awareness.getStates();

      const users = Array.from(states.entries()).map(([id, state]) => {
        return {
          id,
          name: state.user?.name ?? "Anonymous",
        };
      });

      setUsers(users);
    }

    // Initial load
    updateUsers();

    /**
     * "change" fires when:
     *
     * - user joins
     * - user leaves
     * - user changes metadata
     */
    awareness.on("change", updateUsers);

    return () => {
      awareness.off("change", updateUsers);
    };
  }, [awareness]);

  return users;
}
