import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js"; // Import the FriendRequest model

const getRecommendedUsers = async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the request object
        const user = req.user; // Get the user object from the request
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const recommendedUsers = await User.find({
            $and: [
                {_id: { $ne : userId}},
                {isOnboarded: true}, // Only include users who have completed onboarding
                {id: { $nin: user.friends }} // Exclude users who are already friends
            ]
        }); 
        res.status(200).json(recommendedUsers); 
    } catch (error) {
        console.error("Error fetching recommended users:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}; 

const getMyFriends = async(req, res) => {
    try {
        const user = await User.findById(req.user._id).select("friends")
            .populate("friends", "fullName profilePic nativeLanguage LearningLanguage");
        
        return res.status(404).json(user.friends);  
    } catch (error) {
        console.error("Error fetching friends:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}; 

const sendFriendRequest = async (req, res) => {
    try {
        const MyId = req.user._id; // Get the user ID from the request object
        const { id : recipientId } = req.params; // Get the recipient ID from the request parameters
        if (!MyId || !recipientId) {
            return res.status(400).json({ message: "User ID and recipient ID are required" });
        }
        if( MyId === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }   
        // Check if a friend request already exists
        if(recipient.friends.includes(MyId)){
            return res.status(400).json({message : "You are already friends with this user"});
        }
        // check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: MyId, recipient: recipientId },
                { sender: recipientId, recipient: MyId }
            ]
        });
        if (existingRequest) {
            return res.status(400).json({ message: "Friend request already exists" });
        }
        // Create a new friend request
        const newFriendRequest = await FriendRequest.create({
            sender: MyId,
            recipient: recipientId,
            status: "pending"
        });
        // Add the new friend request to the recipient's friend requests
        res.status(201).json({newFriendRequest}); 


    } catch (error) {
        console.error("Error sending friend request:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const {id : requestId } = req.params; 
        const friendRequest = await FriendRequest.findById(requestId); 
        if(!friendRequest){
            return res.status(404).json({message : "Friend request not found"}); 
        }
        // Check if the user is the recipient of the friend request
        if (friendRequest.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }
        friendRequest.status = "accepted"; // Update the status of the friend request
        await friendRequest.save(); // Save the updated friend request

        // add each user to the other's friends list
        // $addToSet ensures that the user is added only if they are not already in the array

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet : { friends: friendRequest.recipient}
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet : { friends: friendRequest.sender}
        });
        res.status(200).json({ message: "Friend request accepted successfully" });

    } catch (error) {
        console.error("Error accepting friend request:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getFriendRequests = async (req, res) => {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient : req.user._id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage LearningLanguage");
        const acceptFriendRequest = await FriendRequest.find({
            recipient: req.user._id,
            status: "accepted"
        }).populate("sender", "fullName profilePic");

        res.status(200).json({ incomingRequests, acceptFriendRequest });

    } catch (error) {
        console.error("Error fetching friend requests:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const outGoingFriendRequest = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            recipient : req.user._id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage LearningLanguage");
        res.status(200).json({outgoingRequests}); 

    } catch (error) {
        console.log("Error in getOutgoingFriend Request controller", error.message); 
        res.status(500).json({message : "Internal server error "}); 
    }
}; 

export { getRecommendedUsers, getMyFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, outGoingFriendRequest };