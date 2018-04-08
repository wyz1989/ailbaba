# -*- coding:utf-8 -*-

import sys
import json
import urllib
import urllib2
import requests
import random
import time
import datetime
import traceback

import tlib.log as log
import tlib.auto as auto
import tlib.conf as conf
from tlib.path import Path
from tlib.path import curr_path
from tlib.path import home_path
from tlib.mail_sender import send_mail

from meta import Data

reload(sys)
sys.setdefaultencoding('utf-8')

class BaseService(object):
    def __init__(self, model):
        self.model = model
     
    def list(self, offset=0, limit=100):
        return self.model.list(offset, limit)
    
    def listAll(self):
        return self.model.listAll()

    def get(self, pk):
        return self.model.get(pk)

    def select(self, pk):
        return self.model.get(pk)
    
    def add(self, submit_data):
        return self.model.add(submit_data)
    
    def update(self, pk, submit_data):
        submit_data["utime"] = datetime.datetime.now()
        self.model.update(pk, submit_data)
    
    def delete(self, pk):
        self.model.delete(pk)

    def count(self):
        return self.model.count()

class DataService(BaseService):
    def __init__(self):
        BaseService.__init__(self, Data)
