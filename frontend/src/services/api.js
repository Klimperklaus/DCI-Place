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