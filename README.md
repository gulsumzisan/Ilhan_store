# Ilhan_store

Ilhan_store

IlhanStore, React (TypeScript) ve ASP.NET Core Web API (.NET) kullanılarak geliştirilen bir e-ticaret uygulamasıdır. Proje, modern web geliştirme teknolojilerini öğrenmek ve uygulamak amacıyla oluşturulmuştur.

Uygulama; kullanıcıların ürünleri görüntüleyebildiği, arayabildiği, filtreleyebildiği, sepete ekleyebildiği ve sipariş oluşturabildiği temel e-ticaret işlevlerini sunmayı hedeflemektedir. Yönetici tarafında ise ürün, kategori ve sipariş yönetimi gibi işlemler gerçekleştirilebilmektedir.

Projenin Backent Yapısı

IlhanStore.sln
│
├── IlhanStore.API
│ ├── Controllers
│ │ ├── AuthController.cs
│ │ ├── ProductsController.cs
│ │ ├── CategoriesController.cs
│ │ ├── CartController.cs
│ │ ├── OrdersController.cs
│ │ └── UsersController.cs
│ │
│ ├── Middleware
│ ├── Extensions
│ ├── Configuration
│ ├── Program.cs
│ └── appsettings.json
│
├── IlhanStore.Business
│ ├── Abstract
│ │ ├── IProductService.cs
│ │ ├── ICategoryService.cs
│ │ ├── IUserService.cs
│ │ ├── ICartService.cs
│ │ └── IOrderService.cs
│ │
│ ├── Concrete
│ │ ├── ProductManager.cs
│ │ ├── CategoryManager.cs
│ │ ├── UserManager.cs
│ │ ├── CartManager.cs
│ │ └── OrderManager.cs
│ │
│ ├── DTOs
│ ├── Validation
│ ├── Mapping
│ └── DependencyResolvers
│
├── IlhanStore.DataAccess
│ ├── Abstract
│ │ ├── IProductRepository.cs
│ │ ├── ICategoryRepository.cs
│ │ ├── IUserRepository.cs
│ │ ├── ICartRepository.cs
│ │ └── IOrderRepository.cs
│ │
│ ├── Concrete
│ │ ├── EntityFramework
│ │ │ ├── EfProductRepository.cs
│ │ │ ├── EfCategoryRepository.cs
│ │ │ ├── EfUserRepository.cs
│ │ │ ├── EfCartRepository.cs
│ │ │ └── EfOrderRepository.cs
│ │ │
│ │ └── Context
│ │ └── IlhanStoreContext.cs
│ │
│ └── Migrations
│
└── IlhanStore.Entity
├── Entities
│ ├── Product.cs
│ ├── Category.cs
│ ├── User.cs
│ ├── Cart.cs
│ ├── CartItem.cs
│ ├── Order.cs
│ ├── OrderItem.cs
│ ├── Review.cs
│ ├── Address.cs
│ └── Favorite.cs
│
└── Enums

    Projenin frontend yapısı

    ilhan-store-client

│
├── public
│
├── src
│ │
│ ├── api
│ │ └── axios.ts
│ │
│ ├── assets
│ │ ├── images
│ │ ├── icons
│ │ └── fonts
│ │
│ ├── components
│ │ ├── common
│ │ ├── layout
│ │ ├── product
│ │ ├── category
│ │ ├── cart
│ │ ├── auth
│ │ └── ui
│ │
│ ├── pages
│ │ ├── Home
│ │ ├── Products
│ │ ├── ProductDetail
│ │ ├── Categories
│ │ ├── Cart
│ │ ├── Checkout
│ │ ├── Orders
│ │ ├── Favorites
│ │ ├── Profile
│ │ ├── Login
│ │ ├── Register
│ │ ├── NotFound
│ │ └── Admin
│ │
│ ├── layouts
│ │ ├── MainLayout.tsx
│ │ └── AdminLayout.tsx
│ │
│ ├── routes
│ │ ├── AppRoutes.tsx
│ │ └── ProtectedRoute.tsx
│ │
│ ├── services
│ │ ├── authService.ts
│ │ ├── productService.ts
│ │ ├── categoryService.ts
│ │ ├── cartService.ts
│ │ └── orderService.ts
│ │
│ ├── store
│ │ ├── store.ts
│ │ └── slices
│ │ ├── authSlice.ts
│ │ ├── cartSlice.ts
│ │ ├── productSlice.ts
│ │ └── categorySlice.ts
│ │
│ ├── hooks
│ │
│ ├── types
│ │ ├── Product.ts
│ │ ├── Category.ts
│ │ ├── User.ts
│ │ ├── Order.ts
│ │ └── Cart.ts
│ │
│ ├── utils
│ │
│ ├── styles
│ │
│ ├── App.tsx
│ └── main.tsx
│
├── package.json
└── tsconfig.json

Backend tarafında katmanlı mimari yaklaşımı kullanılarak RESTful API geliştirilirken, frontend tarafında React ve TypeScript ile bileşen tabanlı bir yapı benimsenmiştir.

Gereksinimler

Frontend

React
TypeScript
Vite
React Router DOM
Redux Toolkit
TanStack Query
Axios
Tailwind CSS
React Hook Form
Zod

Backend

ASP.NET Core Web API (.NET)
C#
Entity Framework Core
SQL Server
JWT Authentication
AutoMapper
FluentValidation
Swagger
Serilog
