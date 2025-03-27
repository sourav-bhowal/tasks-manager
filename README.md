# Run the app

## Put DATABASE_URL in .env file

```
cd packages/database
echo "DATABASE_URL=postgres://user:password@localhost:5432/dbname" > .env
```

## Install the dependencies

```
cd ../..
bun install
```

## Run the backend

```
bun run start:backend
```

## Run the frontend

```
bun run dev
```
![Screenshot](screenshots/screen1.png)
![Screenshot](screenshots/screen2.png)
