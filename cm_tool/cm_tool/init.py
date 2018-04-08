import tlib.log as log

from flask import Flask
# from flask.ext.cors import CORS


log.debug("init app")

app = Flask(__name__)
# CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://lijingcheng:lijingcheng@xcase.mysql.rds.aliyuncs.com/flask_demo?charset=utf8'
app.config['SQLALCHEMY_POOL_RECYCLE'] = 60
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 10
app.config['SQLALCHEMY_POOL_SIZE'] = 3
app.config['SQLALCHEMY_MAX_OVERFLOW'] = 20
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
