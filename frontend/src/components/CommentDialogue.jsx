import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { useDispatch, useSelector } from 'react-redux';
import Comment from './Comment.jsx';
import axios from 'axios';
import { toast } from 'sonner';
import { setPost } from '@/redux/postSlice.js';

const CommentDialogue = ({ open, onOpenChange }) => {
  const [text, setText] = useState('');
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() ? inputText : '');
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/post/${selectedPost._id}/comment`,
        { comment: text },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (res.data.success) {
        const updatedPostComment = [...comment, res.data.comment];
        setComment(updatedPostComment);

        const updatedPosts = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedPostComment } : p
        );

        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
        setText('');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to send comment');
    }
  };

  return (
    <Dialog open={open} >
      <DialogContent onInteractOutside={() => onOpenChange(false)} className="max-w-5xl h-2/3 bg-amber-100  p-0 flex flex-col">
        <div className="flex flex-1 h-full">
          <div className="w-1/2 h-full flex justify-center items-center">
            <img
              src={selectedPost?.image}
              alt="post_img"
              className="w-full h-full object-contain rounded-l-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col text-white justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>{selectedPost?.author?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">{selectedPost?.author?.username}</Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">Unfollow</div>
                  <div className="cursor-pointer w-full">Add to favorites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.map((c) => (
                <Comment key={c._id} comment={c} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={changeEventHandler}
                  placeholder="Add a comment..."
                  className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                />
                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant="outline">
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialogue;
