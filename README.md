# E-commerce API

This is a comprehensive and robust e-commerce API built with NestJS. It provides a wide range of features for managing users, products, orders, and inventory for an online store.

## Features

- **User Authentication**: Secure user registration and login with JWT-based authentication.
- **Role-Based Access Control (RBAC)**: Differentiated access levels for regular users and administrators.
- **Product Management**: Full CRUD (Create, Read, Update, Delete) functionality for products.
- **Product Filtering and Pagination**: Easily query and navigate through large sets of products.
- **Category Management**: Organize products into categories.
- **Inventory Tracking**: Real-time tracking of product stock levels.
- **Order Management**: A complete system for creating and managing customer orders.
- **Validation**: Robust data validation using DTOs to ensure data integrity.
- **Testing**: Comprehensive unit and end-to-end tests to ensure reliability.

## Technologies Used

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/)
- **Validation**: `class-validator` and `class-transformer`
- **Password Hashing**: `bcrypt`
- **Testing**: [Jest](https://jestjs.io/)

## Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Steps

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ecommerce-api.git
    cd ecommerce-api
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following environment variables. You can use the `.env.example` file as a template.

    ```
    PORT=3000

    POSTGRES_HOST=localhost
    POSTGRES_PORT=5432
    POSTGRES_USER=your_postgres_user
    POSTGRES_PASSWORD=your_postgres_password
    POSTGRES_DB=ecommerce

    JWT_SECRET_KEY=your_jwt_secret
    JWT_EXPIRY_TIME=3600s

    JWT_REFRESH_SECRET_KEY=your_jwt_refresh_secret
    JWT_REFRESH_EXPIRE_TIME=7d
    ```

4.  **Run the application:**

    ```bash
    npm run start:dev
    ```

The application will be running on `http://localhost:3000`.

## API Endpoints

### Authentication

| Method | Path           | Description              | Public |
| ------ | -------------- | ------------------------ | ------ |
| `POST` | `/auth/register` | Register a new user      | Yes    |
| `POST` | `/auth/login`    | Log in an existing user  | Yes    |

### Users

| Method | Path      | Description       | Admin Only |
| ------ | --------- | ----------------- | ---------- |
| `GET`  | `/users`  | Get all users     | Yes        |

### Categories

| Method | Path              | Description              | Admin Only |
| ------ | ----------------- | ------------------------ | ---------- |
| `GET`  | `/categories/all` | Get all categories       | No         |
| `GET`  | `/categories/:id` | Get a category by ID     | No         |
| `POST` | `/categories/create` | Create a new category    | Yes        |

### Products

| Method | Path              | Description              | Admin Only |
| ------ | ----------------- | ------------------------ | ---------- |
| `GET`  | `/products`       | Get all products (with filtering and pagination) | No         |
| `GET`  | `/products/:id`   | Get a product by ID      | No         |
| `POST` | `/products/create`| Create a new product     | No         |
| `PATCH`| `/products/update`| Update a product         | Yes        |
| `DELETE`|`/products/delete`| Delete a product         | Yes        |

### Orders

| Method | Path              | Description              | Admin Only |
| ------ | ----------------- | ------------------------ | ---------- |
| `GET`  | `/orders`         | Get all orders           | Yes        |
| `GET`  | `/orders/:id`     | Get an order by ID       | No (User can access their own orders) |
| `POST` | `/orders/create`  | Create a new order       | No         |

## Running Tests

To run the tests, use the following command:

```bash
npm run test
```

## License

This project is UNLICENSED.
