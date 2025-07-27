import { connect } from 'mongoose';
import { config } from 'dotenv';

config();

const connectDb = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI); // Debug log
    const conn = await connect(process.env.MONGO_URI); // Clean connect
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to database:");
    console.error(error.message);
    process.exit(1); // Exit on failure
  }
};

export default connectDb;
