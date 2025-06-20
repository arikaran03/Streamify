import pkg from 'stream-chat';
const { StreamChat } = pkg;
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error('STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables');
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error('Error upserting Stream user:', error);
        throw new Error('Failed to upsert Stream user');
    }
};

const generateStreamToken = async (userId) => {
    // ensure the user id is string
    try {
        const userIdStr = userId.toString(); 
        return streamClient.createToken(userIdStr); 
    } catch (error) {
        console.log("error creating stream Token ", error.message); 
        
    }
};

export { upsertStreamUser, generateStreamToken };