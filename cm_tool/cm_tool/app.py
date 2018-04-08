#!/home/tops/bin/python2.7
# -*- coding:utf-8 -*-

import sys
import time
import json
import traceback
import datetime
import base64
import os

from flask import Flask
from flask import jsonify
from flask import make_response
from flask.ext.cors import CORS
from werkzeug.contrib.fixers import ProxyFix
from werkzeug.routing import BaseConverter

from flask import redirect
from flask import abort
from flask import request
from flask import session
from flask import render_template


from init import app

CORS(app)
app.secret_key = 'flask_flask_demo_server'

import tlib.log as log
import tlib.conf as conf
import tlib.auto as auto
from template import *

from service import DataService

data_service= DataService()

USER_LISTS = ['yizhong.wyz', 'syr99979', 'jingcheng.lijc', 'chaiou.tj']

class RegexConverter(BaseConverter):
    def __init__(self, url_map, *items):
        super(RegexConverter, self).__init__(url_map)
        self.regex = items[0]

app.url_map.converters['regex'] = RegexConverter

def __resp(ret, code=200):
    # response = make_response(jsonify(ret), code)
    response = make_response(json.dumps(ret), code)
    # response.headers['Access-Control-Allow-Origin'] = 'http://flask_flask_demo.proxy.taobao.org'
    # response.headers['Access-Control-Max-Age'] = 60
    # response.headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS,PUT,DELETE'
    # response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

def __get_user():
    return session['username'] if session.has_key('username') else ''

def __get_current_url():
    return request.url

@app.before_request
def before_request():
    buc_sso_url = 'http://search-tools.yisou.com/buc_sso/index.php'
    data = request.args.to_dict()
    current_url =  __get_current_url()
    if not session.has_key('username'):
        session['username'] = ''
    log.info('current_url: %s, current_user: %s' % (current_url, __get_user()))
    if 'localhost' not in current_url and '/pic' not in current_url:
        if session.has_key('user_info'):
            #log.info('Session has user_info')
            pass
        elif data.has_key('user_info'):
            if base64.b64decode(data.get('user_info')) == 'false':
                log.info('Data user_info = False')
                session.clear
                log.info('redirect: %s' % request.base_url)
                return redirect(buc_sso_url + '?referer=' + base64.b64encode(request.base_url))
            else:
                log.info('Data user_info is ok')
                user_info =  json.loads(base64.b64decode(data.get('user_info')))
                session['user_info'] = json.dumps(user_info)
                session['username'] = user_info['emailPrefix']
                pos = current_url.rfind('user_info')
                print current_url[0:pos-1]
                return redirect(current_url[0:pos-1])
        else:
            log.info('Buc not login')
            return redirect(buc_sso_url + '?referer=' + base64.b64encode(current_url))
            pass

@app.after_request
def after_request(response):
    if session.has_key('user_info'):
        response.set_cookie('user_info', session['user_info'])
    if session.has_key('username'):
        response.set_cookie('username', session['username'])
    return response

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/cm_tool/get_cluster_example')
def get_cluster_example():
    ret = {'message': '', 'code': 200, 'data': ''}
    global CLUSTER_EXAMPLE
    ret['data'] = CLUSTER_EXAMPLE
    return __resp(ret)


def __check_auth():
    '''
    check_auth
    '''
    global USER_LISTS
    cuser = __get_user()
    log.info("user_name:%s" % cuser)
    if cuser not in USER_LISTS:
        return False
    else:
        return True

