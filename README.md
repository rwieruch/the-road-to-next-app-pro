# The Road to Next (BASIC)

The finished application that you get after completing the first journey of The Road to Next. Here you can already download it as a starter kit and start your own journey.

## Installation

1. Clone the repository
2. Add your own `.env` file with the following content [0] coming from [Supabase](https://supabase.com/) [1]
3. Run `npm install` to install the dependencies (maybe you have to append the `--force` flag)
4. Run the database migration `npx prisma db push` to create the DB tables

[0]

```sh
// .env
DATABASE_URL="postgres://postgres.[project]:[password]@aws-0-[aws-region].pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgres://postgres.[project]:[password]@aws-0-[aws-region].pooler.supabase.com:5432/postgres"
```

[1]

![Screenshot 2024-11-20 at 14 48 38](https://github.com/user-attachments/assets/3be82183-fb18-4845-a044-82c2c02787d8)

## Usage

```sh
npm run prisma-seed
```

```sh
npm run dev
```

```sh
npx prisma studio
```
