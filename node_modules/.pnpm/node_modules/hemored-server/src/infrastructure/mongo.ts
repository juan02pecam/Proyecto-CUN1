import mongoose from 'mongoose';
export async function connectMongo(uri=process.env.MONGODB_URI||'mongodb://localhost:27017/hemored'){await mongoose.connect(uri); return mongoose.connection;}
export async function disconnectMongo(){await mongoose.disconnect();}
