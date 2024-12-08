import React, { useState, useEffect } from 'react';
import likeIcon from '../image/like.svg'; // 确保路径正确

const LikeButton = ({ onToggleLike, likeCount, isLiked }) => {
  return (
    <div className="like-button" onClick={onToggleLike}>
      <img src={likeIcon} alt="like" style={{ transform: isLiked ? 'scale(1.2)' : 'scale(1)' }} />
      <span>{likeCount}</span>
    </div>
  );
};

export default LikeButton;