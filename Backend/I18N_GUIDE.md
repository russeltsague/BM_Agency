# Bilingual Support Guide (English/French)

## Backend Implementation

### Overview
The backend now supports bilingual responses (English and French) for all API messages, validation errors, and system responses.

### How It Works

#### 1. Language Detection
The system automatically detects the user's preferred language from:
- `x-language` header (priority 1) - e.g., `x-language: fr`
- `Accept-Language` header (priority 2) - e.g., `Accept-Language: fr-FR`
- `lang` query parameter (priority 3) - e.g., `?lang=fr`
- Defaults to English if none provided

#### 2. Using Translations in Controllers

```typescript
import { Request, Response } from 'express';

export const myController = {
  async myMethod(req: Request, res: Response) {
    // Use req.t() to translate
    return res.status(200).json({
      status: 'success',
      message: req.t?.('common.success') || 'Success'
    });
  }
};
```

#### 3. Available Translation Keys

All translation keys are in `src/i18n/locales/`:
- `en.json` - English translations
- `fr.json` - French translations

Common categories:
- `auth.*` - Authentication messages
- `validation.*` - Validation errors
- `errors.*` - General errors
- `articles.*` - Article-related messages
- `services.*` - Service-related messages
- `common.*` - Common messages

### Testing Endpoints with Different Languages

#### Using cURL

```bash
# English (default)
curl http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrong"}'

# French (x-language header)
curl http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "x-language: fr" \
  -d '{"email":"wrong@email.com","password":"wrong"}'

# French (Accept-Language header)
curl http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept-Language: fr-FR" \
  -d '{"email":"wrong@email.com","password":"wrong"}'

# French (query parameter)
curl "http://localhost:5000/api/v1/auth/login?lang=fr" \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrong"}'
```

### Adding New Translations

1. Open `src/i18n/locales/en.json` and add your key:
```json
{
  "myCategory": {
    "myKey": "My English message"
  }
}
```

2. Open `src/i18n/locales/fr.json` and add the French version:
```json
{
  "myCategory": {
    "myKey": "Mon message en français"
  }
}
```

3. Use in your controller:
```typescript
const message = req.t?.('myCategory.myKey') || 'Fallback message';
```

---

## Frontend Implementation (React)

### 1. Install i18next

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. Create Translation Files

Create `src/i18n/locales/`:

**en.json:**
```json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "about": "About",
    "contact": "Contact"
  },
  "auth": {
    "login": "Login",
    "logout": "Logout",
    "email": "Email",
    "password": "Password",
    "submit": "Submit"
  },
  "common": {
    "language": "Language",
    "loading": "Loading...",
    "error": "An error occurred"
  }
}
```

**fr.json:**
```json
{
  "nav": {
    "home": "Accueil",
    "services": "Services",
    "about": "À propos",
    "contact": "Contact"
  },
  "auth": {
    "login": "Connexion",
    "logout": "Déconnexion",
    "email": "Email",
    "password": "Mot de passe",
    "submit": "Soumettre"
  },
  "common": {
    "language": "Langue",
    "loading": "Chargement...",
    "error": "Une erreur s'est produite"
  }
}
```

### 3. Configure i18next

Create `src/i18n/config.ts`:

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
```

### 4. Initialize in Your App

**src/index.tsx or src/main.tsx:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/config'; // Import i18n config
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 5. Create Language Switcher Component

**src/components/LanguageSwitcher.tsx:**
```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Also update API requests to send x-language header
    localStorage.setItem('language', lng);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => changeLanguage('en')}
        className={i18n.language === 'en' ? 'active' : ''}
      >
        English
      </button>
      <button
        onClick={() => changeLanguage('fr')}
        className={i18n.language === 'fr' ? 'active' : ''}
      >
        Français
      </button>
    </div>
  );
};
```

### 6. Use Translations in Components

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();

  return (
    <form>
      <h2>{t('auth.login')}</h2>
      <input type="email" placeholder={t('auth.email')} />
      <input type="password" placeholder={t('auth.password')} />
      <button type="submit">{t('auth.submit')}</button>
    </form>
  );
};
```

### 7. Configure Axios to Send Language Header

**src/api/client.ts:**
```typescript
import axios from 'axios';
import i18n from '../i18n/config';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

// Add language header to all requests
apiClient.interceptors.request.use((config) => {
  config.headers['x-language'] = i18n.language || 'en';
  
  // Add auth token if exists
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

export default apiClient;
```

### 8. Example Usage in a Component with API

```typescript
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '../api/client';
import { LanguageSwitcher } from '../components/LanguageSwitcher';

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      // Redirect or update state
    } catch (err: any) {
      // Error message will already be in the user's language
      setError(err.response?.data?.message || t('common.error'));
    }
  };

  return (
    <div>
      <LanguageSwitcher />
      <h1>{t('auth.login')}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{t('auth.submit')}</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};
```

---

## Best Practices

1. **Always provide fallbacks** when using translations:
   ```typescript
   req.t?.('key') || 'Fallback message'
   ```

2. **Use consistent naming** for translation keys (category.subcategory.key)

3. **Keep translations updated** - when adding new messages, add both English and French

4. **Test both languages** for each new feature

5. **Use the same keys** on frontend and backend where applicable for consistency

---

## Environment Variables

Add to your `.env` file:
```bash
# Default language (optional, defaults to 'en')
DEFAULT_LANGUAGE=en
```

---

## Production Considerations

1. Consider using a translation management platform (e.g., Lokalise, Crowdin) for larger projects
2. Cache translations on the client side
3. Lazy load translations for better performance
4. Consider adding more languages in the future by simply adding new JSON files
