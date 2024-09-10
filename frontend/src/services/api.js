const API_URL = 'http://localhost:3000/app';  // Backend URL

// Benutzer registrieren
export const register = async (username, email, password, classTeam) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password, classTeam }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Registration failed');
  }

  return response.json();
};

// Benutzer anmelden
export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.msg || 'Login failed');
  }

  const data = await response.json();
  
  // Token im localStorage speichern
  localStorage.setItem('token', data.token);
  
  return data;
};