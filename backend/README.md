# Expense Tracker

## Project Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-repo/expense-tracker.git
   cd expense-tracker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

   **Set up database:**

   ```bash
   mysql -u root -p < sqlscript.sql
   ```

3. **Create a `.env` file:**

   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=password
   MYSQL_DATABASE=expense_tracker
   ACCESS_TOKEN_SECRET=your_jwt_secret
   ```

4. **Run the server:**

   ```bash
   npm start
   ```

### Dependencies Used:

- express
- body-parser
- bcryptjs
- jsonwebtoken
- mysql2
- dotenv

## Functionalities

- **Register:** `POST /api/users/register`
- **Login:** `POST /api/users/login`
- **Add Expense:** `POST /api/expenses`
- **View Expenses:** `GET /api/expenses`
- **Edit Expense:** `PUT /api/expenses/:id`
- **Delete Expense:** `DELETE /api/expenses/:id`

## Example Requests

### Register

```bash
curl -X POST http://localhost:3000/api/register \
-H "Content-Type: application/json" \
-d '{"username": "user", "email": "user@example.com", "password": "password"}'
```

### Login

```bash
curl -X POST http://localhost:3000/api/login \
-H "Content-Type: application/json" \
-d '{"email": "user@example.com", "password": "password"}'
```

### Add Expense

```bash
curl -X POST http://localhost:3000/api/expenses \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{"amount": 50.00, "date": "2024-07-20", "category": "Food"}'
```

### View Expenses

```bash
curl -X GET http://localhost:3000/api/expenses \
-H "Authorization: Bearer <token>"
```

### Edit Expense

```bash
curl -X PUT http://localhost:3000/api/expenses/<id> \
-H "Authorization: Bearer <token>" \
-H "Content-Type: application/json" \
-d '{"amount": 60.00, "date": "2024-07-21", "category": "Entertainment"}'
```

### Delete Expense

```bash
curl -X DELETE http://localhost:3000/api/expenses/<id> \
-H "Authorization: Bearer <token>"
```

### Database Server Comparison

![alt text](databasecomparisonTable.png)
```

Feel free to replace `databasecomparisonTable.png` with the correct path to your image if needed.