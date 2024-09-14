import React, { useEffect, useState, useCallback } from 'react';
import { getProfile, editProfile, changePassword } from '../services/api';
import teams from '../data/teams';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [team, setTeam] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setUsername(data.username);
        setEmail(data.email);
        setTeam(data.team);
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = useCallback(async (e) => {
    e.preventDefault();
    try {
      await editProfile(username, email, team);
      setProfile({ ...profile, username, email, team });
      setEditing(false);
      setMessage({ type: 'success', text: 'Profil erfolgreich aktualisiert!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  }, [username, email, team, profile]);

  const handleChangePassword = useCallback(async (e) => {
    e.preventDefault();
    try {
      await changePassword(oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setMessage({ type: 'success', text: 'Passwort erfolgreich geändert!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  }, [oldPassword, newPassword]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }, []);

  return (
    <div className="profilewrap">
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      {profile && (
        <div className="profile-content">
          <h1>Profil</h1>
          <button onClick={() => setEditing(prev => !prev)}>
            {editing ? 'Abbrechen' : 'Bearbeiten'}
          </button>
          {editing ? (
            <form onSubmit={handleEditProfile}>
              <input
                type="text"
                placeholder="Benutzername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <select
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                required
              >
                <option value="" disabled hidden>
                  Team auswählen
                </option>
                {Object.keys(teams).map((key) => (
                  <option key={key} value={key}>
                    {teams[key]}
                  </option>
                ))}
              </select>
              <button type="submit">Profil speichern</button>
            </form>
          ) : (
            <div>
              <p><strong>Benutzername:</strong> {profile.username}</p>
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Team:</strong> {profile.team}</p>
            </div>
          )}

          <h2>Passwort ändern</h2>
          <form onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="Altes Passwort"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Neues Passwort"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit">Passwort ändern</button>
          </form>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;