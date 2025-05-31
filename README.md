# To'yxona Bron - Frontend Dokumentatsiyasi

## 📋 Loyiha haqida

To'yxona Bron - to'yxonalarni bron qilish va boshqarish tizimi. Bu tizim orqali foydalanuvchilar to'yxonalarni ko'rish, bron qilish va to'lovlarni amalga oshirish imkoniyatiga ega bo'ladilar. To'yxona egalari o'z to'yxonalarini boshqarish, bronlarni tasdiqlash va oylik obuna to'lovlarini amalga oshirish imkoniyatiga ega. Adminlar esa butun tizimni nazorat qilish, to'yxonalarni tasdiqlash, komissiya va obuna to'lovlarini boshqarish imkoniyatiga ega.

## 🚀 O'rnatish va ishga tushirish

### Talablar

- Node.js (v14 yoki undan yuqori)
- npm yoki yarn
- Backend server ishlab turgan bo'lishi kerak

### O'rnatish

1. Loyihani GitHub'dan yuklab oling:

```bash
git clone https://github.com/username/weddingvenues.git
cd weddingvenues
```

2. Frontend bog'liqliklarni o'rnating:

```bash
npm install

# yoki

yarn install
```

3. `.env` faylini yarating va quyidagi o'zgaruvchilarni sozlang:

```
VITE_API_URL=http://localhost:8000
```

4. Frontend ilovasini ishga tushiring:

```bash
npm run dev

# yoki

yarn dev
```

5. Brauzeringizda `http://localhost:5173` manzilini oching.

## 🏗️ Loyiha tuzilishi

```
src/
├── components/ # Umumiy komponentlar
├── contexts/ # React kontekstlari
├── pages/ # Sahifalar
│ ├── admin/ # Admin sahifalari
│ ├── owner/ # To'yxona egasi sahifalari
│ └── user/ # Foydalanuvchi sahifalari
├── services/ # API va boshqa xizmatlar
├── App.jsx # Asosiy ilova komponenti
├── main.jsx # Kirish nuqtasi
└── index.css # Global CSS
```

## 🔐 Autentifikatsiya

Loyiha JWT (JSON Web Token) asosida autentifikatsiya tizimidan foydalanadi. Autentifikatsiya `AuthContext.jsx` fayli orqali boshqariladi.

### Foydalanuvchi turlari

1. **Admin** - Tizim administratori
2. **Owner** - To'yxona egasi
3. **User** - Oddiy foydalanuvchi

### Login qilish

Har bir foydalanuvchi turi uchun alohida login endpointlari mavjud:

- Admin: `/admin/login`
- Owner: `/owner/login`
- User: `/user/login`

## 📱 Asosiy sahifalar

### Foydalanuvchi sahifalari

- `/user` - Foydalanuvchi bosh sahifasi
- `/user/venues` - To'yxonalar ro'yxati
- `/user/venues/:id/book` - To'yxonani bron qilish
- `/user/bookings` - Foydalanuvchining bronlari

### To'yxona egasi sahifalari

- `/owner` - Eganing bosh sahifasi
- `/owner/venues` - Eganing to'yxonalari
- `/owner/venues/add` - Yangi to'yxona qo'shish
- `/owner/venues/:id` - To'yxona ma'lumotlari
- `/owner/bookings` - Bronlar ro'yxati
- `/owner/subscription` - Oylik obuna

### Admin sahifalari

- `/admin` - Admin bosh sahifasi
- `/admin/venues` - To'yxonalar ro'yxati
- `/admin/venues/add` - Yangi to'yxona qo'shish
- `/admin/venues/:id` - To'yxona ma'lumotlari
- `/admin/owners` - To'yxona egalari ro'yxati
- `/admin/bookings` - Bronlar ro'yxati
- `/admin/users` - Foydalanuvchilar ro'yxati
- `/admin/commission-payments` - Komissiya to'lovlari
- `/admin/subscription-payments` - Obuna to'lovlari

## 🔄 API xizmatlari

API so'rovlari `src/services/api.js` fayli orqali amalga oshiriladi. Bu fayl axios kutubxonasidan foydalanadi va barcha API so'rovlari uchun asosiy konfiguratsiyani o'z ichiga oladi.

```javascript
// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
});

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api };
```

## 🛡️ Himoyalangan yo'nalishlar

Himoyalangan yo'nalishlar `ProtectedRoute` komponenti orqali amalga oshiriladi. Bu komponent foydalanuvchi autentifikatsiya qilinganligini va kerakli rolga ega ekanligini tekshiradi.

```javascript
// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
```

## 📊 Muhim komponentlar

### Navbar

`Navbar` komponenti barcha sahifalarda ko'rsatiladi va foydalanuvchi turiga qarab turli navigatsiya havolalarini ko'rsatadi.

### UserVenues

Foydalanuvchilar uchun to'yxonalar ro'yxatini ko'rsatadi. To'yxona egasining obuna holati asosida to'yxonalarni filtrlaydi.

### OwnerSubscription

To'yxona egasi uchun oylik obuna ma'lumotlarini ko'rsatadi va obuna to'lovlarini boshqarish imkoniyatini beradi.

### SubscriptionPayments

Admin uchun barcha to'yxona egalarining obuna to'lovlarini ko'rsatadi va ularni tasdiqlash imkoniyatini beradi.

## 🔄 Oylik obuna tizimi

Oylik obuna tizimi to'yxona egalarining to'yxonalarini foydalanuvchilarga ko'rsatish uchun oylik to'lov qilishini ta'minlaydi.

### Obuna holatlari

- **Faol** - To'yxona egasining obunasi faol, to'yxonalari foydalanuvchilarga ko'rinadi
- **Tugagan** - Obuna tugagan, to'yxonalar faqat egasiga ko'rinadi
- **Foydalanuvchi broni bor** - Obuna tugagan bo'lsa ham, foydalanuvchi bronlagan to'yxonalar ko'rinadi, lekin yangi bron qilish mumkin emas

### Obuna to'lovi hisoblash

Obuna to'lovi quyidagi formula asosida hisoblanadi:

```
Obuna to'lovi = (Jami sig'im / 100) _ Admin foizi _ Bronlar soni
```

## 🧪 Test ma'lumotlari

Tizimni test qilish uchun quyidagi ma'lumotlardan foydalanishingiz mumkin:

### Admin

- Username: superadmin
- Password: admin123

### To'yxona egasi

- Username: test_owner
- Password: owner123

### Foydalanuvchi

- Telefon: +998901234567

## 🐛 Xatolarni bartaraf etish

### API bilan bog'lanish muammolari

1. Backend server ishga tushganligini tekshiring
2. `.env` faylidagi `VITE_API_URL` to'g'ri sozlanganligini tekshiring
3. CORS sozlamalarini tekshiring

### Autentifikatsiya muammolari

1. LocalStorage'da token mavjudligini tekshiring
2. Token muddati tugaganligini tekshiring
3. Backend serverda JWT kaliti to'g'ri sozlanganligini tekshiring

## 📝 Eslatmalar

- Loyiha React va Vite asosida qurilgan
- Stillar uchun Tailwind CSS ishlatilgan
- Routing uchun React Router DOM ishlatilgan
- API so'rovlari uchun Axios ishlatilgan
