# AURA — E-Commerce with Role-Based Authentication & Product Management

A full-stack, production-ready MERN e-commerce application featuring **Role-Based Access Control (RBAC)** for **Sellers** and **Users (Customers)**, product inventory CRUD, live cart calculations with quantity controls, and dual-token JWT authentication.

---

## 🌐 Live Deployments

- **Live Frontend**: [https://frontend-phi-opal-sdltz1z9hh.vercel.app/products](https://frontend-phi-opal-sdltz1z9hh.vercel.app/products)
- **Live Backend API**: [https://e-commerce-auth-product-crud-5lot.vercel.app](https://e-commerce-auth-product-crud-5lot.vercel.app)

---

## 🚀 Key Highlights & Role Architecture

The application enforces strict separation of concerns across both frontend routes and backend APIs for two distinct user roles:

### 1. 🏪 Seller Role
- **Seller Dashboard (`/seller/dashboard`)**:
  - **Metrics & KPIs**: Total Listings, Total Units in Stock, Asset Valuation (₹), and Low Stock Alerts ($\le 5$ units).
  - **Product Table**: Quick search by name or category, stock status indicators (`In Stock`, `Low Stock`, `Out of Stock`), and instant action buttons.
- **Product Management (`/seller/products`)**: Dedicated catalog view with filtering and search.
- **Create Product (`/seller/products/add`)**: Create listings with name, category, price, stock, description, and live image URL preview.
- **Edit Product (`/seller/products/edit/:id`)**: Update product details, pricing, categories, and stock levels.
- **Delete Product**: Secure deletion with ownership verification.
- **Backend Protection**: Sellers can only update or delete products they created.

### 2. 🛍️ Customer (User) Role
- **Storefront & Catalog (`/products`)**:
  - Search by title and description.
  - Filter by categories (`Clothing`, `Footwear`, `Accessories`, `Electronics`, `Home & Living`, `General`).
  - Stock indicators and quick "Add to Cart" action.
  - Seller-only CRUD buttons (Add, Edit, Delete) are hidden from regular users.
- **Product Details (`/products/:id`)**:
  - Full product specifications, craftsmanship description, stock availability badge, and quantity selector.
- **Interactive Shopping Cart (`/cart`)**:
  - **`[-] Quantity [+]` Controls**:
    - `+` increases quantity (strictly capped at available product stock).
    - `-` decreases quantity (minimum quantity of 1).
    - Remove item action with instant calculation.
  - **Real-Time Financial Calculations**:
    - Item Subtotal: $\text{Price} \times \text{Quantity}$.
    - Cart Subtotal, Estimated Tax (5%), Free Shipping threshold (> ₹999), and Grand Total.
  - **Checkout Flow**: Interactive checkout process with order placement and cart reset.

---

## 🛡️ Route Protection Matrix

| Route | Guest | Customer (`user`) | Seller (`seller`) |
| :--- | :---: | :---: | :---: |
| `/login` & `/register` | ✅ Allowed | 🔄 Redirected to `/products` | 🔄 Redirected to `/seller/dashboard` |
| `/products` | ✅ View only | ✅ View & Add to Cart | ✅ View (with dashboard shortcut) |
| `/products/:id` | ✅ View only | ✅ View & Add to Cart | ✅ View details |
| `/cart` | 🔒 Redirect to Login | ✅ Full Access | 🔒 Redirected to `/seller/dashboard` |
| `/seller/dashboard` | 🔒 Redirect to Login | ⛔ 403 Forbidden | ✅ Full Access |
| `/seller/products` | 🔒 Redirect to Login | ⛔ 403 Forbidden | ✅ Full Access |
| `/seller/products/add` | 🔒 Redirect to Login | ⛔ 403 Forbidden | ✅ Full Access |
| `/seller/products/edit/:id` | 🔒 Redirect to Login | ⛔ 403 Forbidden | ✅ Full Access |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios with interceptors (automatic token refresh handling)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (Access Token + Refresh Token via HTTP-only Cookie)
- **Password Security**: Bcrypt.js (salted hashing)
- **Validation**: Express-Validator
- **Documentation**: Swagger UI (`/api/docs`)

---

## 📦 Data Models

### User Model (`User.js`)
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'seller'], default: 'user' },
  refreshToken: { type: String }
}
```

### Product Model (`Product.js`)
```javascript
{
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true, default: 'General' },
  image: { type: String, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}
