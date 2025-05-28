import User from "../models/User.js";

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


export { getRecommendedUsers, getMyFriends };
