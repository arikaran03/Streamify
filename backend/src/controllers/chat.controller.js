import { generateStreamToken} from "../../lib/stream.js"

const getStreamToken = async (req, res) => {
    try {
        const token = generateStreamToken(res.user._Id); 
        res.status(200).json({token}); 

    } catch (error) {
        console.log("error in getStream token", error.message); 
        res.status(500).json({message : "Internal server error "}); 
    }
}

export {getStreamToken};