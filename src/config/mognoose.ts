import mongoose from 'mongoose';

export function mongooseConfig() {
  mongoose.connect(process.env.MONGO_URI as string);

  mongoose.connection.on('error', (err) => {
    console.error('Mongoose connection error:', err);
    // The app shloudn't be able to run without mongoose successfuly connecting
    process.exit(1);
  });
}
