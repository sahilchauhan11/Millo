import React, { useState, useRef } from 'react';
import { Textarea } from "@/components/ui/textarea";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPost } from '@/redux/postSlice.js';
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fileDataUri } from '@/lib/utils.js';

const Create = ({ open, setOpen }) => {
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [previewfile, setPreviewfile] = useState(null);
  const [load, setLoad] = useState(false);

  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);

  const fileRef = useRef();

  const createPost = async () => {
    if (load) return;

    try {
      setLoad(true);
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("image", file);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/post/addpost`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        dispatch(setPost([response.data.post, ...posts]));
        toast.success(response.data.message);
        setOpen(false);
        setCaption("");
        setFile(null);
        setPreviewfile(null);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create post");
    } finally {
      setLoad(false);
    }
  };

  const handleCaption = (e) => {
    setCaption(e.target.value);
  };

  const handleFile = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const datauri = await fileDataUri(selectedFile);
    if (datauri) setPreviewfile(datauri);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader>Create Post</DialogHeader>
        <div className="flex items-center gap-2 mb-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1>username</h1>
            <p>bio....</p>
          </div>
        </div>
        <Textarea
          placeholder="Type your message here."
          value={caption}
          onChange={handleCaption}
        />
        <div className="flex items-center justify-center my-4">
          {previewfile && (
            <img src={previewfile} alt="preview" className="w-[50%] object-cover" />
          )}
          <Input
            type="file"
            className="hidden"
            ref={fileRef}
            onChange={handleFile}
          />
        </div>
        <Button
          className="w-fit mx-auto hover:bg-gray-[#0095f6] mb-2"
          onClick={() => fileRef.current.click()}
        >
          Select from computer
        </Button>
        {previewfile && (
          <Button
            className="bg-blue-700 w-fit rounded-lg mx-auto hover:bg-gray-[#0095f6]"
            onClick={createPost}
            disabled={load}
          >
            {load ? 'Creating...' : 'Create'}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Create;
