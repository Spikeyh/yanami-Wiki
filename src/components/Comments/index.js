// src/components/Comments/index.js
import React from 'react';
import './index.scss'; // 引入样式文件

const Comments = ({ section }) => {
  return (
    <div className="comments-card">
      <div className="card-head">评论</div>
      {section === 'my' && <div>我的评论</div>}
      {section === 'manage' && <div>评论管理</div>}
      {!section && <div>请选择评论选项</div>}
    </div>
  );
};

export default Comments;
