// assets/utils/api.js

const BASE_URL = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('token'); // or get from cookie/session if applicable

  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

 async function get(endpoint) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error(await response.text());

  return response.json();
}

 async function post(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  if (!response.ok) throw new Error(await response.text());

  return response.json();
}

export default {
    get,
    post
};

// Add more methods (PUT, DELETE) as needed
