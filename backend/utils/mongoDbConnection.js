import mongoose from 'mongoose';    


const mongoDbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log('MongoDB connection failed:', error.message);
    }
};

export default mongoDbConnection;

