🛍️ AURA — Full-Stack E-Commerce

AURA is a full-stack MERN e-commerce application with Role-Based Authentication (RBAC) for Sellers and Customers.

The project is divided into two independent applications:

- Frontend → React + Vite
- Backend → Node.js + Express + MongoDB

The frontend communicates with the backend through REST APIs.

---

🌐 Live Deployments

Frontend

https://frontend-phi-opal-sdltz1z9hh.vercel.app/products

Backend API

https://e-commerce-auth-product-crud-5lot.vercel.app

API Documentation

https://e-commerce-auth-product-crud-5lot.vercel.app/api/docs

---

🏗️ Architecture

                    ┌─────────────────────┐
                    │      AURA USER      │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      Vite           │
                    │   Tailwind CSS      │
                    └──────────┬──────────┘
                               │
                         REST API / Axios
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Express Backend   │
                    │      Node.js        │
                    │ JWT Authentication  │
                    │      RBAC           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    MongoDB Atlas    │
                    │      Mongoose       │
                    └─────────────────────┘

---

🚀 Features

🔐 Authentication

- User registration
- Seller registration
- Login
- Logout
- JWT authentication
- Access Token
- Refresh Token
- HTTP-only refresh-token cookie
- Password hashing using bcrypt
- Current-user endpoint
- Automatic access-token refresh
- Protected frontend routes
- Backend authentication middleware

---

👥 Role-Based Access Control

AURA supports two roles:

user
seller

🛍️ Customer

Customers can:

- Browse products
- Search products
- Filter products by category
- View product details
- Add products to cart
- Increase quantity
- Decrease quantity
- Remove cart items
- View cart calculations
- Checkout / place an order

Customers cannot:

- Create products
- Edit products
- Delete products
- Access seller dashboard

---

🏪 Seller

Sellers can:

- Access seller dashboard
- View inventory statistics
- Create products
- View their products
- Search products
- Filter products
- Edit their products
- Delete their products
- Manage stock
- View inventory valuation

A seller can only edit or delete products that belong to them.

---

📊 Seller Dashboard

The seller dashboard provides:

- Total Listings
- Total Units in Stock
- Inventory Valuation
- Low Stock Alerts
- Product search
- Category filtering
- Stock status

Stock Status

Stock > 5
    ↓
In Stock

Stock 1–5
    ↓
Low Stock

Stock = 0
    ↓
Out of Stock

---

🛒 Shopping Cart

Customers have a complete shopping cart system.

Quantity Controls

[-] Quantity [+]

Rules:

- Minimum quantity = "1"
- Maximum quantity = available product stock
- Quantity cannot exceed stock
- Product can be removed from cart
- Cart can be cleared

Cart Calculations

Item Subtotal
= Product Price × Quantity

Cart Subtotal
= Sum of all item subtotals

Estimated Tax
= Cart Subtotal × 5%

Shipping
= Free when subtotal > ₹999

Grand Total
= Subtotal + Tax + Shipping

---

🛡️ Route Protection

Route| Guest| Customer| Seller
"/login"| ✅| 🔄 Products| 🔄 Seller Dashboard
"/register"| ✅| 🔄 Products| 🔄 Seller Dashboard
"/products"| ✅ View| ✅ View + Cart| ✅ View
"/products/:id"| ✅ View| ✅ View + Cart| ✅ View
"/cart"| 🔒 Login| ✅| 🔒 Seller Dashboard
"/seller/dashboard"| 🔒 Login| ❌| ✅
"/seller/products"| 🔒 Login| ❌| ✅
"/seller/products/add"| 🔒 Login| ❌| ✅
"/seller/products/edit/:id"| 🔒 Login| ❌| ✅

---

🛠️ Tech Stack

Frontend

- React 18
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Axios
- Context API

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt.js
- Express Validator
- Swagger UI

---

📁 Project Structure

The frontend and backend are maintained separately.

Frontend

AURA-Frontend/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── CartContext.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Products.jsx
│   │   ├── ProductDetails.jsx
│   │   ├── Cart.jsx
│   │   ├── SellerDashboard.jsx
│   │   ├── SellerProducts.jsx
│   │   ├── AddProduct.jsx
│   │   └── EditProduct.jsx
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .env.example
├── package.json
└── vite.config.js

---

📁 Backend Structure

AURA-Backend/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   └── cart.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Cart.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   └── cart.routes.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── product.validator.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
└── package.json

---

🗄️ Database Models

User

{
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "seller"],
    default: "user"
  },
  refreshToken: String
}

---

Product

{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  image: String,
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}

---

Cart

{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },

      quantity: Number
    }
  ]
}

---

🔌 API Documentation

Authentication

Base URL:

/api/auth

Method| Endpoint| Access| Description
POST| "/register"| Public| Register user/seller
POST| "/login"| Public| Login
POST| "/refresh-token"| Public| Refresh access token
POST| "/logout"| Authenticated| Logout
GET| "/me"| Authenticated| Get current user

---

📦 Product APIs

Base URL:

/api/products

Method| Endpoint| Access| Description
GET| "/"| Public| Get all products
GET| "/:id"| Public| Get product
GET| "/seller/my-products"| Seller| Get seller products
POST| "/"| Seller| Create product
PUT| "/:id"| Seller + Owner| Update product
DELETE| "/:id"| Seller + Owner| Delete product

---

🛒 Cart APIs

Base URL:

/api/cart

