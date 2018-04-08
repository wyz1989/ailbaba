#encoding:utf8
CLUSTER_EXAMPLE = '''
<?xml version="1.0"?>
<!-- 一个clustermap.xml下只能有一个cluster，有多个cluster，需要写多个文件 -->
<clustermap>
    <cluster name="ali_baike_qa" topo_type="one_map_one" check_type="keep_online">
        <group id="0">
            <node ip="11.251.208.195" proto_port="http:8666|tcp:8701" idc_type="8" meta_info="weight:1|max_fails:5|fail_timeout:10000" />
        </group>
        <group id="1">
            <node ip="11.251.208.195" proto_port="http:8666|tcp:8702" idc_type="8" meta_info="weight:1|max_fails:5|fail_timeout:10000" />
        </group>
        <group id="2">
            <node ip="11.251.208.195" proto_port="http:8666|tcp:8703" idc_type="8" meta_info="weight:1|max_fails:5|fail_timeout:10000" />
        </group>
        <group id="3">
            <node ip="11.251.208.195" proto_port="http:8666|tcp:8704" idc_type="8" meta_info="weight:1|max_fails:5|fail_timeout:10000" />
        </group>
        <group id="4">
            <node ip="11.251.208.195" proto_port="http:8666|tcp:8705" idc_type="8" meta_info="weight:1|max_fails:5|fail_timeout:10000" />
        </group>
    </cluster>
</clustermap>
'''


CLUSTER_HEAD = '''
<?xml version="1.0"?>
<!-- 一个clustermap.xml下只能有一个cluster，有多个cluster，需要写多个文件 -->
<clustermap>
    <cluster name="%s" topo_type="one_map_one" check_type="keep_online">
'''


GROUP = '''
        <group id="%s">
            <node ip="%s" proto_port="%s:%s|tcp:870%s" idc_type="8" meta_info="weight:1|max_fails:5|fail_timeout:10000" />
        </group>
'''

CLUSTER_TAIL = '''
    </cluster>
</clustermap>
'''
