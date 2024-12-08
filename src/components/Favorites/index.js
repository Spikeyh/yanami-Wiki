// src/components/Favorites/index.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spin, List, Alert } from 'antd';
import './index.scss'; // 引入样式文件

const Favorites = ({ section }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch favorites data when component mounts
    const fetchFavorites = async () => {
      try {
        const userId = '12345'; // Replace with dynamic user ID
        const response = await axios.get(`http://localhost:8088/api/favorites/${userId}`);
        setFavorites(response.data.items);
      } catch (err) {
        setError('Failed to load favorites');
        console.error('Error fetching favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="favorite-card">
      <div className="card-head">{section === 'personal' ? '我的收藏' : '推荐收藏'}</div>
      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <List
          bordered
          dataSource={favorites}
          renderItem={(item) => (
            <List.Item>
              {item}
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default Favorites;

