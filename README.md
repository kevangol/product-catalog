# Product Catalog API

A modern, secure product catalog management system built with NestJS, TypeScript, and PostgreSQL. This RESTful API provides comprehensive product management capabilities with JWT-based authentication using OTP (One-Time Password) verification.

## Features

- **Product Management**: Create, read, and delete products with validation
- **Secure Authentication**: OTP-based authentication system with JWT tokens
- **Database Integration**: PostgreSQL database with TypeORM for data persistence
- **Input Validation**: Comprehensive request validation using class-validator
- **CORS Support**: Configured for cross-origin requests
- **Cookie-based Auth**: Secure HTTP-only cookies for token storage
- **Type Safety**: Full TypeScript implementation with strict typing

## Tech Stack

- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 15
- **ORM**: TypeORM 0.3.x
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Linting**: ESLint with Prettier

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher)
- **PostgreSQL** (if running without Docker)

## Installation

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=8080

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=Admin@123
DB_NAME=product_catalog

# JWT Secrets (Change these in production!)
JWT_ACCESS_SECRET=dev_access_secret_replace_me
JWT_REFRESH_SECRET=dev_refresh_secret_replace_me
JWT_ACCESS_EXP=15m
JWT_REFRESH_EXP=7d
```

### 4. Database Setup

#### Option: Local PostgreSQL Installation

1. Install PostgreSQL locally
2. Create a database named `product_catalog`
3. Update the database credentials in `src/app.module.ts` or use environment variables

## Running the Application

### Development Mode

```bash
# Start in development mode with hot reload
npm run start:dev

# Start in debug mode
npm run start:debug
```

### Production Mode

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

The API will be available at `http://localhost:8080` (or the port specified in your `.env` file).

## API Documentation

### Authentication Endpoints

#### Request OTP

```http
POST /auth/request-otp
Content-Type: application/json

{
  "mobile": "9876543210"
}
```

**Response:**

```json
{
  "message": "OTP sent successfully"
}
```

#### Verify OTP

```http
POST /auth/verify-otp
Content-Type: application/json

{
  "mobile": "9876543210",
  "otp": "1234"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "mobile": "9876543210"
  },
  "message": "Logged in"
}
```

_Note: In development, the OTP is hardcoded as "1234"_

#### Refresh Token

```http
POST /auth/refresh
```

#### Logout

```http
POST /auth/logout
```

#### Check Authentication Status

```http
GET /auth/me
Authorization: Bearer <token> (or via cookie)
```

### Product Endpoints

All product endpoints require authentication.

#### Get All Products

```http
GET /products
Authorization: Bearer <token> (or via cookie)
```

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Product Name",
    "price": 99.99,
    "description": "Product description"
  }
]
```

#### Create Product

```http
POST /products
Content-Type: application/json
Authorization: Bearer <token> (or via cookie)

{
  "name": "New Product",
  "price": 149.99,
  "description": "Optional description"
}
```

#### Delete Product

```http
DELETE /products/:id
Authorization: Bearer <token> (or via cookie)
```

### Error Responses

The API returns standard HTTP status codes and error messages:

```json
{
  "statusCode": 400,
  "message": ["Validation error messages"],
  "error": "Bad Request"
}
```

## Configuration

### Environment Variables

The application supports the following environment variables:

| Variable             | Description              | Default                         | Required |
| -------------------- | ------------------------ | ------------------------------- | -------- |
| `PORT`               | Server port              | `3000`                          | No       |
| `DB_HOST`            | Database host            | `localhost`                     | No       |
| `DB_PORT`            | Database port            | `5432`                          | No       |
| `DB_USERNAME`        | Database username        | `postgres`                      | No       |
| `DB_PASSWORD`        | Database password        | `Admin@123`                     | No       |
| `DB_NAME`            | Database name            | `product_catalog`               | No       |
| `JWT_ACCESS_SECRET`  | JWT access token secret  | `dev_access_secret_replace_me`  | Yes      |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | `dev_refresh_secret_replace_me` | Yes      |

### Database Configuration

The application uses TypeORM with PostgreSQL. Database configuration is located in `src/app.module.ts`:

- **Auto-load entities**: Enabled for automatic entity discovery
- **Synchronize**: Enabled in development (disable in production)
- **Connection pooling**: Uses default PostgreSQL driver settings

### CORS Configuration

CORS is configured to allow requests from `http://localhost:3000` with credentials enabled. Modify in `src/main.ts` for different origins.

## Development Setup

### For Contributors

