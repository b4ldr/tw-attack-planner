import flask.ext.wtf
import wtforms
import wtforms.validators

class ReportSubmit(flask.ext.wtf.Form):
    report = wtforms.TextField('report', validators = [wtforms.validators.Required()])
    #remember_me = wtforms.BooleanField('remember_me', default = False)
