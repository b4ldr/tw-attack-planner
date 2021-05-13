import flask
import os
import logging
import stats.config
import flask.ext.sqlalchemy
import flask.ext.login
import flask.ext.openid

file_handler = logging.FileHandler("/tmp/flask.log")
file_handler.setLevel(logging.DEBUG)

app = flask.Flask(__name__)

database = flask.ext.sqlalchemy.SQLAlchemy(app)

lm = flask.ext.login.LoginManager()
lm.init_app(app)
lm.login_view = 'login'

oid = flask.ext.openid.OpenID(app, os.path.join(stats.config.basedir, 'tmp'))

app.config.from_object('stats.config')
app.logger.addHandler(file_handler)

import stats.views
import stats.models


