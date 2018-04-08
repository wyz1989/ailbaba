import {request, post, get} from '../utils/request';

import { message } from 'antd';

let base_url = 'http://cm_tool.proxy.taobao.org/cm_tool';
//base_url = '/flask_demo';

//souce
export async function addData(params) {
  return post(base_url + '/data', {...params, action: 'add'});
}
export async function delData(id) {
  return post(base_url + '/data', {'id': id, action: 'del'});
}
export async function modifyData(params) {
  return post(base_url + '/data', {...params, action: 'update'});
}
export async function listData(offset, limit) {
  return get(base_url + '/data/'+ offset + '/' + limit);
}
export async function getAllCluster()
{
  return get(base_url + '/get_all_cluster');
}
export async function getClusterCfg(name)
{
  return get(base_url + '/get_cluster_cfg/' + name);
}
export async function setClusterCfg(params)
{
  return post(base_url + '/set_cluster_cfg', {...params});
}
export async function buildClusterXml(params)
{
  return post(base_url + '/build_cluster_xml', {...params});
}
export async function delCluster(name)
{
  return get(base_url + "/del_cluster/" + name);
}