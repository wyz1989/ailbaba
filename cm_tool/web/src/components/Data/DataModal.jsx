import React from 'react';
import {Icon, Button, Row, Col, Modal} from 'antd';

const DataModal = (props) => {
  const default_target = {
    id: '', data: '', _type: '',
    group:'', ip: '', desc: '',
    cuser: '', ctime: ''
  };
  const { visible, onCancel, target=default_target} = props;
  return (
    <Modal
      visible={visible}
      title='查看cluster'
      onCancel={onCancel}
      footer=''
      width='80%'
    >
      <Row style={{padding: '5px'}}>
        <Col span={2}>name:</Col>
        <Col span={10}>{target.name}</Col>
      </Row>
      <Row style={{padding: '5px'}}>
        <Col span={2}>Data:</Col>
        <Col span={22}><pre>{target.data}</pre></Col>
      </Row>
    </Modal>
  );
}
export default DataModal;
