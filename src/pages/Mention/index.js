import React, { useState, useEffect } from 'react';
import { Button, Input, message, Pagination, Modal, Spin } from 'antd';
import axios from 'axios';
import './index.scss';
import Header from '../../Header'; // 更新路径
import { HeartOutlined, HeartFilled } from '@ant-design/icons'; // 引入图标

const PAGE_SIZE = 5;

const Mention = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState({}); // 用于存储每个帖子的回复
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [usernames, setUsernames] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(id);
    } else {
      console.error('用户未登录或未获取到用户 ID');
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          // 获取评论
          const postsResponse = await axios.get('http://127.0.0.1:5000/comments');
          const comments = postsResponse.data;
          setPosts(comments);
  
          // 获取用户信息
          const userPromises = comments.map(comment =>
            axios.get(`http://127.0.0.1:5000/settings/get_username/${comment.user_id}`).catch(error => {
              console.error(`Error fetching username for user ID ${comment.user_id}:`, error);
              return { data: { username: 'Unknown' } }; 
            })
          );
          const userResponses = await Promise.all(userPromises);
          const usernameMap = userResponses.reduce((acc, userResponse, index) => {
            const user = userResponse.data;
            acc[comments[index].user_id] = user.username;
            return acc;
          }, {});
          setUsernames(usernameMap);
  
          // 获取每个帖子的回复
          const replyPromises = comments.map(comment =>
            axios.get(`http://127.0.0.1:5000/comments/${comment.comment_id}/replies`).catch(error => {
              console.error(`Error fetching replies for comment ID ${comment.comment_id}:`, error);
              return { data: [] }; 
            })
          );
          const replyResponses = await Promise.all(replyPromises);
          const replyMap = replyResponses.reduce((acc, replyResponse, index) => {
            const commentId = comments[index].comment_id;
            acc[commentId] = replyResponse.data;
            return acc;
          }, {});
          setReplies(replyMap);
        } catch (error) {
          setError('获取帖子时出错');
          console.error('Error fetching posts:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }
  }, [userId]);
  
  const handleLikeComment = async (commentId, isLiked) => {
    if (!userId) {
      message.error('请先登录');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`http://127.0.0.1:5000/comments/${commentId}/like`, {
        user_id: userId
      });

      const updatedPosts = posts.map(post =>
        post.comment_id === commentId ? { ...post, isLiked: !isLiked, like_count: post.like_count + (isLiked ? -1 : 1) } : post
      );

      setPosts(updatedPosts);
      message.success(response.data.message);
    } catch (error) {
      console.error('点赞操作时出错:', error);
      message.error('点赞失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPost = async () => {
    if (newPost.trim()) {
      setLoading(true);
      try {
        const postData = {
          text: newPost,
          user_id: userId,
        };

        const response = await axios.post('http://127.0.0.1:5000/comments', postData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const postsResponse = await axios.get('http://127.0.0.1:5000/comments');
        setPosts(postsResponse.data);

        setNewPost('');
        message.success(response.data.message);
      } catch (error) {
        setError('添加帖子时出错');
      } finally {
        setLoading(false);
      }
    } else {
      message.error('没有内容要发布');
    }
  };
//删除
  const handleDeleteComment = async (commentId) => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/comments/${commentId}`);
      setPosts(posts.filter(post => post.comment_id !== commentId));
      message.success('评论已删除');
    } catch (error) {
      console.error('删除评论时出错:', error);
      message.error('删除评论失败');
    } finally {
      setLoading(false);
    }
  };
//回复
const handleAddReply = async () => {
  if (!replyText.trim()) {
    message.error('回复内容不能为空');
    return;
  }

  setLoading(true);
  try {
    await axios.post(`http://127.0.0.1:5000/comments/${selectedCommentId}/replies`, {
      user_id: userId,
      text: replyText
    });

    // 获取最新的帖子数据，包括回复
    const postsResponse = await axios.get('http://127.0.0.1:5000/comments');
    setPosts(postsResponse.data);

    setReplyText('');
    setSelectedCommentId(null);
    setIsModalVisible(false); // 隐藏 Modal
    message.success('回复成功');
  } catch (error) {
    console.error('添加回复时出错:', error);
    message.error('添加回复失败');
  } finally {
    setLoading(false);
  }
};


 
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentPosts = posts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="mentionBody">
    <div className="mention-page">
      <Header />
      
      <div className="main-content">
        <div className="left-section">
          <div className="post-container">
            <div className="post-wrapper">
              {/* Add Post */}
              <div className="add-post">
                <div className="textarea-container">
                  <Input.TextArea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="有什么想说的吗..."
                    rows={4}
                    className="textarea"
                  />
                  <Button 
                    type="primary" 
                    onClick={handleAddPost}
                    className="post-button"
                  >
                    发布
                  </Button>
                </div>
              </div>
              {/* Posts List */}
              <div className="mention-content-wrapper">
                <div className="posts-list">
                  {loading ? <Spin tip="加载中..." /> : error ? <p className="error-message">{error}</p> : (
                    currentPosts.length > 0 ? (
                      currentPosts.map((post) => (
                        <div key={post.comment_id} className="post-item">
                          <div className="post-header">
                            <span className="username">{usernames[post.user_id] || '加载中...'}</span>
                          </div>
                          <div className="post-preview">
                            <p className={`post-text ${post.isExpanded ? 'expanded' : 'collapsed'}`}>
                              {post.text}
                            </p>
                            {post.text?.length > 100 && (
                              <Button
                                type="link"
                                className="toggle-button"
                                onClick={() => setPosts(posts.map(p =>
                                  p.comment_id === post.comment_id ? { ...p, isExpanded: !p.isExpanded } : p
                                ))}
                              >
                                {post.isExpanded ? '收起' : '更多'}
                              </Button>
                            )}
                          </div>
                          <div className="post-actions">
                            <Button 
                              type="text" 
                              onClick={() => handleLikeComment(post.comment_id, post.isLiked)}
                              className="like-button"
                            >
                              {post.isLiked ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                            </Button>
                            <Button 
                              type="danger" 
                              onClick={() => handleDeleteComment(post.comment_id)}
                              className="delete-button"
                            >
                              删除
                            </Button>
                            <Button 
                              type="default" 
                              onClick={() => {
                                setSelectedCommentId(post.comment_id);
                                setIsModalVisible(true);
                              }}
                              className="reply-button"
                            >
                              回复
                            </Button>
                            <p className="like-count">点赞数: {post.like_count}</p>
                          </div>
                          {/* 显示回复 */}
                          {replies[post.comment_id] && replies[post.comment_id].length > 0 && (
                            <div className="replies">
                              {replies[post.comment_id].map(reply => (
                                <div key={reply.id} className="reply-item">
                                  <span className="reply-username">{usernames[reply.user_id] || '加载中...'}</span>
                                  <p className="reply-text">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="no-posts">暂无帖子</p>
                    )
                  )}
                </div>
                <div className="pagination-container">
                  <Pagination
                    current={currentPage}
                    pageSize={PAGE_SIZE}
                    total={posts.length}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="pagination"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="回复评论"
          visible={isModalVisible}
          onOk={handleAddReply}
          onCancel={() => setIsModalVisible(false)}
          bodyStyle={{ backgroundColor: '#fff' }}
        >
          <Input.TextArea
            rows={4}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="输入回复内容"
          />
        </Modal>
        <div className="right-section">
          <div className="tags">
            <h3>热门</h3>
            <div className="tag-list">
              {['高富帅', 'Yanami', '原神', '二次元', '动漫'].map((tag, index) => (
                <div key={index} className={`tag-item tag-item-${index + 1}`}>{tag}</div>
              ))}
            </div>
          </div>
          <div className="ranking">
            <h3>热门条目</h3>
            <p className="ranking-subtitle">本周排行</p>
            <ol>
              {[
                '败犬女主太多了',
                '八奈见杏菜',
                '志喜屋梦子',
                '马剃天爱星',
                '温水和彦',
                '周防有希',
                '放虎原云雀',
                '杖与剑的魔剑谭',
                '温水佳树',
                '白玉莉子'
              ].map((item, index) => (
                <li key={index} className="ranking-item">
                  <div className={`rank-number rank-${index + 1}`}>{index + 1}</div>
                  <div className="item-name">{item}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
  
};

export default Mention;


