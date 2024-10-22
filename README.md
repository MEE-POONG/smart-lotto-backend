# Smart-Lotto-Backend

   Smart-Lotto-Backend is a scalable backend system for managing lottery operations, including customer management, order processing, and real-time updates. This backend is built with modern technologies to ensure efficiency and security in handling lottery transactions.

Key Features

 - Customer Management: Store and manage customer data, including order history.
 - Order Processing: Create, update, and manage lottery ticket orders with various lottery ticket types.
 - Real-time Notifications: Receive real-time updates on order statuses and lottery results via WebSockets.
 - Secure Authentication: JWT-based authentication ensures secure access and data handling.
 - Database Integration: Supports relational (PostgreSQL) databases.

Technology Stack

 - Backend Framework: NestJS
 - Database: PostgreSQL
 - ORM: Prisma for data management
 - Authentication: JWT for secure access
 - Real-time Communication: WebSockets for real-time updates
 - Deployment: Docker for containerization and CI/CD pipelines

Getting Started

Prerequisites

 • Node.js
 • npm or yarn
 • Docker (optional for deployment)

Installation

 1. Clone the repository:

        git clone https://github.com/MEE-POONG/smart-lotto-backend.git

 
 2. Navigate to the project directory:

        cd smart-lotto-backend


 3. Install dependencies:

        npm install


 4. Create a .env file and configure the necessary environment variables:

        DATABASE_URL=<your-database-url>
        JWT_SECRET=<your-jwt-secret>


 5. Run the development server:

        npm run dev



Running in Production

 1. Build the project:

        npm run build


 2. Start the server:

        npm start



API Documentation

/getCustomerById

 • Method: POST
 • Description: Retrieve customer information by customer ID.
 • Body:

    {
      "customerId": "CM000001"
    }


 • Response:

    {
      "customer_id": "CM000001",
      "customer_name": "John Doe",
      "orders": [...]
    }



/createOrder

 • Method: POST
 • Description: Create a new lottery order for a customer.
 • Body:

    {
      "customerId": "CM000001",
      "items": [
        { "number_value": "55", "item_type": "2 ตัวบน", "price": 97.00 }
      ]
    }


 • Response:

    {
      "orderId": "OR000012",
      "total_price": 97.00
    }



License

This project is licensed under the MIT License.
