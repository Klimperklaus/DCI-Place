const API_URL = 'http://localhost:5000/api';  // Backend URL

// Fetch and handle JSON responses
const parseJSON = async (response) => {
  try {
    return await response.json();
  } catch (e) {
    throw new Error('Unexpected response format from server');
  }
};

// Benutzer registrieren
export const register = async (username, email, password, team) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, team }),
      credentials: 'include', // Include cookies with request
    });

    const data = await parseJSON(response);

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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // Include cookies with request
    });

    const data = await parseJSON(response);

    if (!response.ok) {
      throw new Error(data.msg || 'Login failed');
    }

    return data;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
};

// Benutzerprofil abrufen
export const getProfile = async () => {
  try {
    const response = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      credentials: 'include', // Include cookies with request
    });

    const data = await parseJSON(response);

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
      },
      body: JSON.stringify({ username, email, team }),
      credentials: 'include', // Include cookies with request
    });

    const data = await parseJSON(response);

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
      },
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: 'include', // Include cookies with request
    });

    const data = await parseJSON(response);

    if (!response.ok) {
      throw new Error(data.msg || 'Failed to change password');
    }

    return data;
  } catch (error) {
    console.error('Change password error:', error.message);
    throw error;
  }
};

// Alle Benutzer abrufen (nur für Admins)
export const getUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Still sending Bearer token here if required
      },
      credentials: 'include', // Include cookies with request
    });

    const data = await parseJSON(response);

    if (!response.ok) {
      throw new Error(data.msg || 'Benutzerabruf fehlgeschlagen.');
    }

    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzer:', error.message);
    throw error;
  }
};

// Benutzer abmelden (Logout)
export const logout = async () => {
  try {
    const response = await fetch(`${API_URL}/logout`, {
      method: 'POST',
      credentials: 'include', // Include cookies with request
    });

    const data = await parseJSON(response);

    if (!response.ok) {
      throw new Error(data.msg || 'Logout fehlgeschlagen');
    }

    return data;
  } catch (error) {
    console.error('Fehler beim Logout:', error.message);
    throw error;
  }
};
