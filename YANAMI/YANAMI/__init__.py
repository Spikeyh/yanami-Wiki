from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # 从 config.py 加载配置
    app.config.from_object('YANAMI.config.Config')

    # 初始化数据库
    db.init_app(app)

    with app.app_context():
        # 导入 routes.py 中的路由
        from YANAMI.routes import bp
        app.register_blueprint(bp)

        db.create_all()

    return app