Method| Endpoint| Access| Description
GET| "/"| User| Get cart
POST| "/items"| User| Add product
PUT| "/items/:productId"| User| Update quantity
DELETE| "/items/:productId"| User| Remove item
DELETE| "/"| User| Clear cart

---

🔐 Authentication Flow

Register / Login
       ↓
Backend validates credentials
       ↓
Password verified using bcrypt
       ↓
Access Token + Refresh Token
       ↓
Access Token → API Authorization
       ↓
Refresh Token → HTTP-only Cookie
       ↓
Access Token expires
       ↓
Axios interceptor requests refresh token
       ↓
New Access Token
       ↓
Original request continues

---

🛡️ Backend RBAC Flow

Every protected request follows:

Request
   ↓
JWT Authentication Middleware
   ↓
Is Token Valid?
   │
   ├── No → 401 Unauthorized
   │
   └── Yes
        ↓
     Get User
        ↓
     Role Middleware
        ↓
   ┌────┴────┐
   │         │
 user      seller
   │         │
   ❌        ✅

For product update/delete:

Seller Authentication
        ↓
Seller Role Check
        ↓
Find Product
        ↓
Check sellerId === loggedInUser._id
        ↓
        ├── No → 403 Forbidden
        │
        └── Yes → Update/Delete

---

⚙️ Local Development

Requirements

Make sure you have:

- Node.js 18+
- npm
- MongoDB Atlas or local MongoDB
- Git

---

1️⃣ Clone Frontend

git clone <YOUR_FRONTEND_REPOSITORY_URL>

cd AURA-Frontend

npm install

---

2️⃣ Frontend Environment Variables

Create:

.env

Add:

VITE_API_URL=http://localhost:5000/api

Start frontend:

npm run dev

Frontend will run on:

http://localhost:5173

---

3️⃣ Clone Backend

Open another terminal:

git clone <YOUR_BACKEND_REPOSITORY_URL>

cd AURA-Backend

npm install

---

4️⃣ Backend Environment Variables

Create:

.env

Add:

PORT=5000

MONGODB_URI=your_mongodb_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

ACCESS_TOKEN_EXPIRES_IN=15m

REFRESH_TOKEN_EXPIRES_IN=7d

NODE_ENV=development

Start backend:

npm run dev

Backend will run on:

http://localhost:5000

---

🔗 Frontend → Backend Connection

Frontend uses Axios to communicate with the backend.

Example:

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

Production:

VITE_API_URL=https://e-commerce-auth-product-crud-5lot.vercel.app/api

Development:

VITE_API_URL=http://localhost:5000/api

---

🚀 Deployment

Frontend

Recommended deployment:

React + Vite
     ↓
Vercel

Set the Vercel environment variable:

VITE_API_URL=https://your-backend-url.com/api

---

Backend

Deploy the Express API separately.

Example:

Node.js + Express
       ↓
Vercel / Render / Railway
       ↓
MongoDB Atlas

Backend environment variables must be configured in the deployment platform.

---

🔒 Environment Security

Never commit ".env" files.

Add this to ".gitignore":

node_modules/
.env
.env.local
.env.production
dist/

Never expose these values in frontend code:

MONGODB_URI
ACCESS_TOKEN_SECRET
REFRESH_TOKEN_SECRET

Only variables beginning with:

VITE_

should be exposed to the Vite frontend.

---

🧪 Testing

Customer Test

1. Open "/register"
2. Select I want to Shop
3. Create account
4. Login
5. Open "/products"
6. Search products
7. Filter products
8. Open product details
9. Add product to cart
10. Increase/decrease quantity
11. Remove products
12. Test checkout
13. Try opening "/seller/dashboard"

Expected:

Customer → Seller Dashboard
             ↓
        Access Denied
             ↓
          /products

---

🏪 Seller Test

1. Open "/register"
2. Select I want to Sell
3. Create seller account
4. Login
5. Open "/seller/dashboard"
6. Create a product
7. Edit the product
8. Change stock
9. Delete the product
10. Check the public product catalog

Expected:

Seller
  ↓
Seller Dashboard
  ↓
Create / Read / Update / Delete
  ↓
Own Products Only

---

📌 Important Business Rules

Product Creation

Only sellers can create products.

Customer → ❌
Seller   → ✅

Product Update

Only the seller who owns the product can update it.

Seller A → Product A → ✅

Seller B → Product A → ❌

Product Delete

Only the product owner can delete the product.

Product Owner → ✅
Other Seller  → ❌
Customer      → ❌

Cart

Only customers can use the cart.

Guest     → Login Required
Customer  → ✅
Seller    → Seller Dashboard

---

📈 Future Improvements

Possible future features:

- Order management
- Payment gateway
- Seller order dashboard
- Customer order history
- Product reviews & ratings
- Wishlist
- Coupon system
- Product image upload
- Cloudinary integration
- Email verification
- Forgot password
- OTP authentication
- Admin dashboard
- Seller verification
- Pagination
- Advanced product filtering
- Inventory history
- Sales analytics
- Redis caching
- Rate limiting
- API versioning

---

📄 License

This project is open-source and available under the MIT License.

---

👨‍💻 Author

Rohit Raj

GitHub:

https://github.com/Rohit-raj03

---

⭐ Project Summary

AURA demonstrates a complete MERN e-commerce architecture with:

React
  +
Node.js
  +
Express
  +
MongoDB
  +
JWT Authentication
  +
Role-Based Access Control
  +
Seller Product CRUD
  +
Customer Cart
  +
Inventory Management

The frontend and backend are maintained as separate applications, allowing independent development, testing, deployment, and scaling.