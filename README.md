# NoteAPI

NoteAPI is a simple backend API for a note taking application. It is built using Node.js, Express.js, and MySQL.


## Features

- Retrieve all notes
- Retrieve a single note by ID [Under development]
- Create a new note with automatic timestamp 
- Update existing note [Under development]
- Delete a note by ID [Under development]


## Installation and Setup

### Prerequisites:
Before you begin, ensure you have the following installed on your system:
- Node.js (v20.12.2) or above
- MySQL
- Git
- Postman (optional)

### Steps:

Step 1: Clone the repository
```bash
git clone git@github.com:LAUT-MERAH/NoteAPI.git
```

Step 2: Go to the project directory
```bash
cd NoteAPI
```

Step 3: Install dependencies
```bash
npm install
```

Step 4: For development, install nodemon
```bash
npm install -g nodemon
```

Step 5: Copy the `.env.example` file to `.env` and update the values
```bash
cp .env.example .env // Linux
copy .env.example .env // Windows
```

Step 6:  Set up the Environtment Variables by copying the content of `.env.example` to `.env` and update the values
```bash
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

Step 7: Set Up the Database by running following SQL commands in your MySQL instance to create the required database and table:
```bash
CREATE DATABASE notes_db;
USE notes_db;

CREATE TABLE notes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title TEXT NOT NULL,
    datetime DATETIME NOT NULL,
    note LONGTEXT NOT NULL
);
```

Step 8: Start the server
```bash
npm start
```

Step 9 (Optional): To run the server in development mode
```bash
npm run dev
```

Step 10: Test the API, The server will run on http://localhost:3000 by default. You can test the API using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).
```bash
curl -X GET http://localhost:3000/api/v1/notes
```

## License
This project is open-source and available under the [MIT License](LICENSE)