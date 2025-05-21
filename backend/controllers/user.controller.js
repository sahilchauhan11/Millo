import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";
import dotenv from "dotenv";
dotenv.config();

// Helper: create token
const createToken = (payload, expiresIn = process.env.JWT_EXPIRES_IN || '15m') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

export async function register(req, res) {
    let { username, email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required", success: false });
    }

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists", success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = await User.create({ username, email, password: hashedPassword });

        const token = createToken({ userId: user._id, email }, '1d');

        return res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).status(201).json({ message: "User created successfully", user, success: true });

    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export async function login(req, res) {
    let { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = createToken({ userId: user._id, email }, '1d');
            await user.populate('posts');

            return res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge:24*60*60 * 1000 
            }).json({ message: "Login successful", user, success: true });

        } else {
            return res.status(400).json({ message: "Invalid password", success: false });
        }

    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
}

export async function logout(req, res) {
    try {
        return res.cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0
        }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export async function getProfile(req, res) {
    try {
        let user = await User.findById(req.params.id)
            .populate({ path: 'posts', options: { sort: { createdAt: -1 } } })
            .populate('bookmarks');

        return res.status(200).json({ message: "Profile fetched successfully", user, success: true });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}

export async function editProfile(req, res) {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;

        let profilePicture = req.file?.buffer || null;
        let extname = req.file?.originalname?.split(".")[1] || null;
        let cloudResponse;

        if (profilePicture) {
            let fileuri = getDataUri(profilePicture, extname);
            cloudResponse = await cloudinary.uploader.upload(fileuri);
        }

        const user = await User.findById(userId);
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;
        await user.save();

        return res.status(200).json({ message: "Profile updated successfully", user, success: true });
    } catch (err) {
        return res.status(500).json({ message: err.message, success: false });
    }
}

export async function getSuggestions(req, res) {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (suggestedUsers?.length) {
            return res.status(200).json({ users: suggestedUsers, success: true });
        }
        return res.status(400).json({ message: "No users found", success: false });
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

export async function followOrUnfollow(req, res) {
    try {
        const willfollow = req.id;
        const getfollowed = req.params.id;

        if (willfollow === getfollowed) {
            return res.status(400).json({ message: "Invalid action: cannot follow/unfollow self", success: false });
        }

        const getfollowedUser = await User.findById(getfollowed);
        const willfollowUser = await User.findById(willfollow);
        if (!getfollowedUser || !willfollowUser) {
            return res.status(400).json({ message: "User not found", success: false });
        }

        const isFollowing = willfollowUser.following.includes(getfollowed);
        if (isFollowing) {
            getfollowedUser.followers.pull(willfollow);
            willfollowUser.following.pull(getfollowed);
            await willfollowUser.save();
            await getfollowedUser.save();
            return res.status(200).json({ message: "Unfollowed successfully", success: false, unfollow: true });
        } else {
            getfollowedUser.followers.push(willfollow);
            willfollowUser.following.push(getfollowed);
            await willfollowUser.save();
            await getfollowedUser.save();
            return res.status(200).json({ message: "Followed successfully", success: true, id: willfollow, followeId: getfollowed });
        }
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", success: false });
    }
}
