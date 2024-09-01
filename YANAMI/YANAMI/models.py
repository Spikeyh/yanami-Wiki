from YANAMI import db
from datetime import datetime

#用户
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), nullable=False, unique=True)
    comments = db.relationship('Comment', backref='author', lazy=True)
    likes = db.relationship('Like', backref='user', lazy=True)

#评论
class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(255), nullable=True)
    emoji = db.Column(db.String(255), nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    likes = db.relationship('Like', backref='comment', lazy=True)

#点赞
class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=False)


#回复
class Reply(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'), nullable=False)
    user = db.relationship('User', backref=db.backref('replies', lazy=True))
    comment = db.relationship('Comment', backref=db.backref('replies', lazy=True))

#轮播图
class CarouselItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cover = db.Column(db.String(255), nullable=False)  # 图片的URL
    alt = db.Column(db.String(255), nullable=True)  # 图片的替换文字
    text = db.Column(db.String(255), nullable=True)  # 轮播图中的文本内容
    order = db.Column(db.Integer, nullable=False)  # 显示顺序
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


#资讯列表
class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # 使用 id 作为 articleId
    cover = db.Column(db.String(255), nullable=False)  # 图片的URL
    title = db.Column(db.String(255), nullable=False)  # 文章标题
    publish_date = db.Column(db.String(255), nullable=False)  # 发布时间
    author_id = db.Column(db.String(255), nullable=False)  # 作者ID
    tags = db.Column(db.JSON, nullable=True)  # 标签列表，JSON 格式
    like_count = db.Column(db.Integer, default=0)  # 点赞数量
    url = db.Column(db.String(255), nullable=False)  # 文章链接
    image = db.Column(db.String(255), nullable=True)  # 文章中的图片链接
