import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Typography, Alert, Card } from 'antd';
import './index.scss';

const { Title } = Typography;

const Settings = ({ section }) => {
  const [form] = Form.useForm();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // 从本地存储中获取用户ID（如果不需要用户ID输入，可以注释掉下面的代码）
    const id = localStorage.getItem('userId');
    if (id) {
      form.setFieldsValue({ id }); // 设置表单初始值
    }
  }, [form]);

  const handleSubmit = async (values) => {
    const { id, username, email, password } = values;

    if (!id) {
      setError('用户ID缺失');
      return;
    }

    const requestData = {
      id,
      username,
      email,
      password
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/settings/update_settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || '设置更新失败');
      } else {
        const data = await response.json();
        setSuccess(data.message || '设置更新成功');
        form.resetFields();
      }
    } catch (error) {
      setError('网络错误，请重试');
      console.error('网络错误:', error);
    }
  };

  return (
    <div>
      {section === 'personal' && (
        <Card className="settings-card" title={<Title level={3}>个人设置</Title>}>
          {error && <Alert message={error} type="error" showIcon />}
          {success && <Alert message={success} type="success" showIcon />}
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{ id: '', username: '', email: '', password: '' }}
          >
            <Form.Item
              name="id"
              label="用户ID"
              rules={[{ required: true, message: '请输入用户ID!' }]}
            >
              <Input placeholder="请输入用户ID" />
            </Form.Item>
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input placeholder="请输入新用户名" />
            </Form.Item>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[{ required: true, message: '请输入邮箱地址!' }, { type: 'email', message: '请输入有效的邮箱地址!' }]}
            >
              <Input placeholder="请输入新邮箱" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password placeholder="请输入新密码" />
            </Form.Item>
            <div className="form-actions">
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form>
        </Card>
      )}
      {section === 'system' && <div>系统设置内容</div>}
      {!section && <div>默认设置内容</div>}
    </div>
  );
};

export default Settings;



