import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Alert } from 'antd';
import axios from 'axios'; // 确保导入了 axios
import './index.scss';
import Header from '../../Header';

const { Title } = Typography;
const API_URL = 'http://127.0.0.1:5000'; // 硬编码 API URL

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // 处理注册表单提交
  const handleSubmit = async () => {
    if (!email || !verificationCode || !username || !password || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }

    if (password !== confirmPassword) {
      setError('密码和确认密码不一致');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        email,
        verificationCode,
        username,
        password,
        confirmPassword
      });

      setSuccess(response.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || '注册失败');
      } else {
        setError('网络错误，请重试');
      }
    }
  };

  // 处理获取验证码按钮点击事件
  const handleGetVerificationCode = async () => {
    if (!email) {
      setError('请填写邮箱地址');
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}/auth/determine/email`, {
        params: { email }
      });
      console.log('Response:', response); // 添加这一行来查看响应数据
      alert('验证码已发送到邮箱');
    } catch (error) {
      console.log('Error:', error); // 添加这一行来查看错误数据
      if (error.response) {
        setError(error.response.data.message || '获取验证码失败');
      } else {
        setError('网络错误，请重试');
      }
    }
  };
  

  return (
    <>
    <Header />
    <div className="body">
    <div className="register-container">
      <Card
        title={<Title level={2}>注册</Title>}
        className="register-card"
        bordered={false}
      >
        {error && <Alert message={error} type="error" showIcon />}
        {success && <Alert message={success} type="success" showIcon />}
        <Form
          name="register"
          onFinish={handleSubmit}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ required: true, message: '请输入邮箱!' }]}
            className="form-item"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item
            name="verificationCode"
            label="验证码"
            rules={[{ required: true, message: '请输入验证码!' }]}
            className="form-item"
          >
            <Input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="username"
            label="用户名"
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
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            rules={[{ required: true, message: '请确认密码!' }]}
            className="form-item"
          >
            <Input.Password
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-item"
            />
          </Form.Item>
          <Form.Item>
          <Button type="default" onClick={handleGetVerificationCode} className="ant-btn-get-code">
  获取验证码
</Button>
<Button type="primary" htmlType="submit" block className="ant-btn-register">
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

export default RegisterPage;

