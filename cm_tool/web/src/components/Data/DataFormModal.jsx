import React from "react";
import { Menu, Breadcrumb, Icon, Input, Button, Card, Row, Col,
   message, Collapse, Modal, Form, Select } from "antd";

const DataFormModal = Form.create()(
  (props) => {
    const default_target = {id: "", data: "", name: ""};
    const { visible, onCancel, onSubmit, form , target=default_target} = props;
    const { getFieldDecorator } = form;
    let form_title = "修改 Data [" + target.name + "]";
    let is_modify = true;
    if(target.id==""){
      form_title="添加 Data";
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
          <Form.Item label="name：" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{marginBottom: "5px"}}>
            {getFieldDecorator("name", {initialValue :target.name})(<Input disabled={false}/>)}
          </Form.Item>
          <Form.Item label="Data：" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} style={{marginBottom: "5px"}}>
            {getFieldDecorator("data", {initialValue :target.data, required: true})(<Input type="textarea" autosize={{minRows:15, maxRows:35}} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
);
export default DataFormModal;
