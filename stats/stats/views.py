import flask
import stats
import submission
import login
import models

@stats.app.route('/')
@stats.app.route('/index/')
@flask.ext.login.login_required
def index():
    user = flask.g.user
    return flask.render_template('index.html', user = user)

@stats.app.route('/submission/', methods = ['GET', 'POST'])
def submission():
    form = stats.submission.ReportSubmit()
    if form.validate_on_submit():
        flask.flash('Test')
        return flask.redirect(flask.url_for('index'))
    return flask.render_template('submission.html', form=form)

@stats.app.route('/login/', methods = ['GET', 'POST'])
@stats.oid.loginhandler
def login():
    if flask.g.user is not None and flask.g.user.is_authenticated():
        return flask.redirect(flask.url_for('index'))
    form = stats.login.LoginForm()
    if form.validate_on_submit():
        flask.session['remember_me'] = form.remember_me.data
        return stats.oid.try_login(form.openid.data, ask_for = ['nickname', 'email'])
    return flask.render_template('login.html', 
        title = 'Sign In',
        form = form,
        providers = stats.app.config['OPENID_PROVIDERS'])

@stats.lm.user_loader
def load_user(id):
    return models.User.query.get(int(id))

@stats.oid.after_login
def after_login(resp):
    if resp.email is None or resp.email == "":
        flask.flash('Invalid login. Please try again.')
        return flask.redirect(flask.url_for('login'))
    user = models.User.query.filter_by(email = resp.email).first()
    if user is None:
        nickname = resp.nickname
        if nickname is None or nickname == "":
            nickname = resp.email.split('@')[0]
        user = models.User(nickname = nickname, email = resp.email, role = models.ROLE_USER)
        stats.database.session.add(user)
        stats.database.session.commit()
    remember_me = False
    if 'remember_me' in flask.session:
        remember_me = flask.session['remember_me']
        flask.session.pop('remember_me', None)
    flask.ext.login.login_user(user, remember = remember_me)
    return flask.redirect(flask.request.args.get('next') or flask.url_for('index'))

@stats.app.before_request
def before_request():
    flask.g.user = flask.ext.login.current_user

@stats.app.route('/logout')
def logout():
    flask.ext.login.logout_user()
    return flask.redirect(flask.url_for('index'))
