import multiprocessing

import tlib.conf as conf

bind='0.0.0.0:%s' % conf.get("port")
# workers=multiprocessing.cpu_count() * 2 + 1
# workers=multiprocessing.cpu_count()
workers=10
backlog=2048
worker_class="gevent"
debug=False
daemon=False
timeout=30
