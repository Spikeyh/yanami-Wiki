import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { SettingOutlined, StarOutlined, CommentOutlined, ShareAltOutlined } from '@ant-design/icons';
import axios from 'axios'; // 导入 axios
import Settings from '../../components/Settings'; // 假设路径正确
import Favorites from '../../components/Favorites'; // 假设路径正确
import Comments from '../../components/Comments'; // 更新路径
import SharedResources from '../../components/SharedResources'; // 假设路径正确
import Header from '../../Header'; // 更新路径
import './index.scss';

const Profile = () => {
  const [selectedKey, setSelectedKey] = useState('1');
  const [username, setUsername] = useState(''); // 新增状态用于保存用户名
  const [userId, setUserId] = useState(null); // 保存用户ID
  
  useEffect(() => {
    const id = localStorage.getItem('userId');
    if (id) {
      setUserId(id);
    } else {
      console.error('用户未登录或未获取到用户 ID');
    }
  }, []);

  // 获取用户名
  useEffect(() => {
    const fetchUsername = async () => {
      if (userId) { // 确保 userId 存在
        try {
          // 使用 GET 方法获取用户名
          const response = await axios.get(`http://127.0.0.1:5000/settings/get_username/${userId}`);
          setUsername(response.data.username); // 假设接口返回的数据中包含用户名
        } catch (error) {
          console.error('获取用户名时出错:', error);
        }
      }
    };

    fetchUsername();
  }, [userId]); 

  // 根据选中的菜单项渲染不同的内容
  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <Settings section="personal" />;
      case '2':
        return <Settings section="system" />;
      case '3':
        return <Favorites section="personal" />;
      case '4':
        return <Favorites section="recommend" />;
      case '5':
        return <Comments section="my" />;
      case '6':
        return <Comments section="manage" />;
      case '7':
        return <SharedResources section="resources" />;
      case '8':
        return <SharedResources section="requests" />;
      default:
        return <Settings section="personal" />;
    }
  };

  return (
    <div className="profile-page">
      <Header /> {/* 仅在 Profile 页面渲染 Header */}

      <div className="profile-content-wrapper">
        <div className="profile-sider">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <img src="/avatar.webp" alt="Avatar" className="avatar-img" />
              <div className="avatar-info">
                <h2>{username || '用户名'}</h2> {/* 显示用户名，如果还未获取则显示默认值 */}
              </div>
            </div>
          </div>
          <Menu 
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={({ key }) => {
              console.log('菜单项点击:', key); // 添加日志
              setSelectedKey(key);
            }}
          >
            <Menu.SubMenu key="settings" icon={<SettingOutlined />} title="设置">
              <Menu.Item key="1">个人设置</Menu.Item>
              <Menu.Item key="2">系统设置</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="favorites" icon={<StarOutlined />} title="收藏">
              <Menu.Item key="3">我的收藏</Menu.Item>
              <Menu.Item key="4">推荐收藏</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="comments" icon={<CommentOutlined />} title="评论">
              <Menu.Item key="5">我的评论</Menu.Item>
              <Menu.Item key="6">评论管理</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu key="shared" icon={<ShareAltOutlined />} title="资源共享">
              <Menu.Item key="7">共享资源</Menu.Item>
              <Menu.Item key="8">资源请求</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </div>
        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Profile;




