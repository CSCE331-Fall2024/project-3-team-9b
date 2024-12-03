# Panda Express POS System

## Overview

This project is a Point of Sale (POS) system developed for a Panda Express franchise. It includes a **Cashier View**, **Manager View**, and **Customer View**, offering a comprehensive solution for managing orders, inventory, sales, and employee data. The system is designed to improve operational efficiency and customer experience with an intuitive user interface and dynamic data-fetching capabilities.

## Features

### **Cashier View**
- **Order Management**:
  - Handles real-time order creation with support for sides, entrees, drinks, and appetizers.
  - Allows customers to choose meal sizes and customize their orders.
  - Displays a shopping cart that dynamically updates the total price and items.
- **Responsive UI**:
  - User-friendly interface with visual feedback, such as hover effects and item availability.

### **Customer View**
- **Menu Browsing**:
  - Displays all available sides, entrees, drinks, and appetizers with images and details.
- **Shopping Cart**:
  - Tracks customer selections and calculates prices dynamically.
  - Provides a seamless navigation flow for placing orders.

### **Manager View**
- **Sales Reports**:
  - **X Report**: Hourly sales metrics and employee productivity.
  - **Z Report**: Daily sales totals and employee contributions.
  - **Realistic Sales History**: Hourly sales trends with total revenue.
  - **Weekly Sales History**: Aggregated weekly sales data.
- **Inventory Management**:
  - Tracks ingredient quantities and usage for menu items.
- **Employee Management**:
  - Displays employee details such as name, position, and salary.
- **Peak Sales Insights**:
  - Identifies the highest-grossing sales day with total revenue.
- **Price Management**:
  - Allows managers to update item prices dynamically.

### **Menu Board**
- **Static Menu Display**:
  - Showcases all available items with images and categories (e.g., sides, entrees, appetizers).
  - Provides a clear and aesthetic presentation of the Panda Express menu.

## Technologies Used

### **Frontend**
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Components**: React-based reusable components for modularity.
- **State Management**: Context API for sharing shopping data between views.

### **Backend**
- **API Integration**:
  - Fetches data dynamically for views like inventory, sales, and employee reports.
  - Updates item prices and inventory levels in real-time.

### **Database**
- **PostgreSQL**:
  - Manages employee, inventory, sales, and menu data with optimized queries.

### **Environment**
- **Deployment**:
  - Fully responsive design for optimal user experience across devices.

## Highlights

1. **Dynamic and Interactive**:
   - Real-time updates for orders, inventory, and reports.
   - Fully responsive UI designed for both desktop and mobile devices.

2. **Efficient Data Management**:
   - Uses optimized API endpoints to fetch and update data seamlessly.

3. **Customizable Views**:
   - Modular design allows easy integration of new features and functionality.

## Getting Started

### Prerequisites
- Node.js
- PostgreSQL database with schema and data matching the API requirements.
- `.env` file with the following:
  - `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`

### Installation
1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Start the development server:
   ```bash
   npm run dev
4. Access the app in your browser at `http://localhost:3000`.