1. **Fork and Clone**

   ```bash
   git clone <your-fork-url>
   cd product-catalog
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Run in Development Mode**

   ```bash
   npm run start:dev
   ```

4. **Code Style**

   ```bash
   # Format code
   npm run format

   # Lint code
   npm run lint
   ```

### Development Guidelines

- Follow TypeScript strict mode guidelines
- Use ESLint and Prettier for code formatting
- Write unit tests for new features
- Use conventional commit messages
- Ensure all tests pass before submitting PRs

## Testing

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode for development
npm run test:watch

# End-to-end tests
npm run test:e2e

# Test coverage report
npm run test:cov

# Debug tests
npm run test:debug
```

### Test Structure

- **Unit Tests**: Located alongside source files with `.spec.ts` extension
- **E2E Tests**: Located in the `test/` directory
- **Test Configuration**: Jest configuration in `package.json`
- **Coverage**: Reports generated in `coverage/` directory

### Current Test Status

- **E2E Tests**: Basic application bootstrap test available
- **Unit Tests**: No unit tests currently implemented
- **Coverage**: Run `npm run test:cov` to generate coverage reports

_Note: This project would benefit from additional unit tests for services and controllers._

## Project Structure

```
product-catalog/
├── src/                          # Source code
│   ├── auth/                     # Authentication module
│   │   ├── dto/                  # Data Transfer Objects
│   │   │   ├── request-otp.dto.ts
│   │   │   └── verify-otp.dto.ts
│   │   ├── auth.controller.ts    # Auth endpoints
│   │   ├── auth.module.ts        # Auth module configuration
│   │   ├── auth.service.ts       # Auth business logic
│   │   ├── cookie-extractor.ts   # JWT cookie extraction utility
│   │   ├── jwt-auth.guard.ts     # JWT authentication guard
│   │   └── jwt.strategy.ts       # JWT strategy configuration
│   ├── products/                 # Products module
│   │   ├── dto/                  # Data Transfer Objects
│   │   │   └── create-product.dto.ts
│   │   ├── products.controller.ts # Product endpoints
│   │   ├── products.entity.ts    # Product database entity
│   │   ├── products.module.ts    # Products module configuration
│   │   └── products.service.ts   # Product business logic
│   ├── users/                    # Users module
│   │   ├── user.entity.ts        # User database entity
│   │   ├── users.module.ts       # Users module configuration
│   │   └── users.service.ts      # User business logic
│   ├── app.module.ts             # Root application module
│   └── main.ts                   # Application entry point
├── test/                         # End-to-end tests
│   ├── app.e2e-spec.ts          # E2E test suite
│   └── jest-e2e.json            # E2E Jest configuration
├── dist/                         # Compiled JavaScript output
├── coverage/                     # Test coverage reports
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── tsconfig.build.json           # Build-specific TypeScript config
├── nest-cli.json                 # NestJS CLI configuration
├── eslint.config.mjs             # ESLint configuration
└── .env                          # Environment variables
```

### Key Directories and Files

- **`src/auth/`**: Complete authentication system with OTP verification
- **`src/products/`**: Product management with CRUD operations
- **`src/users/`**: User entity and service for authentication
- **`package.json`**: All dependencies and npm scripts
- **`.env`**: Environment configuration (create from template)

## Contributing

We welcome contributions to the Product Catalog API! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes following the coding standards
4. Write or update tests as needed
5. Ensure all tests pass: `npm run test`
6. Commit your changes: `git commit -m "feat: add your feature"`
7. Push to your branch: `git push origin feature/your-feature-name`
8. Submit a pull request

### Coding Standards

- Use TypeScript strict mode
- Follow ESLint and Prettier configurations
- Write meaningful commit messages (conventional commits)
- Add JSDoc comments for public APIs
- Ensure 100% test coverage for new features
- Update documentation for API changes

### Pull Request Process

1. Ensure your PR description clearly describes the problem and solution
2. Include the relevant issue number if applicable
3. Make sure all status checks pass
4. Request review from maintainers
5. Address any feedback promptly

## License

This project is licensed under the **UNLICENSED** license - see the [package.json](package.json) file for details.

_Note: Consider adding an appropriate open-source license (MIT, Apache 2.0, etc.) for public projects._

## Support and Contact

### Getting Help

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Use GitHub Discussions for questions and community support

### Resources

- [NestJS Documentation](https://docs.nestjs.com) - Official NestJS documentation
- [TypeORM Documentation](https://typeorm.io) - Database ORM documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Database documentation
- [JWT.io](https://jwt.io) - Learn more about JSON Web Tokens

### Maintainers

This project is currently maintained by the development team. For urgent issues or security concerns, please create a GitHub issue with appropriate labels.

---

**Built with ❤️ using NestJS, TypeScript, and PostgreSQL**