@app.route('/cm_tool/del_cluster/<cm_name>')
def del_cluster(cm_name):
    '''delcluster'''
    ret = {'message': '', 'code': 200, 'data': ''}
    if not __check_auth():
        ret['message'] = 'Permissions are not allowed'
        ret['code'] = 403
        return __resp(ret)
    if cm_name == "":
        ret["code"] = 500
        ret["message"] = "cm_name is empty"
        return __resp(ret)
    cmd = '/home/admin/cm/bin/cm_ctrl -c delcluster -v %s -f /home/admin/cm/conf/cm_ctrl.cfg2' % cm_name
    log.info(cmd)
    try:
        out = auto.run("ssh admin@11.251.206.146 %s" % cmd)
        if out.status != 0:
            ret["code"] = 500
            ret['message'] = "delcluster fail"
            return __resp(ret)
    except Exception as e:
        log.error(e)
        ret['message'] = traceback.format_exc()
        ret['code'] = 500
        return __resp(ret)
    return __resp(ret)


@app.route('/cm_tool/set_cluster_cfg', methods=['POST'])
def set_cluster_cfg():
    '''setclustercfg'''
    ret = {'message': '', 'code': 200, 'data': ''}
    if not __check_auth():
        ret['message'] = 'Permissions are not allowed'
        ret['code'] = 403
        return __resp(ret)
    if not request.form or 'cluster_xml' not in request.form:
        abort(400)
    xml_file_name  = "%s.xml" % request.form["cm_name"] if 'cm_name' in request.form else 'cluster_test_%s.xml' % (int(time.time()))
    folder = "/home/admin/yizhong.wyz/"
    cluster_xml = request.form['cluster_xml']
    try:
        curr_path = os.path.dirname(__file__)
        if not os.path.exists("%s/temp" % curr_path):
            auto.run('mkdir -p %s/temp' % curr_path)
        curr_path += "/temp"
        log.info(curr_path)
        with open("%s/%s" %(curr_path, xml_file_name), 'w') as f:
            f.write(cluster_xml)
        out = auto.run('scp -r %s/%s admin@11.251.206.146:%s%s' % (curr_path, xml_file_name, folder, xml_file_name))
        if out.status != 0:
            ret["code"] = 500
            ret['message'] = 'save xml file fail'
            return __resp(ret)
        ####setclustercfg
        out = auto.run("ssh admin@11.251.206.146 /home/admin/cm/bin/cm_ctrl -c setclustercfg -v %s%s -f /home/admin/cm/conf/cm_ctrl.cfg2" % (folder, xml_file_name))
        if out.status != 0:
            ret["code"] = 500
            ret['message'] = 'setclustercfg fail'
            return __resp(ret)
    except Exception as e:
        log.error(e)
        ret['code'] = 500
        ret['message'] = traceback.format_exc()
        return __resp(ret)
    return __resp(ret)


@app.route('/cm_tool/build_cluster_xml', methods=['POST'])
def build_cluster_xml():
    '''buid cluster xml'''
    global CLUSTER_EXAMPLE
    global CLUSTER_HEAD
    global GROUP
    global CLUSTER_TAIL
    ret = {'message': '', 'code': 200, 'data': ''}
    if not request.form or 'cm_name' not in request.form or 'targets' not in request.form:
        abort(400)
    cm_name = request.form['cm_name']
    protocol = request.form['protocol'] if 'protocol' in request.form else 'http'
    group_num = request.form['group_num'] if 'group_num' in request.form else 1
    targets = request.form['targets']
    log.info(cm_name)
    log.info(protocol)
    import re
    targets  = re.split(r"\s*,\s*", targets.strip())
    cluster_body = ""
    j = 0
    cm_name = "%s_%s_" % (cm_name, protocol) 
    cm_name += ",".join(targets)
    for target in targets:
        try:
            ip, port = target.split(":")
            for i in range(5):
                tmp = GROUP % (j*5+i, ip, protocol, port, i+1)
                cluster_body += tmp
        except Exception as e:
            log.error(e)
            ret['data'] = CLUSTER_EXAMPLE
            return __resp(ret)
        j += 1
    head = CLUSTER_HEAD % cm_name
    ret['data'] = {"cm_name": cm_name, "cluster_xml": "%s%s%s" % (head, cluster_body, CLUSTER_TAIL)}
    log.info(ret['data'])
    return __resp(ret)
    

