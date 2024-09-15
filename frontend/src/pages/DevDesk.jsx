import React, { useEffect, useState } from 'react';
import { getUsers } from '../services/api';

const DevDesk = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="devwrap">
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      <h1>DevDesk</h1>
      <p>Alle Anmeldungen</p>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username} ({user.email}) - Team: {user.team}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DevDesk;