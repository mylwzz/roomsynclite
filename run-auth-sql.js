// run-auth-sql.js
const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

async function runSQL() {
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    console.error('DATABASE_URL not found in .env file');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString
  });

  try {
    // SQL content based on auth-schema.ts
    const sql = `
    -- Create Auth tables based on your exact schema
    CREATE TABLE IF NOT EXISTS "users" (
      "id" text PRIMARY KEY,
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "email_verified" boolean NOT NULL,
      "image" text,
      "created_at" timestamp NOT NULL,
      "updated_at" timestamp NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "sessions" (
      "id" text PRIMARY KEY,
      "expires_at" timestamp NOT NULL,
      "token" text NOT NULL UNIQUE,
      "created_at" timestamp NOT NULL,
      "updated_at" timestamp NOT NULL,
      "ip_address" text,
      "user_agent" text,
      "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS "accounts" (
      "id" text PRIMARY KEY,
      "account_id" text NOT NULL,
      "provider_id" text NOT NULL,
      "user_id" text NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "access_token" text,
      "refresh_token" text,
      "id_token" text,
      "access_token_expires_at" timestamp,
      "refresh_token_expires_at" timestamp,
      "scope" text,
      "password" text,
      "created_at" timestamp NOT NULL,
      "updated_at" timestamp NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "verifications" (
      "id" text PRIMARY KEY,
      "identifier" text NOT NULL,
      "value" text NOT NULL,
      "expires_at" timestamp NOT NULL,
      "created_at" timestamp,
      "updated_at" timestamp
    );
    `;
    
    console.log('Executing SQL...');
    await pool.query(sql);
    console.log('SQL executed successfully!');
  } catch (error) {
    console.error('Error executing SQL:', error);
  } finally {
    await pool.end();
  }
}

runSQL();