import flask.ext.wtf
import wtforms
import wtforms.validators

class LoginForm(flask.ext.wtf.Form):
    openid = wtforms.TextField('report', validators = [wtforms.validators.Required()])
    remember_me = wtforms.BooleanField('remember_me', default = False)
