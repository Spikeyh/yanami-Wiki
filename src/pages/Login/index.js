import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Alert } from 'antd';
import './index.scss';
import Header from '../../Header';

const API_URL = 'http://127.0.0.1:5000'; // 硬编码 API URL

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // 处理登录表单提交
  const handleSubmit = async () => {
    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(data.message); // 显示成功消息
        
        // 存储用户 ID 和其他信息到本地存储
        localStorage.setItem('userId', data.id); // 使用后端返回的字段名
        localStorage.setItem('username', data.username); // 可选：存储用户名或其他信息
        
        setTimeout(() => {
          navigate('/profile'); // 登录成功后跳转到个人资料页面
        }, 2000); // 延迟2秒后跳转
      } else {
        const errorData = await response.json();
        setError(errorData.message || '登录失败'); // 显示错误消息
      }
    } catch (error) {
      setError('网络错误，请重试'); // 显示网络错误消息
      console.error('网络错误:', error); // 打印错误信息以便调试
    }
  };

  // 处理点击注册按钮事件
  const handleRegisterClick = () => {
    navigate('/register'); // 跳转到注册页面
  };

  return (
    <>
    <Header/>
    <div className="body">
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="avatar-upload">
          <img className="avatar-img" src="/avatar.webp" alt="用户头像" />
        </div>
        {error && <Alert message={error} type="error" showIcon />}
        {success && <Alert message={success} type="success" showIcon />}
        <Form
          name="login"
          onFinish={handleSubmit}
          initialValues={{ username, password }}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户 ID"
            rules={[{ required: true, message: '请输入用户名!' }]}
            className="form-item"
          >
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码!' }]}
            className="form-item"
          >
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-item"
            />
          </Form.Item>
          <Form.Item>
            <Button type="login" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="link" onClick={handleRegisterClick} block>
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
    </div>
    </>
  );
};

export default LoginPage;

