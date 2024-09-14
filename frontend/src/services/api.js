const API_URL = 'http://localhost:3000';  // Backend URL

// Benutzer registrieren
export const register = async (username, email, password, team) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, team }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Unexpected response format from server');
    }

    if (!response.ok) {
      throw new Error(data.msg || 'Registration failed');
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error.message);
    throw error;
  }
};

// Benutzer anmelden
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Unexpected response format from server');
    }

    if (!response.ok) {
      throw new Error(data.msg || 'Login failed');
    }

    // Token im localStorage speichern
    localStorage.setItem('token', data.token);

    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

// Benutzerprofil abrufen
export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Token nicht gefunden. Bitte erneut anmelden.');

    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.msg || 'Profilabruf fehlgeschlagen.');
    }

    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen des Profils:', error.message);
    throw error;
  }
};

// Profil bearbeiten
export const editProfile = async (username, email, team) => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ username, email, team }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Unexpected response format from server');
    }

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to update profile');
    }

    return data;
  } catch (error) {
    console.error('Edit profile error:', error.message);
    throw error;
  }
};

// Passwort ändern
export const changePassword = async (oldPassword, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Unexpected response format from server');
    }

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to change password');
    }

    return data;
  } catch (error) {
    console.error('Change password error:', error.message);
    throw error;
  }
};

// Benutzer abmelden (Logout)
export const logout = () => {
  localStorage.removeItem('token');
};
