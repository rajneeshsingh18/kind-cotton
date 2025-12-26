import { defineConfig } from '@prisma/config';
import dotenv from 'dotenv';

// This line is the key! It loads your DATABASE_URL from the .env file
dotenv.config();

export default defineConfig({
  schema: './prisma/schema.prisma',
});