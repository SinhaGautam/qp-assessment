# qp-assessment
Question Pro Assessment for grocery booking API

A Node.js/TypeScript REST API for grocery inventory management and ordering system with PostgreSQL.

## Features
- User authentication (JWT)
- Role-based access control (Admin/User)
- Grocery inventory management
- Order processing system
- PostgreSQL database
- Docker containerization

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT
- **Containerization**: Docker

## Prerequisites
- Node.js 18+
- PostgreSQL 13+
- Docker (optional)

## Setup

### 1. Database Setup

# Create database and user
CREATE DATABASE qpdb_v1;
CREATE USER qpadmin WITH ENCRYPTED PASSWORD 'qpdb@1234';
GRANT ALL PRIVILEGES ON DATABASE qpdb_v1 TO qpadmin;
