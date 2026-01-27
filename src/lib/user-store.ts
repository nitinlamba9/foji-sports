import fs from 'fs';
import path from 'path';

// Simple file-based user store for demo
// In production, this would be a real database

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // hashed
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(USERS_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read users from file
const readUsers = (): User[] => {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    // Create initial users if file doesn't exist
    const initialUsers: User[] = [
      {
        id: 'admin-nitin-fixed',
        name: 'Nitin',
        email: 'nitinlamba@gmail.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
    writeUsers(initialUsers);
    return initialUsers;
  }
  
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Write users to file
const writeUsers = (users: User[]): void => {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

// Export for debugging (development only)
export const debugUsers = () => readUsers();

// Export writeUsers for external use
export { writeUsers };

export class UserStore {
  static async findByEmail(email: string): Promise<User | null> {
    const users = readUsers();
    console.log('UserStore: Looking for email:', email, 'in', users.length, 'users');
    const found = users.find(user => user.email === email) || null;
    console.log('UserStore: Found user:', found ? { id: found.id, email: found.email, role: found.role } : 'null');
    
    // Auto-promote nitinlamba@gmail.com to admin
    if (found && found.email === 'nitinlamba@gmail.com' && found.role === 'user') {
      found.role = 'admin';
      writeUsers(users);
      console.log('UserStore: Auto-promoted nitinlamba@gmail.com to admin');
    }
    
    return found;
  }

  static async findById(id: string): Promise<User | null> {
    const users = readUsers();
    return users.find(user => user.id === id) || null;
  }

  static async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const users = readUsers();
    const user: User = {
      ...userData,
      id: 'user-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    users.push(user);
    writeUsers(users);
    console.log('UserStore: User added. Total users now:', users.length);
    console.log('UserStore: Current users:', users.map(u => ({ id: u.id, email: u.email })));
    return user;
  }

  static async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    // Simple password check (in production, use bcrypt)
    if (user.password !== password) return null;
    
    return user;
  }
}
