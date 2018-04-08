import React from "react";
import { Menu, Breadcrumb, Icon, Input, Button, Card, Row, Col,
   message, Collapse, Modal, Form, Select } from "antd";

const AddClusterModal = Form.create()(
  (props) => {
    const default_target = {id: "", data: "", name: "", protocol: "http", group_num: 1, targets: ''};
    const { visible, onCancel, onSubmit, form , target=default_target,handleClick} = props;
    console.log(handleClick);
    const { getFieldDecorator } = form;
    let form_title = "修改 Data [" + target.name + "]";
    let is_modify = true;
    if(target.id==""){
      form_title="添加 CmCluster";
      is_modify = false;
    }
    return (
      <Modal
        visible={visible}
        title={form_title}
        okText="提交"
        onCancel={onCancel}
        onOk={onSubmit}
        width='80%'
      >
        <Form horizontal>
        <Row>
          <Col>
            <Form.Item label="name：" labelCol={{ span: 2 }} wrapperCol={{ span: 6 }} style={{marginBottom: "5px"}}>
            {getFieldDecorator("name", {initialValue :target.name})(<Input disabled={false}/>)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="protocol：" labelCol={{ span: 2 }} wrapperCol={{ span: 6 }} style={{marginBottom: "5px"}}>
            {getFieldDecorator("protocol", {initialValue :target.protocol})(<Input disabled={false}/>)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="group_num：" labelCol={{ span: 2 }} wrapperCol={{ span: 6 }} style={{marginBottom: "5px"}}>
            {getFieldDecorator("group_num", {initialValue :target.group_num})(<Input disabled={false}/>)}
            </Form.Item>
          </Col>
          <Col>
            <Form.Item label="targets：" labelCol={{ span: 2 }} wrapperCol={{ span: 16 }} style={{marginBottom: "5px"}}>
            {getFieldDecorator("targets", {initialValue :target.targets})(<div><Input disabled={false} style={{width:"80%"}}/><Button onClick={handleClick}>生成</Button></div>)}
            </Form.Item>
          </Col>
        </Row>
          <Form.Item label="Data：" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{marginBottom: "5px"}}>
            {getFieldDecorator("data", {initialValue :target.data, required: true})(<Input type="textarea" autosize={{minRows:15, maxRows:35}} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
export default AddClusterModal;
