# İlhan Store — Frontend (ilhan-store-client)

İlhanStore.API (ASP.NET Core) backend'i için React + TypeScript istemci uygulaması.

## Teknolojiler

- **React 19** + **TypeScript** + **Vite**
- **Redux Toolkit** + **React-Redux** (durum yönetimi)
- **React Router v7** (yönlendirme)
- **Axios** (HTTP istemcisi, JWT interceptor'ları ile)

## Kurulum

```bash
npm install
```

`.env` dosyasında API adresini ayarlayın (varsayılan hazır gelir):

```
VITE_API_BASE_URL=http://localhost:5277/api
```

## Çalıştırma

```bash
npm run dev      # geliştirme sunucusu (http://localhost:5173)
npm run build    # üretim derlemesi
npm run preview  # üretim derlemesini önizle
```

> Not: Backend CORS ayarı `http://localhost:5173` adresine izin verir.

## Klasör Yapısı

```
src/
├── api/          # axios örneği + interceptor'lar
├── assets/       # images, icons, fonts
├── components/   # common, layout, product, category, cart, auth, ui
├── pages/        # Home, Products, ProductDetail, Categories, Cart,
│                 # Checkout, Orders, Favorites, Profile, Login,
│                 # Register, NotFound, Admin
├── layouts/      # MainLayout, AdminLayout
├── routes/       # AppRoutes, ProtectedRoute
├── services/     # auth, product, category, cart, order, user servisleri
├── store/        # Redux store + slices (auth, cart, product, category)
├── hooks/        # tip güvenli redux hook'ları, useFavorites
├── types/        # backend DTO'larıyla eşleşen tipler
├── utils/        # constants, storage, format yardımcıları
└── styles/       # global stiller
```

## Notlar

- Kimlik doğrulama JWT tabanlıdır; token `localStorage`'da saklanır ve her
  isteğe otomatik eklenir. 401 durumunda oturum temizlenir.
- Favoriler backend'de uç nokta bulunmadığından istemci tarafında
  (`localStorage`) tutulur.
- `/admin` rotaları yalnızca `Admin` rolüne sahip kullanıcılara açıktır.
