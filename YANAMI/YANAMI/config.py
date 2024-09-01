import os
import pymysql
from flask_sqlalchemy import SQLAlchemy
class Config:
    # 数据库 URI，可以根据需要更改
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:487095086@127.0.0.1:3306/flaskdb'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)
