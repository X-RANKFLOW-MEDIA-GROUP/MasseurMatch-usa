# 🚀 MasseurMatch Quick Start

## 1️⃣ Setup Database (One-time - 5 minutes)

### A. Create Tables
1. Open **Supabase SQL Editor**: https://app.supabase.com/
2. Copy/paste entire file: `sql/setup_therapists_table.sql`
3. Click **Run**

### B. Create Test User
1. Go to **Authentication** → **Users** → **Add user**
2. Email: `test@test.com`, Password: `123456`
3. ✅ Enable "Auto Confirm User"
4. **Copy the UUID** shown

### C. Create Test Profile
1. Open `sql/seed_simple_therapist.sql`
2. Line 23: Replace UUID with the one you copied
3. Copy/paste entire file into SQL Editor
4. Click **Run**

✅ Done! You now have:
- Database tables created
- Test user: test@test.com / 123456
- Test therapist profile with reviews

---

## 2️⃣ Start Backend

```bash
cd ia-backend
npm run dev
```

✅ You should see:
```
✅ IA backend running on http://localhost:4000
```

---

## 3️⃣ Test API

```bash
cd ia-backend
node test-endpoints.js
```

✅ You should see:
```
✅ Public profile fetched successfully
   Name: Alex Santos
   City: Los Angeles, CA
```

---

## 4️⃣ Use in React

```tsx
// Get therapist profile
const response = await fetch(
  'http://localhost:4000/api/therapist/a0000000-0000-0000-0000-000000000001'
);
const { therapist } = await response.json();

console.log(therapist.display_name); // "Alex Santos"
console.log(therapist.city);         // "Los Angeles"
```

---

## 📚 Documentation

- **Backend Setup:** [ia-backend/README.md](ia-backend/README.md)
- **API Reference:** [ia-backend/API-DOCUMENTATION.md](ia-backend/API-DOCUMENTATION.md)
- **PHP vs Your Stack:** [BACKEND-SETUP-GUIDE.md](BACKEND-SETUP-GUIDE.md)

---

## 🆘 Common Issues

| Error | Fix |
|-------|-----|
| "Table not found" | Run SQL files in Supabase |
| "SUPABASE_URL missing" | Check `ia-backend/.env` exists |
| "Profile not found" | Run `seed_fake_therapist.sql` |

---

## ✅ You're Ready!

Your backend is fully implemented. Now you can:
1. Build React components
2. Call the API endpoints
3. Display therapist profiles
4. Create edit forms

**Don't use PHP!** You have a modern Node.js/React stack. 🎉
