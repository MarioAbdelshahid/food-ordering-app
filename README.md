# Foodly - Online Food Ordering Web Application

Foodly is a MERN stack prototype for an online food ordering platform. It allows users to browse restaurants, view menus, add items to cart, place orders, choose payment methods, track order status, and switch between English and Arabic. It also includes a restaurant-specific admin dashboard for managing products and monitoring orders.

## Features

### User Features

* User registration and login with JWT authentication
* Browse available restaurants
* View restaurant-specific menus
* Display products with images, prices, categories, and descriptions
* Arabic and English language support
* RTL layout support for Arabic
* Add items to cart
* Prevent mixing products from different restaurants in one cart
* Cart persistence per user after refresh and logout/login
* Place orders with delivery address
* Choose payment method:

  * Online Payment
  * Cash on Delivery
* Track order status and payment status from the user dashboard

### Admin Features

* Restaurant-specific admin dashboard
* Each admin manages only their assigned restaurant
* View only orders related to the admin’s restaurant
* View only products related to the admin’s restaurant
* Add new products
* Mark products as available/unavailable
* Delete products
* Update order status
* Automatically mark Cash on Delivery orders as paid when delivered
* Prevent updates after an order is delivered or cancelled

## Tech Stack

### Frontend

* React
* Vite
* React Router
* Axios
* Context API
* CSS Modules

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs

## Project Structure

```txt
food-ordering-app/
  client/
    src/
      api/
      components/
      context/
      pages/
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    seed/
```

## Demo Accounts

After running the seed script, you can use the following accounts.

### Normal User

```txt
Email: mario@test.com
Password: 123456
```

### Burger House Admin

```txt
Email: burger@foodly.com
Password: admin123
```

### Italian Corner Admin

```txt
Email: italian@foodly.com
Password: admin123
```

## Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_secret_here
```

Create a `.env` file inside the `client` folder:

```env
VITE_API_URL=http://localhost:4000/api
```

Example files are included:

```txt
server/.env.example
client/.env.example
```

## Installation and Running Locally

### 1. Clone the repository

```bash
git clone REPOSITORY_URL_HERE
cd food-ordering-app
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Install frontend dependencies

```bash
cd ../client
npm install
```

### 4. Seed the database

From the `server` folder:

```bash
npm run seed
```

This creates sample restaurants, products, a normal user, and restaurant admin accounts.

### 5. Run the backend

From the `server` folder:

```bash
npm run dev
```

Backend runs on:

```txt
http://localhost:4000
```

### 6. Run the frontend

From the `client` folder:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## API Overview

### Authentication

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Restaurants

```txt
GET /api/restaurants
GET /api/restaurants/:id
```

### Products

```txt
GET    /api/products
GET    /api/products?restaurant=RESTAURANT_ID
GET    /api/products/admin/my-products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

### Orders

```txt
POST  /api/orders
GET   /api/orders/my-orders
GET   /api/orders
PATCH /api/orders/:id/status
```

## Notes

* Online payment is simulated for prototype purposes.
* Cash on Delivery orders start with a pending payment status.
* When a Cash on Delivery order is marked as delivered, its payment status automatically becomes paid.
* Delivered and cancelled orders are considered final and cannot be updated again.
* Restaurant admin accounts are pre-seeded for the prototype.
* In a production version, restaurant/admin creation would be handled by a platform super-admin.
* Product images are stored as external image URLs for simplicity.

## Main Evaluation Requirements Covered

* Complete menu with images and prices
* Add items to cart and place orders
* User authentication/login
* Online payment or Cash on Delivery option
* Order status tracking
* Admin dashboard for managing products and monitoring orders
* Arabic and English multi-language support
