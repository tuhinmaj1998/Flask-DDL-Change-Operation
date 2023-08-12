from flask import Flask, render_template, request, json, jsonify, abort, redirect, url_for, make_response
from flask_wtf import FlaskForm
from wtforms import SelectField, StringField, IntegerField, SelectMultipleField
import rft_to_ui
from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
app.config['SECRET_KEY'] = '42'
auth = HTTPBasicAuth()

# app.config['MYSQL_HOST'] = 'localhost'
# app.config['MYSQL_USER'] = 'root'
# app.config['MYSQL_PASSWORD'] = 'Solidstate1622'
# app.config['MYSQL_DB'] = 'temp'

# conn = MySQL(app)


our_cred = {'admin':'1234','tuhin':'abcd'}

@auth.verify_password
def verify(username, password):
    if not (username and password):
        return False
    return our_cred.get(username) == password

class Form(FlaskForm):
    table_schema = SelectField(u'Schema', choices=rft_to_ui.fetch_all_schema())
    table_name = SelectField(u'Table', choices=[])
    operation = SelectField(u' Operation', choices=[('EDIT', 'Edit Existing Column'), ('ADD', 'Add New Column'),
                                                    ('DELETE', 'Delete Existing Column')])
    column_name = SelectField(u'Columm', choices=[])
    column_name_delete = SelectField('Columm', choices=[])
    # column_name_multi = SelectMultipleField('column_name', choices=[])

    # return make_response('could not verify', 401, {'www-Autheticate': 'Basic Realm="login Required"'})

@app.route('/', methods=['POST', 'GET'])
def index():
    return 'Helllllo!!!'

@app.route('/operation', methods=['POST', 'GET'])
@auth.login_required
def operation():
    form = Form()
    if request.method == 'POST':
        #     fetch_column_detail = rft_to_ui.fetch_column_details(form.table_schema.data, form.table_name.data, form.column_name.data)
        return_dict = request.form['return_dict']
        try:
            rft_to_ui.perform_operation(return_dict)
            result = 'OK'
        except:
            result = ''
        # return render_template('index_multi.html', query_string=Markup(result), form=Form(), method='post')
        return render_template('index_multi.html', performation_response=result, form=Form(), method='get')
        # return result
    return render_template('index_multi.html', performation_response='',form=form, method='get')

@app.route('/validate', methods=['POST', 'GET'])
@auth.login_required
def validate_data():
    if request.method == 'POST':
        return_val = (request.get_json())['return_dict_validate']
        print(return_val)
        result_val = rft_to_ui.perform_operation(return_val)
        return result_val
    return 'it is working as Get Request'

@app.route('/<table_schema>/table_name')
@auth.login_required
def table_name(table_schema):
    tablename_obj = rft_to_ui.fetch_tablename_dict(table_schema)
    return jsonify({'tablenames': tablename_obj})


@app.route('/<table_schema>/<table_name>/column_name')
def column_name(table_schema, table_name):
    columnname_obj = rft_to_ui.fetch_columnname_dict(table_schema, table_name)
    return jsonify({'columnnames': columnname_obj})


@app.route('/<schema>/<tablename>/<columnname>', methods=['GET'])
def fetch_column_detail_def(schema, tablename, columnname):
    print('columnname: ', columnname)
    fetch_column_detail_res = rft_to_ui.fetch_column_details(schema, tablename, columnname)
    extract_cdata_type_res = rft_to_ui.extract_cdata_type(fetch_column_detail_res)
    return extract_cdata_type_res


@app.route('/<schema>/<tablename>', methods=['POST', 'GET'])
def fetch_schema(schema, tablename):
    try:
        result_df = rft_to_ui.fetchdata_from_redshift(schema, tablename)
        return render_template('pandas_html.html', tables=[result_df.to_html(classes='data')],
                               titles=result_df.columns.values)
        # return (result)
        # return render_template('index_new.html')
    except Exception as e:
        return page_not_found(e)


@app.route('/verify_dict/<v_dict>', methods=['POST', 'GET'])
def verify_dict_url(v_dict):
    # print(v_dict)
    import urllib.parse
    v_dict = v_dict.replace('%2g', '%2F')
    verify_dict = urllib.parse.unquote_plus(v_dict)
    # print(verify_dict)
    return_vdict = rft_to_ui.verify_op(verify_dict)
    return return_vdict


@app.errorhandler(404)
def page_not_found(error):
    return make_response(str(error), 404, {'www-Autheticate': 'Basic Realm="Page does not exist"'})
    # return ('404\n' + str(error))


# return render_template('error_handle/404.html', title = '404'), 404

@app.errorhandler(500)
def Interface_Error(error):
    return make_response(str(error), 500, {'www-Autheticate': 'Basic Realm="Internal server error"'})
    # return ('500\n' + str(error))


# return render_template('error_handle/404.html', title = '404'), 404

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8000, debug=True)