@app.route('/cm_tool/get_all_cluster')
def get_all_cluster():
    '''获取所有的cluster'''
    ret = {'message': '', 'code': 200, 'data': ''}
    try:
        out = auto.run('ssh admin@11.251.206.146 /home/admin/cm/bin/cm_ctrl -c getallcluster  -v 0 -f /home/admin/cm/conf/cm_ctrl.cfg2')
        if out.status != 0:
            ret['message'] = 'getallcluster fail'
            ret['code'] = 500
            return __resp(ret)
        lines = out.stdout.lines
        all_clusters = lines[1].strip("\n").split()
        all_clusters = all_clusters[1:]
        tmp_list = [{"name": x} for x in all_clusters] 
        ret["data"] =  tmp_list
    except Exception as e:
        log.error(str(e))
        ret['message'] = traceback.format_exc()
        ret["code"] = 500
    return __resp(ret)


@app.route('/cm_tool/get_cluster_cfg/<cluster_name>')
def get_cluster_cfg(cluster_name):
    '''getclustercfg'''
    ret = {'message': '', 'code': 200, 'data': ''}
    try:
        out = auto.run('ssh admin@11.251.206.146 /home/admin/cm/bin/cm_ctrl -c getclustercfg -v "%s" -f /home/admin/cm/conf/cm_ctrl.cfg2' % cluster_name)
        if out.status != 0:
            ret["code"] = 500
            ret["message"] = "getclustercfg fail"
            return __resp(ret)
        data = out.stdout
        ret['data'] = data
    except Exception as e:
        log.error(str(e))
        ret["code"] = 500
        ret["message"] = traceback.format_exc()
    return __resp(ret)


@app.route('/cm_tool/data/<offset>/<limit>')
def list_by_offset_limit(offset, limit):
    ret = {'message': '', 'code': 200, 'data': ''}
    try:
        data = data_service.list(offset, limit)
        total = data_service.count()
        ret['data'] = {'total':total, 'data': data}
        print ret
    except:
        error_msg = traceback.format_exc()
        log.error(error_msg)
        ret['code'] = 500
        ret['message'] = error_msg
    return __resp(ret)

@app.route('/cm_tool/data', methods=['POST'])
def post_data():
    log.info('post_data')
    ret = {'message': '', 'code': 200, 'data': ''}
    if not request.form or not 'action' in request.form:
        abort(400)

    action = request.form['action']
    cuser = __get_user()
    submit_data = request.form.to_dict()
    if action == 'add':
        if 'name' not in request.form and not request.form['name']:
            abort(400)
        try:
            name = request.form['name']
            data = request.form['data'] if 'data' in request.form else ''
            cuser = cuser
            uuser = cuser
            submit_data = {
                'name': name,
                'cuser': cuser,
                'uuser': uuser,
                'data': data
            }
            id = data_service.add(submit_data)
            ret['data'] = id
        except:
            error_msg = traceback.format_exc()
            log.error(error_msg)
            ret['code'] = 500
            ret['message'] = error_msg
    
    elif action == 'update':
        if 'id' not in request.form:
            abort(400)
        try:
            id = submit_data['id']
            submit_data['uuser'] = __get_user()
            data_service.update(id, submit_data)
        except:
            error_msg = traceback.format_exc()
            log.error(error_msg)
            ret['code'] = 500
            ret['message'] = error_msg

    elif action == 'del':
        try:
            id = submit_data['id']
            data_service.delete(id)
        except:
            error_msg = traceback.format_exc()
            log.error(error_msg)
            ret['code'] = 500
            ret['message'] = error_msg

    else:
        error_msg = 'action not in [add, update, del]'
        log.error(error_msg)
        ret['code'] = 500
        ret['message'] = error_msg

    return __resp(ret)

@app.errorhandler(404)
def not_found(error):
    return __resp({'message': 'Not found', 'code': 404, 'data': ''}, 404)
    #return render_template('index.html')

app.wsgi_app = ProxyFix(app.wsgi_app)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(conf.get('port')), debug=True)
