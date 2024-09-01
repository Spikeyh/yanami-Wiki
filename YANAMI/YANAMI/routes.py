from flask import request, jsonify, Blueprint, Flask
from YANAMI import db
from YANAMI.models import User, Comment, Like,Reply,CarouselItem,Article
from datetime import datetime
# 定义蓝图
bp = Blueprint('routes', __name__)

# 序列化 Comment 模型
def comment_to_dict(comment):
    return {
        'comment_id': comment.id,
        'user_id': comment.user_id,
        'text': comment.text,
        'image_url': comment.image_url,
        'emoji': comment.emoji,
        'timestamp': comment.timestamp,
        'like_count': Like.query.filter_by(comment_id=comment.id).count()
    }

#获取评论
@bp.route('/comments', methods=['GET'])
def get_comments():
    page = request.args.get('page')
    per_page = request.args.get('per_page')
    comments = Comment.query.paginate(page=1, per_page=10)

    result = {
        'page':f'{page}',
        'comments': [comment_to_dict(comment) for comment in comments.items],
        'total': comments.total,
        'per_page':f'{per_page}'
    }
    return jsonify(result)

#创建评论
@bp.route('/comments', methods=['POST'])
def create_comment():
    data = request.get_json()
    user_id = data.get('user_id')
    text = data.get('text')
    image_url = data.get('image_url')
    emoji = data.get('emoji')

    new_comment = Comment(user_id=user_id, text=text, image_url=image_url, emoji=emoji)
    try:
        db.session.add(new_comment)
        db.session.commit()
        return jsonify({'message': '评论已创建', 'comment_id': new_comment.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '评论失败', 'details': str(e)}), 500

#点赞
@bp.route('/comments/<int:comment_id>/like', methods=['POST'])
def like_comment(comment_id):
    data = request.get_json()
    user_id = data.get('user_id')

    like = Like.query.filter_by(user_id=user_id, comment_id=comment_id).first()

    if like:
        db.session.delete(like)
        db.session.commit()
        return jsonify({'message': '已取消点赞!'})
    else:
        new_like = Like(user_id=user_id, comment_id=comment_id)
        db.session.add(new_like)
        db.session.commit()
        return jsonify({'message': '已点赞!'})

#获取特定评论
@bp.route('/comments/<int:comment_id>', methods=['GET'])
def get_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    return jsonify(comment_to_dict(comment))

