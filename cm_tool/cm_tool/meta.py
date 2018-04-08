# -*- coding:utf-8 -*-

import json
import time
import datetime
import traceback

from flask.ext.sqlalchemy import SQLAlchemy
from sqlalchemy import func
from sqlalchemy.orm.attributes import InstrumentedAttribute

from init import app

db = SQLAlchemy(app)

class BaseModel(object):
    def __init__(self, json_dict):
        for k,v in filter(lambda x: x[0] not in [], json_dict.items()):
            setattr(self, k, v)
    
    def to_dict(self):
        data_dict = {}
        for col in self.__table__.columns.items():
            k = col[0]
            t = col[1].type
            if str(t) == "DATETIME":
                data_dict[k] = self.__getattribute__(k) if str(t) <> "DATETIME" else self.__getattribute__(k).strftime("%Y-%m-%d %H:%M:%S")
            elif str(t) == "BOOLEAN":
                data_dict[k] = self.__getattribute__(k)
            else:
                data_dict[k] = self.__getattribute__(k) if self.__getattribute__(k) else ""
        return data_dict

    def save(self):
        db.session.add(self)
        try:
            db.session.commit()
        except:
            print "save: commit error"
            print traceback.format_exc()
            #db.session.rollback()
            db.session.close()
            return ""
        if "id" in dir(self):
            return self.id
        elif "name" in dir(self):
            return self.name
        return ""
     
    def delete(self):
        try:
            db.session.delete(self)
            db.session.commit()
        except:
            print "delete: commit error"
            print traceback.format_exc()
            db.session.close()
    
    def update(self, json_dict):
        for k,v in filter(lambda x: x[0] not in ["id","cuser", "ctime"], json_dict.items()):
            setattr(self, k, v)
        self.save()

    @classmethod
    def select(cls, id):
        return cls.query.get(id)

    @classmethod
    def get(cls, id):
        ins = cls.query.get(id) 
        return ins.to_dict() if ins else {}

    @classmethod
    def list(cls, offset=0, limit=100):
        return [s.to_dict() for s in cls.query.offset(offset).limit(limit)]

    @classmethod
    def listAll(cls):
        return [s.to_dict() for s in cls.query.all()]
    
    @classmethod
    def count(cls):
        return cls.query.count()

    @classmethod
    def add(cls, submit_data):
        ins = cls(submit_data)
        try:
            db.session.add(ins)
            db.session.commit()
        except:
            print "add: commit error"
            print traceback.format_exc()
            db.session.close()
        if "id" in dir(cls):
            return ins.id
        elif "name" in dir(cls):
            return ins.name
        return ""

    @classmethod
    def delete(cls, id):
        try:
            db.session.delete(cls.query.get(id))
            db.session.commit()
        except:
            print "delete: commit error"
            print traceback.format_exc()
            db.session.close()

    @classmethod
    def update(cls, id, json_dict):
        ins = cls.query.get(id)
        for k,v in filter(lambda x: x[0] not in ["id"],json_dict.items()):
            setattr(ins, k, v)
        ins.save()

class Data(db.Model, BaseModel):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(500))
    data = db.Column(db.Text)
    cuser = db.Column(db.String(50))
    ctime = db.Column(db.DateTime, default=datetime.datetime.now)
    uuser = db.Column(db.String(50))
    utime = db.Column(db.DateTime, default=datetime.datetime.now)
 
    def __init__(self, json_dict):
        BaseModel.__init__(self, json_dict)

if __name__ == "__main__":
    db.drop_all()
    db.create_all()
    pass
