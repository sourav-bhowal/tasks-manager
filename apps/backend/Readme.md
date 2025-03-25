# API Documentation

## Overview

This API provides user authentication functionalities, including sign up, sign in, and sign out. It uses JWT for authentication and Prisma for database interactions.

## Base URL

````
http://localhost:8000/api

````

## Endpoints

### 1. Sign Up User

- **Endpoint:** `/user/signup`
- **Method:** `POST`
- **Request Body:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

- **Response:**
  - **201 Created**
    ```json
    {
      "status": 201,
      "data": null,
      "message": "User created successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "status": 400,
      "data": null,
      "message": "Error message detailing the validation error."
    }
    ```
  - **409 Conflict**
    ```json
    {
      "status": 409,
      "data": null,
      "message": "User already exists."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "status": 500,
      "data": null,
      "message": "User could not be created."
    }
    ```

### 2. Sign In User

- **Endpoint:** `/user/signin`
- **Method:** `POST`
- **Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

- **Response:**
  - **200 OK**
    ```json
    {
      "status": 200,
      "data": {
        "user": {
          "id": "string",
          "email": "string",
          "username": "string",
          "accessToken": "string"
        }
      },
      "message": "User signed in successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "status": 400,
      "data": null,
      "message": "Invalid credentials or user does not exist."
    }
    ```

## Error Handling

All responses include a `status`, `data`, and `message` field. The `message` field provides details about the success or failure of the request.

## Authentication

- The API uses JWT for authentication. Upon successful sign in, an `accessToken` is returned and set as a cookie in the response.
- The `accessToken` should be included in the `Authorization` header for protected routes (if applicable).

## Notes

- Ensure that the server is running and accessible at the base URL.
- Use tools like Postman or curl to test the API endpoints.

### Task Endpoints

#### 4. Create Task

- **Endpoint:** `/task/create-task`
- **Method:** `POST`
- **Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "completed": "boolean"
}
```

- **Response:**
  - **201 Created**
    ```json
    {
      "status": 201,
      "data": {
        "id": "string",
        "title": "string",
        "description": "string",
        "userId": "string",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "message": "Task created successfully."
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "status": 400,
      "data": null,
      "message": "Error message detailing the validation error."
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "status": 500,
      "data": null,
      "message": "Task could not be created."
    }
    ```

#### 5. Get All Tasks

- **Endpoint:** `/task/get-all-tasks`
- **Method:** `GET`
- **Response:**
  - **200 OK**
    ```json
    {
      "status": 200,
      "data": [
        {
          "id": "string",
          "title": "string",
          "description": "string",
          "userId": "string",
          "createdAt": "string",
          "updatedAt": "string"
        }
      ],
      "message": "Tasks fetched successfully."
    }
    ```

#### 6. Get Task by ID

- **Endpoint:** `/task/get-task/:id`
- **Method:** `GET`
- **Response:**
  - **200 OK**
    ```json
    {
      "status": 200,
      "data": {
        "id": "string",
        "title": "string",
        "description": "string",
        "userId": "string",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "message": "Task fetched successfully."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "status": 404,
      "data": null,
      "message": "Task not found."
    }
    ```

#### 7. Update Task

- **Endpoint:** `/task/update-task/:id`
- **Method:** `PUT`
- **Request Body:**

```json
{
  "title": "string",
  "description": "string",
  "completed": "boolean"
}
```

- **Response:**
  - **200 OK**
    ```json
    {
      "status": 200,
      "data": {
        "id": "string",
        "title": "string",
        "description": "string",
        "userId": "string",
        "completed": "boolean",
        "createdAt": "string",
        "updatedAt": "string"
      },
      "message": "Task updated successfully."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "status": 404,
      "data": null,
      "message": "Task not found."
    }
    ```

#### 8. Delete Task

- **Endpoint:** `/task/delete-task/:id`
- **Method:** `DELETE`
- **Response:**
  - **200 OK**
    ```json
    {
      "status": 200,
      "data": null,
      "message": "Task deleted successfully."
    }
    ```
  - **404 Not Found**
    ```json
    {
      "status": 404,
      "data": null,
      "message": "Task not found."
    }
    ```
