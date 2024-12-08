import './HomePageBody.css';
import Header from './Header';
import React, { useState, useEffect, useRef } from 'react';
import {useParams}from 'react-router-dom';
import CircleCard from './Card/CircleCard';
import NewsCard from './Card/NewsCard';
import community from './image/community.svg';
import weeks from './image/weeks.svg';
import news from './image/news.svg';
import Carousel from './Carousel';
import axios from 'axios';
import { Button, Input, message, Pagination, Modal, Spin } from 'antd';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';


const PAGE_SIZE = 5;

export default function HomePageBody() {
    const [selectedDay, setSelectedDay] = useState('Monday');
    const [scrollIndicatorStyle, setScrollIndicatorStyle] = useState({ marginLeft: '9px' });
    const scrollIndicatorRef = useRef(null); // 添加一个ref来引用weekNavItemScroll元素
    const [weekData, setWeekData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [carouselData,setCarouselData]=useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [usernames, setUsernames] = useState({});
    const [replies, setReplies] = useState({}); // 用于存储每个帖子的回复
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [posts, setPosts] = useState([]);
  
  

    useEffect(()=>{
        axios.get('http://127.0.0.1:5000/carousel')
        .then(response => {
            setCarouselData(response.data);
        })
        .catch((error) => console.error('Error fetching carousel data:', error));
    },[]);

    useEffect(() => {
        updateScrollIndicator('Monday');
        fetchWeekData('Monday');
    },[]);

    useEffect(() => {
        setLoading(true);
        fetchWeekData(selectedDay).then(() => {
            setLoading(false);
        });
    }, [selectedDay]);


  const [newPost, setNewPost] = useState('');
  const [replyText, setReplyText] = useState('');

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

    const handleDayClick = (day) => {
        setSelectedDay(day);
        updateScrollIndicator(day);
    };

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

      const startIndex = (currentPage - 1) * PAGE_SIZE;

      const currentPosts = posts.slice(startIndex, startIndex + PAGE_SIZE);

    const fetchWeekData = async(day) => {
        try {
            const response = await fetch(`http://127.0.0.1:5000/animes`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const filteredData = data.filter(item => {
                const weekday = new Date(item.release_weekday).toLocaleDateString('en-US', { weekday: 'long' });
                return weekday === day;
            });
            
            setWeekData(filteredData);
            
        } catch (error) {
            console.error('Error fetching week data:', error);
        }
    };
    const updateScrollIndicator = (day) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const index = days.indexOf(day);
        const marginLeft = 10+index * 52; // 假设每个天的宽度是20px
        setScrollIndicatorStyle({ marginLeft: `${marginLeft}px` });
    };

    const getDayStyle = (day) => {
        return {
            cursor: 'pointer',
            color: selectedDay === day ? 'rgba(248,169,202,0.45)' : 'rgb(153, 153, 153)',
        };
    };

    const {articleId} = useParams();
    const articleIdInt=parseInt(articleId);
    const [articles, setArticles] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:5000/articles`)
        .then((response)=>{
            setArticles(response.data); // 设置整个数组
            setLoading(false);
        })
        .catch((error) => {
            setError('Failed to fetch data.');
            setLoading(false);
        });
    }, [articleIdInt]);

    const getExcerpt = (url) => {
        const lines = url.split('\n');
        return lines.slice(0, 3).join('\n')+ '...'; // 取前三行
    };

    

    return(
        <>
    <Header />
    <div className="body"> 
        <div className="container">
            <div className="mainContent">
                <div className="carouselRec">
                    <div className="carouselImage">
                    {carouselData.length > 0 ? (
                    <Carousel images={carouselData} />
                ) : (
                    <p>Loading...</p>
                )}
                    </div>
                </div>
                <section className="weekNewsRec">
                    <div className="weekNewsInner">
                        <div className="weekNewsTitle">
                        <CircleCard src={weeks} alt={"weeks"} fontFamily={"Gabriola"}>
                        每周新番
                        </CircleCard>
                        </div>
                        <div className="weekNewsContent">
                            <div className="weekNavTabs">
                                <div className="weekNav">
                                    <div className="weekNavItem">
                                        <div className="Monday"  style={getDayStyle('Monday')} onClick={() => handleDayClick('Monday')}>周一</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Tuesday"  style={getDayStyle('Tuesday')} onClick={() => handleDayClick('Tuesday')}>周二</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Wednesday"  style={getDayStyle('Wednesday')} onClick={() => handleDayClick('Wednesday')}>周三</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Thursday"  style={getDayStyle('Thursday')} onClick={() => handleDayClick('Thursday')}>周四</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Friday"  style={getDayStyle('Friday')} onClick={() => handleDayClick('Friday')}>周五</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Saturday"  style={getDayStyle('Saturday')} onClick={() => handleDayClick('Saturday')}>周六</div>
                                    </div>
                                    <div className="weekNavItem">
                                        <div className="Sunday"  style={getDayStyle('Sunday')} onClick={() => handleDayClick('Sunday')}>周日</div>
                                    </div>
                                </div>
                                <div className="weekNavItemScroll" style={scrollIndicatorStyle} ref={scrollIndicatorRef}></div>
                            </div>
                            <div className="weekNewsListContainer">
                                <div className="weekeNewsListInner">
                                    <div className="preBtn"></div>
                                    <div className="weekNewsListBar">
                                    {loading ? (
                                                <p>Loading...</p>
                                            ) : weekData.length > 0 ? (
                                                weekData.map((item, index) => (
                                                    <a className="weekNewsListCard" href={`/anime/${item.animeId}`} key={index}>
                                                        <img className="weekNewsListImg" src={item.cover} alt={item.alt} />
                                                        <p>{item.title}</p>
                                                    </a>
                                                ))
                                            ) : (
                                                <p>No data available</p>
                                            )}
                                    </div>
                                    <div className="nextBtn"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="newsRec">
                    <div className="newsInner">
                        <div className="newsTitle">
                        <CircleCard src={news} alt={"news"}  href="/article" fontFamily={"Gabriola"}>
                        新番资讯
                        </CircleCard>
                        </div>
                        <div className="newsContent">
                        {articles.map((article) => (
                            <NewsCard
                                key={article.articleId}
                                articleId={article.articleId}
                                cover={article.cover}
                                title={article.title}
                                excerpt={getExcerpt(article.url)}
                                publishDate={article.publishDate}
                                authorId={article.authorId}
                            />
                        ))}

                        </div>
                    </div>
                </section>
            </div>
            <div className="sideContent">
                    <section className="communityRec">
                        <div className="communityInner">
                            <CircleCard src={community} alt={"community"} href="/mention"fontFamily={"Gabriola"}>
                            社区讨论
                            </CircleCard><div className="communityContent">
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
                </div></div>
                        </div>
                    </section>
            </div>
        </div>
    </div>
    <footer></footer>
    </>  
    );
}