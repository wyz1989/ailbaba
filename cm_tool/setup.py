#!/usr/bin/env python
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.


from setuptools import setup, find_packages

setup(
    name='flask_demo',
    version='0.0.1',
    description='flask_demo',
    author='',
    author_email='@alibaba-inc.com',
    url='',
    packages=find_packages(),
    package_data = {'':['*.*']},
    include_package_data=True,
    zip_safe=False,
    install_requires=[
    'Werkzeug>=0.10.4',
    'Jinja2>=2.8',
    'Flask>=0.10.1',
    'gunicorn>=19.1.1',
    'eventlet>=0.16.1',
    'gevent>=1.0.1',
    'async>=0.6.2',
    'SQLAlchemy>=1.0.8',
    'Flask-SQLAlchemy>=2.0',
    'Flask-Cors>=2.1.0',
    'requests>=2.7.0',
    'tlib>=6.1.11',
    ],
    entry_points = {
        'console_scripts': [
            'flask_demo_admin = flask_demo:run',
        ]
    }
)
