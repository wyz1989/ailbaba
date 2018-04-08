import fetch from 'dva/fetch';
import cookie from 'js-cookie';
import { message} from 'antd'

function parseJSON(response) {
  try {
    return response.json();
  } catch(e) {
    message.error('parse server response error.')
    return Promise.reject(errorMessages(response));
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  message.error('Server interval error, retry later.');
  return Promise.reject(errorMessages(response));
  /*const error = new Error(response.statusText);
  error.response = response;
  throw error;*/
}

function request(url, options) {
  const current_url = location.href

  const opts = {
    ...options,
  };
  if (current_url.indexOf('localhost')==-1){
    opts['credentials'] = 'include';
  }
  return fetch(url, opts)
    .then(checkStatus)
    .then(parseJSON)
    .then((data) => ({ data }))
    .catch((err) => ({ err }));
}

function post(url, data) {
  let data_list = []
  for(let k in data){
    data_list.push(k + '=' + encodeURIComponent(data[k]) )
  }
  data = data_list.join('&')
  const options = {};
  options.method = 'POST';
  console.log(data);
  options.body = data;
  options.headers = {
    ...options.headers,
    'Content-Type': 'application/x-www-form-urlencoded',
  }
  return request(url, options);
}
function get(url) {
  return request(url);
}
export default {request, post, get};
