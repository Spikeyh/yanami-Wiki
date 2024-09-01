import unittest
import json
from YANAMI import create_app, db
from YANAMI.models import User, Comment

class CommentAPITestCase(unittest.TestCase):
    def setUp(self):
        # 创建应用实例
        self.app = create_app()
        self.app.testing = True
        self.client = self.app.test_client()

        # 在应用上下文中初始化数据库
        with self.app.app_context():
            db.create_all()

            # 创建一个用户
            user = User(username='testuser1')
            db.session.add(user)
            db.session.commit()

            # 记录这个用户的 ID 供测试使用
            self.user_id = user.id

    def tearDown(self):
        # 在应用上下文中清理数据库
        with self.app.app_context():
            db.session.remove()
            db.drop_all()



    def test_create_comment(self):
        # 测试创建评论的 API
        response = self.client.post('/comments', data=json.dumps({
            'user_id': self.user_id,
            'text': 'This is a test comment',
            'image_url': '',
            'emoji': '😊'
        }), content_type='application/json')

        data = json.loads(response.data)

        self.assertEqual(response.status_code, 201)
        self.assertIn('comment_id', data)
        self.assertEqual(data['message'], 'Comment created successfully!')

    def test_get_comments(self):
        # 测试获取评论的 API
        response = self.client.get('/comments')
        self.assertEqual(response.status_code, 200)

    def test_like_comment(self):
        # 首先创建一个评论
        response = self.client.post('/comments', data=json.dumps({
            'user_id': self.user_id,
            'text': 'This is a test comment',
            'image_url': '',
            'emoji': '😊'
        }), content_type='application/json')

        data = json.loads(response.data)

        if 'comment_id' not in data:
            self.fail(f"Expected 'comment_id' in response but got: {data}")

        comment_id = data['comment_id']

        # 点赞该评论
        response = self.client.post(f'/comments/{comment_id}/like', data=json.dumps({
            'user_id': self.user_id
        }), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('message', json.loads(response.data))

        # 再次取消点赞
        response = self.client.post(f'/comments/{comment_id}/like', data=json.dumps({
            'user_id': self.user_id
        }), content_type='application/json')

        self.assertEqual(response.status_code, 200)
        self.assertIn('message', json.loads(response.data))


if __name__ == '__main__':
    unittest.main()
