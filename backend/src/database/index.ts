import Database from 'better-sqlite3';
import { config } from '../config';
import { Message } from '../types';

const db = new Database(config.database.path);

export const initDatabase = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      booking_id TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  console.log('Database initialized');
};

// Message operations
export const createMessage = (bookingId: string, customerEmail: string, message: string): Message => {
  const stmt = db.prepare(`
    INSERT INTO messages (booking_id, customer_email, message)
    VALUES (?, ?, ?)
  `);
  
  const result = stmt.run(bookingId, customerEmail, message);
  
  return {
    id: result.lastInsertRowid as number,
    bookingId,
    customerEmail,
    message,
    createdAt: new Date().toISOString(),
  };
};

export const getMessagesByBookingId = (bookingId: string): Message[] => {
  const stmt = db.prepare(`
    SELECT id, booking_id as bookingId, customer_email as customerEmail, message, created_at as createdAt
    FROM messages
    WHERE booking_id = ?
    ORDER BY created_at DESC
  `);
  
  return stmt.all(bookingId) as Message[];
};

export const getMessagesByCustomerEmail = (email: string): Message[] => {
  const stmt = db.prepare(`
    SELECT id, booking_id as bookingId, customer_email as customerEmail, 
           message, created_at as createdAt
    FROM messages
    WHERE customer_email = ?
    ORDER BY created_at DESC
  `);
  
  return stmt.all(email) as Message[];
};

export default db;