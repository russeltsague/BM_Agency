# Quick Test: Bilingual API

## Test the i18n system immediately after restarting the server

### 1. Test Login in English (default)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@test.com","password":"wrong"}'
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "Incorrect email or password"
}
```

### 2. Test Login in French (x-language header)
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "x-language: fr" \
  -d '{"email":"wrong@test.com","password":"wrong"}'
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "Email ou mot de passe incorrect"
}
```

### 3. Test Protected Route Without Token (English)
```bash
curl http://localhost:5000/api/v1/auth/me
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "You are not logged in! Please log in to get access."
}
```

### 4. Test Protected Route Without Token (French)
```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "x-language: fr"
```

**Expected Response:**
```json
{
  "status": "error",
  "message": "Vous n'êtes pas connecté! Veuillez vous connecter pour accéder."
}
```

### 5. Test Valid Login in French
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "x-language: fr" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Expected Response (with French messages if there were any):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      ...
    }
  }
}
```

## Using Query Parameter

You can also set language via query parameter:

```bash
curl "http://localhost:5000/api/v1/auth/me?lang=fr"
```

## Using Accept-Language Header

```bash
curl http://localhost:5000/api/v1/auth/me \
  -H "Accept-Language: fr-FR,fr;q=0.9"
```

## Frontend Example (JavaScript)

```javascript
// Set language in localStorage
localStorage.setItem('language', 'fr');

// Make API request with language header
fetch('http://localhost:5000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-language': localStorage.getItem('language') || 'en'
  },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'admin123'
  })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

## React + Axios Example

```tsx
import axios from 'axios';
import i18n from './i18n/config';

// Create axios instance with language header
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1'
});

// Add language to every request
api.interceptors.request.use(config => {
  config.headers['x-language'] = i18n.language || 'en';
  return config;
});

// Use it
async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password });
  // Error messages will automatically be in the selected language
  return data;
}
```
