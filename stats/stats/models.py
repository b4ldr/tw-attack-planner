import stats

ROLE_USER = 0
ROLE_ADMIN = 1

class User(stats.database.Model):
    id = stats.database.Column(stats.database.Integer, primary_key = True)
    nickname = stats.database.Column(stats.database.String(64), index = True, unique = True)
    email = stats.database.Column(stats.database.String(120), index = True, unique = True)
    role = stats.database.Column(stats.database.SmallInteger, default = ROLE_USER)
    posts = stats.database.relationship('Post', backref = 'author', lazy = 'dynamic')

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return unicode(self.id)

    def __repr__(self):
        return '<User %r>' % (self.nickname)

class Post(stats.database.Model):
    id = stats.database.Column(stats.database.Integer, primary_key = True)
    body = stats.database.Column(stats.database.String(140))
    timestamp = stats.database.Column(stats.database.DateTime)
    user_id = stats.database.Column(stats.database.Integer, stats.database.ForeignKey('user.id'))

    def __repr__(self):
        return '<Post %r>' % (self.body)
