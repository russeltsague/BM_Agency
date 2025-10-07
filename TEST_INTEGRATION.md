# Integration Testing Guide

## 🚀 Quick Start

### 1. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd "Backend "
npm run dev
```
✅ Backend should be running on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
✅ Frontend should be running on `http://localhost:3000`

---

## 🧪 Test Scenarios

### Test 1: Public Homepage Data Fetching

1. **Open:** `http://localhost:3000`
2. **Check Services Section:**
   - Should show loading spinner initially
   - Then display services from MongoDB
   - If no data: Shows "No services available" message
   - If error: Shows error message with retry button

3. **Check Blog Section:**
   - Should display published articles from MongoDB
   - Shows author, date, read time
   - Limited to 3 articles on homepage

4. **Check Portfolio Section:**
   - Should display realisations from MongoDB
   - Shows category, tags, description
   - Limited to 6 items on homepage

**Expected Result:** All sections load real data from backend API

---

### Test 2: Authentication Flow

1. **Open:** `http://localhost:3000/admin/login`
2. **Try invalid login:**
   - Email: `test@test.com`
   - Password: `wrongpassword`
   - Should show error message

3. **Create admin user (if needed):**
   ```bash
   # In Backend directory
   npm run db:init
   ```
   This creates default admin user

4. **Login with valid credentials:**
   - Use credentials from your database
   - Should redirect to `/admin/dashboard`
   - Token stored in localStorage as `admin-token`

5. **Check protected route:**
   - Try accessing `/admin/services` directly
   - Should work if logged in
   - Should redirect to login if not logged in

**Expected Result:** Authentication works, routes are protected

---

### Test 3: Admin Services CRUD

#### Create Service
1. **Go to:** `http://localhost:3000/admin/services`
2. **Click:** "Add Service" button
3. **Fill form:**
   - Title: "Test Service"
   - Description: "This is a test service description"
   - Features: "Feature 1, Feature 2, Feature 3"
   - Pricing: "1000 FCFA/month"
   - Duration: "3 months"
   - Case Study: "Test case study"
4. **Click:** "Create Service"
5. **Check:**
   - Success toast appears
   - New service appears in table
   - Go to homepage - service should appear there too

#### Update Service
1. **In services table:** Click edit icon (pencil)
2. **Modify:** Change title to "Updated Test Service"
3. **Click:** "Update Service"
4. **Check:**
   - Success toast appears
   - Table updates immediately
   - Changes persist on page refresh

#### Delete Service
1. **In services table:** Click delete icon (trash)
2. **Confirm:** Click "Delete" in modal
3. **Check:**
   - Success toast appears
   - Service removed from table
   - Service removed from homepage

**Expected Result:** All CRUD operations work and update MongoDB

---

### Test 4: API Error Handling

#### Test Network Error
1. **Stop backend server**
2. **Refresh homepage**
3. **Check:**
   - Error messages appear for each section
   - "Retry" buttons are shown
   - No app crash

#### Test Invalid Token
1. **In browser console:**
   ```javascript
   localStorage.setItem('admin-token', 'invalid-token')
   ```
2. **Try accessing:** `/admin/services`
3. **Check:**
   - Should get 401 error
   - Should redirect to login (or show error)

**Expected Result:** Errors are handled gracefully

---

### Test 5: Browser Network Tab Inspection

1. **Open DevTools:** F12 → Network tab
2. **Refresh homepage**
3. **Check requests:**
   - `GET http://localhost:5000/api/v1/services` → Status 200
   - `GET http://localhost:5000/api/v1/articles` → Status 200
   - `GET http://localhost:5000/api/v1/realisations` → Status 200

4. **Login to admin**
5. **Check requests:**
   - `POST http://localhost:5000/api/v1/auth/login` → Status 200
   - Response includes `token` and `user` data

6. **Create a service**
7. **Check requests:**
   - `POST http://localhost:5000/api/v1/services` → Status 201
   - Request headers include `Authorization: Bearer <token>`

**Expected Result:** All API calls succeed with correct status codes

---

### Test 6: MongoDB Data Verification

1. **Open MongoDB Compass** or **MongoDB Atlas**
2. **Connect to your database**
3. **Check collections:**
   - `services` - Should have your test service
   - `articles` - Should have articles
   - `realisations` - Should have portfolio items
   - `users` - Should have admin user

4. **After CRUD operations:**
   - Create → New document appears
   - Update → Document fields change
   - Delete → Document is removed

**Expected Result:** Database reflects all frontend operations

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch"
**Cause:** Backend not running or wrong URL
**Solution:** 
- Check backend is running on port 5000
- Verify `NEXT_PUBLIC_API_URL` in `Frontend/.env.local`

### Issue: CORS Error
**Cause:** CORS not configured properly
**Solution:**
- Check `FRONTEND_URL` in `Backend/.env`
- Verify CORS middleware in `Backend/src/app.ts`

### Issue: 401 Unauthorized
**Cause:** Invalid or expired token
**Solution:**
- Clear localStorage: `localStorage.clear()`
- Login again
- Check JWT_SECRET in backend .env

### Issue: No data showing
**Cause:** Empty database
**Solution:**
- Add data via admin panel
- Or use Postman to POST data directly
- Check MongoDB connection

### Issue: TypeScript errors
**Cause:** Type mismatches
**Solution:**
- Check API response structure matches interfaces in `lib/api.ts`
- Verify backend response format

---

## 📊 API Testing with Postman

### Import Collection
Create a Postman collection with these requests:

#### 1. Login
```
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your_password"
}
```

#### 2. Get Services (Public)
```
GET http://localhost:5000/api/v1/services
```

#### 3. Create Service (Protected)
```
POST http://localhost:5000/api/v1/services
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "New Service",
  "description": "Service description here",
  "features": ["Feature 1", "Feature 2"],
  "pricing": "500 FCFA/month",
  "duration": "6 months",
  "caseStudy": "Case study here"
}
```

#### 4. Update Service (Protected)
```
PATCH http://localhost:5000/api/v1/services/<service_id>
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "Updated Service Title"
}
```

#### 5. Delete Service (Protected)
```
DELETE http://localhost:5000/api/v1/services/<service_id>
Authorization: Bearer <your_token>
```

---

## ✅ Integration Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] MongoDB connected
- [ ] Environment variables configured
- [ ] CORS working (no console errors)
- [ ] Public pages load data
- [ ] Login works
- [ ] Admin routes protected
- [ ] Services CRUD works
- [ ] Toast notifications appear
- [ ] Loading states show
- [ ] Error handling works
- [ ] Data persists in MongoDB
- [ ] Network requests succeed

---

## 🎯 Next Steps After Testing

If all tests pass:
1. ✅ Integration is working correctly
2. 🔄 Update remaining admin pages (Blog, Portfolio, Products, Testimonials)
3. 🚀 Deploy to production
4. 🔒 Implement HttpOnly cookies for production
5. 📝 Add more comprehensive error logging

If tests fail:
1. Check console errors
2. Verify environment variables
3. Check network tab for failed requests
4. Review error messages
5. Consult INTEGRATION_GUIDE.md

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend terminal for errors
3. Review Network tab in DevTools
4. Verify MongoDB connection
5. Check environment variables
6. Review INTEGRATION_GUIDE.md for troubleshooting
