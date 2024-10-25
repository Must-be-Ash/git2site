import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseConnection: CachedConnection;
}

if (!global.mongooseConnection) {
  global.mongooseConnection = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  if (global.mongooseConnection.conn) {
    return global.mongooseConnection.conn;
  }

  if (!global.mongooseConnection.promise) {
    const opts = {
      bufferCommands: false,
    };

    global.mongooseConnection.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    global.mongooseConnection.conn = await global.mongooseConnection.promise;
  } catch (e) {
    global.mongooseConnection.promise = null;
    throw e;
  }

  return global.mongooseConnection.conn;
}
