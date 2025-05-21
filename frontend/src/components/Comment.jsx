import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Comment = ({ comment }) => {
  return (
    <div className="my-2 text-gray-200">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={comment.owner.profilePicture} />
          <AvatarFallback>
            {comment.owner.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-bold text-gray-300">{comment.owner.username}</p>
          <p className="text-sm text-gray-500">{comment.content}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