```

### Cart Model (`Cart.js`)
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 }
    }
  ]
}
```

---

## 🔌 API Endpoints Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new account with role (`user` or `seller`) |
| `POST` | `/api/auth/login` | Public | Login & receive JWT access + refresh tokens |
| `POST` | `/api/auth/refresh-token` | Public | Generate new access token via refresh token |
| `POST` | `/api/auth/logout` | Authenticated | Revoke refresh token and clear cookies |
| `GET` | `/api/auth/me` | Authenticated | Get current authenticated user details and role |

### Products (`/api/products`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/products` | Public | Get all products (with search & category filters) |
| `GET` | `/api/products/:id` | Public | Get single product details |
| `GET` | `/api/products/seller/my-products` | Seller | Get all products owned by authenticated seller |
| `POST` | `/api/products` | Seller | Create a new product listing |
| `PUT` | `/api/products/:id` | Seller (Owner) | Update an existing product |
| `DELETE` | `/api/products/:id` | Seller (Owner) | Delete a product |

### Cart (`/api/cart`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/cart` | User | Get current user's cart items with subtotals |
| `POST` | `/api/cart/items` | User | Add item to cart or increment quantity |
| `PUT` | `/api/cart/items/:productId` | User | Update quantity (`[-] / [+]` with stock validation) |
| `DELETE` | `/api/cart/items/:productId` | User | Remove specific item from cart |
| `DELETE` | `/api/cart` | User | Clear all items from cart |

---

## 📁 Project Structure

```
authentication-product-crud/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Auth & token handlers
│   │   │   ├── product.controller.js # Product CRUD & seller filters
│   │   │   └── cart.controller.js    # Cart items & quantity logic
│   │   ├── middleware/
│   │   │   ├── auth.middleware.js    # JWT verification
│   │   │   └── role.middleware.js    # Role authorization guard
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   └── Cart.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   └── cart.routes.js
│   │   ├── validators/
│   │   │   ├── auth.validator.js
│   │   │   └── product.validator.js
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # HTTP listener & DNS setup
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Dynamic role-based navigation & badges
│   │   │   └── ProtectedRoute.jsx    # Route-level RBAC guard
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Auth state, login/register, role helpers
│   │   │   └── CartContext.jsx       # Cart state, [-] Qty [+], calculations
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Role-aware login & redirect
│   │   │   ├── Register.jsx          # Interactive role picker (User vs Seller)
│   │   │   ├── Products.jsx          # Storefront catalog & search
│   │   │   ├── ProductDetails.jsx    # Product specifications & add to cart
│   │   │   ├── Cart.jsx              # Cart summary, quantity controls & checkout
│   │   │   ├── SellerDashboard.jsx   # Seller analytics & product management
│   │   │   ├── SellerProducts.jsx    # Dedicated seller product management
│   │   │   ├── AddProduct.jsx        # Product creation form
│   │   │   └── EditProduct.jsx       # Product update form
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx         # Declarative routes & route guards
│   │   ├── services/
│   │   │   └── api.js                # Axios instance with interceptors
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Development Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### 1. Clone Repository
```bash
git clone https://github.com/Rohit-raj03/E-Commerce-Auth-Product-CRUD.git
cd E-Commerce-Auth-Product-CRUD
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_access_secret_key
REFRESH_TOKEN_SECRET=your_jwt_refresh_secret_key
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🧪 Testing User Roles

1. **Test as Customer**:
   - Register choosing the **"I want to Shop"** (Customer) card.
   - You are redirected to `/products`.
   - Browse catalog, open product details, and add items to your cart.
   - Adjust quantities with `[-]` and `[+]`, observing subtotal and total recalculations.
   - Try navigating to `/seller/dashboard` — you will be automatically redirected to `/products`.

2. **Test as Seller**:
   - Register choosing the **"I want to Sell"** (Merchant) card.
   - You are redirected to `/seller/dashboard`.
   - View your metrics (Total Listings, Stock, Inventory Valuation, Alerts).
   - Add new products with categories, pricing, stock, and image URLs.
   - Edit existing listings or delete them.
   - Changes immediately reflect in the public catalog.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