#删除评论及其回复
@bp.route('/comments/<int:comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    try:
        # 删除与评论相关的所有回复
        Reply.query.filter_by(comment_id=comment_id).delete()
        db.session.delete(comment)
        db.session.commit()
        return jsonify({'message': '评论已删除!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '删除失败', 'details': str(e)}), 500


#获取回复
@bp.route('/comments/<int:comment_id>/replies', methods=['GET'])
def get_replies(comment_id):
    comment = Comment.query.get(comment_id)
    replies = Reply.query.filter_by(comment_id=comment_id).all()
    return jsonify([{
        'id': reply.id,
        'text': reply.text,
        'timestamp': reply.timestamp,
        'user_id': reply.user_id
    } for reply in replies])


#创建回复
@bp.route('/comments/<int:comment_id>/replies', methods=['POST'])
def create_reply(comment_id):
    data = request.get_json()
    user_id = data.get('user_id')
    text = data.get('text')

    new_reply = Reply(user_id=user_id, comment_id=comment_id, text=text)
    try:
        db.session.add(new_reply)
        db.session.commit()
        return jsonify({'message': '回复成功!', 'reply_id': new_reply.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '回复失败', 'details': str(e)}), 500

#删除回复
@bp.route('/replies/<int:reply_id>', methods=['DELETE'])
def delete_reply(reply_id):
    reply = Reply.query.get_or_404(reply_id)
    try:
        db.session.delete(reply)
        db.session.commit()
        return jsonify({'message': '回复已删除!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '删除失败', 'details': str(e)}), 500

#获取轮播图
@bp.route('/carousel', methods=['GET'])
def get_carousel_items():
    carousel_items = CarouselItem.query.order_by(CarouselItem.order).all()
    return jsonify([{
        'id': item.id,
        'cover': item.cover,
        'alt': item.alt,
        'text': item.text,
        'order': item.order
    } for item in carousel_items])

#创建轮播图
@bp.route('/carousel', methods=['POST'])
def create_carousel_item():
    data = request.get_json()
    cover = data.get('cover')
    alt = data.get('alt')
    text = data.get('text')
    order = data.get('order')

    new_item = CarouselItem(cover=cover, alt=alt, text=text, order=order)
    try:
        db.session.add(new_item)
        db.session.commit()
        return jsonify({'message': 'Carousel item created successfully!', 'carousel_item_id': new_item.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create carousel item', 'details': str(e)}), 500


#更新轮播图
@bp.route('/carousel/<int:item_id>', methods=['PUT'])
def update_carousel_item(item_id):
    item = CarouselItem.query.get_or_404(item_id)
    data = request.get_json()

    item.cover = data.get('cover', item.cover)
    item.alt = data.get('alt', item.alt)
    item.text = data.get('text', item.text)
    item.order = data.get('order', item.order)

    try:
        db.session.commit()
        return jsonify({'message': 'Carousel item updated successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update carousel item', 'details': str(e)}), 500

#删除轮播图
@bp.route('/carousel/<int:item_id>', methods=['DELETE'])
def delete_carousel_item(item_id):
    item = CarouselItem.query.get_or_404(item_id)
    try:
        db.session.delete(item)
        db.session.commit()
        return jsonify({'message': 'Carousel item deleted successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete carousel item', 'details': str(e)}), 500


#获取条目
@bp.route('/articles', methods=['GET'])
def get_articles():
    articles = Article.query.order_by(Article.publish_date.desc()).all()
    return jsonify([{
        'articleId': article.id,
        'cover': article.cover,
        'title': article.title,
        'publishDate': article.publish_date.isoformat(),
        'authorId': article.author_id,
        'tags': article.tags,
        'likeCount': article.like_count,
        'url': article.url,
        'image': article.image
    } for article in articles])


#创建条目
@bp.route('/articles', methods=['POST'])
def create_article():
    data = request.get_json()
    cover = data.get('cover')
    title = data.get('title')
    publish_date = data.get('publish_date')
    author_id = data.get('author_id')
    tags = data.get('tags', [])
    like_count = data.get('likeCount', 0)
    url = data.get('url')
    image = data.get('image')

     #Convert publishDate to datetime object
    try:
        publish_date = datetime.fromisoformat(publish_date)
    except ValueError:
        return jsonify({'error': 'Invalid publishDate format'}), 400

    new_article = Article(
        cover=cover,
        title=title,
        publish_date=publish_date,
        author_id=author_id,
        tags=tags,
        like_count=like_count,
        url=url,
        image=image
    )
    try:
        db.session.add(new_article)
        db.session.commit()
        return jsonify({'message': 'Article created successfully!', 'articleId': new_article.id})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create article', 'details': str(e)}), 500


#更新条目
@bp.route('/articles/<int:article_id>', methods=['PUT'])
def update_article(article_id):
    article = Article.query.get_or_404(article_id)
    data = request.get_json()

    article.cover = data.get('cover', article.cover)
    article.title = data.get('title', article.title)
    publish_date = data.get('publish_date', article.publish_date.isoformat())
    try:
        article.publish_date = datetime.fromisoformat(publish_date)
    except ValueError:
        return jsonify({'error': 'Invalid publishDate format'}), 400
    article.author_id = data.get('authorId', article.author_id)
    article.tags = data.get('tags', article.tags)
    article.like_count = data.get('likeCount', article.like_count)
    article.url = data.get('url', article.url)
    article.image = data.get('image', article.image)

    try:
        db.session.commit()
        return jsonify({'message': 'Article updated successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update article', 'details': str(e)}), 500


#删除条目
@bp.route('/articles/<int:article_id>', methods=['DELETE'])
def delete_article(article_id):
    article = Article.query.get_or_404(article_id)
    try:
        db.session.delete(article)
        db.session.commit()
        return jsonify({'message': 'Article deleted successfully!'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete article', 'details': str(e)}), 500

# 将蓝图注册到应用中
def init_app(app):
    app.register_blueprint(bp)

