import React, { useState, useRef } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2 } from "lucide-react";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from './ui/button';
import { setUser } from '@/redux/authSlice';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [input, setInput] = useState({
    bio: user?.bio || '',
    gender: user?.gender || 'male',
    profilePicture: user?.profilePicture || null,
  });

  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const filechange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput((prev) => ({ ...prev, profilePicture: file }));
    }
  };

  const selectchange = (e) => {
    setInput((prev) => ({ ...prev, gender: e.target.value }));
  };

  const biochange = (e) => {
    setInput((prev) => ({ ...prev, bio: e.target.value }));
  };

  const editProfileHandler = async () => {
    const formData = new FormData();

    if (input.bio) formData.append("bio", input.bio);
    if (input.gender) formData.append("gender", input.gender);
    if (input.profilePicture) formData.append("profilepicture", input.profilePicture);

    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/profile/edit`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        const updatedUser = {
          ...user,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
          profilePicture: res.data.user?.profilePicture,
        };
        toast.success(res.data.message);
        dispatch(setUser(updatedUser));
        navigate(`/profile/${user?._id}`);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full items-center p-4">
      <section className="w-full flex flex-col gap-4">
        <h1 className="text-xl font-bold my-2">Edit Profile</h1>

        <div className="h-[20%] w-[80%] flex justify-center items-center gap-4 bg-gray-200 rounded-xl p-4 border-2 border-gray-300">
          <Avatar className="h-[30px] w-[30px] rounded-full flex items-center justify-center">
            <AvatarImage
              className="rounded-full object-cover"
              src={typeof input.profilePicture === 'string' ? input.profilePicture : ""}
              alt="Profile Picture"
            />
            <AvatarFallback className="h-full w-full flex items-center justify-center text-2xl">
              <span className="material-symbols-outlined">person</span>
            </AvatarFallback>
          </Avatar>

          <div className="flex justify-start items-center gap-3 w-full">
            <div className="text-2xl font-bold">{user?.username}</div>
          </div>

          <input
            ref={inputRef}
            name="profilepicture"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={filechange}
          />

          <div>
            <Button
              className="bg-blue-500 rounded-full px-4 py-2 w-fit"
              onClick={() => inputRef.current.click()}
            >
              Change Photo
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-bold">Bio</h1>
          <textarea
            placeholder="bio here..."
            name="bio"
            className="w-[80%] p-2 resize-none rounded-xl focus:outline-none"
            value={input.bio}
            onChange={biochange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xl font-bold" htmlFor="gender">Gender</label>
          <select
            name="gender"
            id="gender"
            className="w-[80%] p-2 resize-none rounded-xl focus:outline-none"
            value={input.gender}
            onChange={selectchange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="flex justify-start items-center my-8 gap-4">
          {loading && <Loader2 className="animate-spin" />}
          <Button
            className="bg-blue-500 rounded-xl px-4 py-2 w-fit"
            onClick={editProfileHandler}
            disabled={loading}
          >
            Edit Profile
          </Button>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
