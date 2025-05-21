import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { setSelectedPost, setPost } from '@/redux/postSlice.js';
import CommentDialogue from './CommentDialogue.jsx';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const posts = useSelector((state) => state.post.posts);

  const [value, setValue] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const [open, setOpen] = useState(false);
  const [openComment, setOpenComment] = useState(false);
  const [postLikeCount, setPostLikeCount] = useState(post.likes.length);
  const [like, setLike] = useState(post.likes.includes(user._id));
  const [view, setView] = useState(post.comments.length);

  useEffect(() => {
    if (post) {
      setComments(post.comments);
      setPostLikeCount(post.likes.length);
      setLike(post.likes.includes(user._id));
      setView(post.comments.length);
    }
  }, [post]);

  const handleClose = () => setOpen(false);
  const handleChange = (e) => setValue(e.target.value);
  const handleOpen = () => setOpen(true);
  const handleCloseComment = () => setOpenComment(false);

  const CommentHandleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/post/${post._id}/comment`,
        { comment: value },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.data.success) {
        const updatedPostComment = [...comments, res.data.comment];
        setComments(updatedPostComment);
        setView(view + 1);

        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedPostComment } : p
        );
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
        setValue("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting comment.");
    }
  };

  const postDeletehandle = async () => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/post/delete/${post._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        const updatedPosts = posts.filter((p) => p._id !== post._id);
        dispatch(setPost(updatedPosts));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      setOpen(false);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}/api/v1/post/bookmark/${post._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      let res;
      if (!like) {
        res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/post/${post._id}/like`,
          { withCredentials: true }
        );

        setPostLikeCount(postLikeCount + 1);
        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, likes: [...p.likes, user._id] } : p
        );
        dispatch(setPost(updatedPosts));
        setLike(true);
      } else {
        res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URI}/api/v1/post/${post._id}/dislike`,
          { withCredentials: true }
        );

        setPostLikeCount(postLikeCount - 1);
        const updatedPosts = posts.map((p) =>
          p._id === post._id ? { ...p, likes: p.likes.filter((id) => id !== user._id) } : p
        );
        dispatch(setPost(updatedPosts));
        setLike(false);
      }

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error processing like/dislike.");
    }
  };

  return (
    <div className="border-2 h-fit gap-2 md:min-w-[300px] w-[250px] md:w-[70%]  border-gray-300 rounded-xl p-4 m-2 relative flex flex-col items-center">
      {/* Header: Avatar and More Options */}
      <div className="flex h-[10%] justify-between items-center w-full">
        <div className="flex justify-center items-center gap-2">
          <Avatar>
            <AvatarImage src={post?.owner?.profilePicture} />
            <AvatarFallback className="bg-gray-300 text-gray-500">CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">{post?.owner?.username}</h1>
            <p className="text-sm text-gray-500">2 days ago</p>
          </div>
        </div>

        {post?.owner?._id === user._id && (
          <button onClick={handleOpen} className="text-sm p-1 text-gray-700">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        )}
      </div>

      {/* Image */}
      <div className="md:min-w-[300px] w-full md:w-[90%] h-[80%] flex justify-center items-center py-2">
        <img
          src={post?.image}
          className="h-full object-contain min-w-[100%]"
          alt="Post"
        />
      </div>
{/* <div className='bg-red-500'>ooh</div> */}
      {/* Actions and Caption */}
      <div className="flex flex-col h-[20%] justify-center items-start px-4 py-2 w-full">
        <div className="flex justify-between items-center gap-2 my-2 w-full">
          <div className="flex justify-center items-center gap-2">
            <button onClick={likeOrDislikeHandler}>
              {like ? (
                <Heart className="text-red-500 fill-red-500" />
              ) : (
                <span className="material-symbols-outlined">favorite</span>
              )}
            </button>

            <button
              onClick={() => {
                setOpenComment(true);
                dispatch(setSelectedPost(post));
              }}
              className="material-symbols-outlined"
            >
              chat
            </button>

            <button className="material-symbols-outlined">share</button>
          </div>

          <span onClick={bookmarkHandler} className="material-symbols-outlined cursor-pointer">
            bookmark
          </span>
        </div>

        <p className="text-sm text-gray-800">{postLikeCount} likes</p>
        <p className="text-sm text-gray-500">{post?.caption}</p>

        {view > 0 && (
          <button
            onClick={() => {
              setOpenComment(true);
              dispatch(setSelectedPost(post));
            }}
            className="text-sm p-1 text-gray-700"
          >
            view all {comments.length} comments
          </button>
        )}
      </div>

      {/* Add Comment */}
      <form
        onSubmit={CommentHandleSubmit}
        className="flex justify-center items-center gap-2 w-full h-[10%]"
      >
        <input
          onChange={handleChange}
          value={value}
          type="text"
          placeholder="Add a comment"
          className="w-full p-2 border-2 border-gray-300 rounded-xl"
        />
        {value.trim() !== "" && (
          <button type="submit" className="text-sm p-2 text-gray-700">
            <span className="material-symbols-outlined">send</span>
          </button>
        )}
      </form>

      {/* Delete Post Dialog */}
      <Dialog open={open} onOpenChange={setOpen} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogContent onInteractOutside={handleClose}>
          <button
            className="text-sm p-1 text-gray-700 hover:bg-red-700 hover:text-white rounded"
            onClick={postDeletehandle}
          >
            Delete
          </button>
        </DialogContent>
      </Dialog>

      {/* Comments Dialog */}
      <CommentDialogue open={openComment} onOpenChange={setOpenComment} />
    </div>
  );
};

export default PostCard;
