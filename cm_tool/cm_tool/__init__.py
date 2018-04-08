#!/home/tops/bin/python
#-*- coding:utf-8 -*-

import re
import sys
import glob
import json
import getpass
from string import Template

reload(sys)
sys.setdefaultencoding('utf-8')

import tlib.log as log
import tlib.conf as conf
import tlib.auto as auto
import tlib.xconf as xconf
import tlib.local as local
from tlib.path import Path
from tlib.path import curr_path
from tlib.path import home_path


def do_initdep():
    auto.run("sudo yum install -y MySQL-shared-compat -b test").status
    auto.run("sudo yum install -y tops-python27-mysqldb").status
    auto.run("sudo yum install -y tops-python27-supervisor3").status

def do_initproject():
    local_path = Path.getcwd() / "demo"
    #curr_path().copytree(local_path)
    user = getpass.getuser()
    supervisord = Template((local_path / "supervisord.conf.tpl").text()).safe_substitute({"local_path": local_path, "user": user})
    (local_path / "supervisord.conf").write_text(supervisord)
    #auto.run("/usr/bin/sudo ln -s %s static" % conf.get("base.runtime"), cwd=local_path)
    #xconf.write(local_path / "conf/local.conf", "local", static_url=("http://%s:%s/static/" % (local.get_ip(), conf.get("port"))))

def pwd_check():
    if Path.getcwd().name <> "demo" or not (Path.getcwd() / "meta.py").exists():
        log.warn("Subcommands need to be run in the demo directory")
        sys.exit(1)

def do_initworker():
    pwd_check()
    print auto.run("/home/tops/bin/supervisord -c %s/supervisord.conf" % Path.getcwd())

def do_start():
    pwd_check()
    print auto.run("/home/tops/bin/supervisorctl start demo")

def do_stop():
    pwd_check()
    print auto.run("/home/tops/bin/supervisorctl stop demo")

def do_status():
    pwd_check()
    print auto.run("/home/tops/bin/supervisorctl status demo")

def run():
    # cmds = [i[3:] for i in filter(lambda x: x.startswith("do_"), globals().keys())]
    cmds = ['initdep', 'initproject', 'initworker', 'start', 'stop', 'status']
    cmd = sys.argv[1] if len(sys.argv) > 1 else ""
    if cmd in cmds:
        log.info("Execute cmd:%s" % cmd)
        globals()["do_" + cmd]()
        log.info("Execute cmd:%s done" % cmd)
    else:
        log.info("Available subcommands::\n%s" % "\n".join(cmds))
