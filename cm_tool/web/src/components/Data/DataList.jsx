import React from 'react';
import { browserHistory  } from 'react-router';
import { Menu, Breadcrumb, Icon, Input, Button, Card, Row, Col,
   Table, Popconfirm, message, Tooltip, Select } from 'antd';
import cookie from 'js-cookie';

import Layout from './../Layout/Layout';
import DataFormModal from './DataFormModal';
import DataModal from './DataModal';
import * as service from './../../services/service';
import './../common.css';

const DataList  = React.createClass({
  getInitialState(){
    return {
      data_list: [],
      addModalVisible: false,
      editModalVisible: false,
      target: {id: '', data: '', name: ''},
      loading: true,
      pagination: {
        defaultCurrent: 1,
        current: 1,
        total: 0,
        pageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
      }
    };
  },
  listData(offset, limit){
    this.setState({loading: true});
    service.listData(offset, limit).then(
      function({success, data, msg}){
        if(data.code==200){
          this.setState({
            data_list: data.data.data,
            total: data.data.total,
            loading: false,
            editModalVisible: false,
            addModalVisible: false,
          })
        } else {
          message.error(data.message, 5);
        }
      }.bind(this)
    );
  },
  flushDataList(){
    this.listData(this.state.pagination.pageSize*(this.state.pagination.current-1), this.state.pagination.pageSize);
  },
  addData(params){
    service.addData(params).then(
      function({success, data, msg}){
        if(data.code==200){
          this.setState({addModalVisible: false})
          message.info('添加Data Data成功');
          this.flushDataList();
        } else {
          message.error(data.message, 5);
        }
      }.bind(this)
    );
  },
  modifyData(params){
    service.modifyData(params).then(
      function({success, data, msg}){
        if(data.code==200){
          this.setState({editModalVisible: false})
          message.info('修改成功');
          this.flushDataList();
        } else {
          message.error(data.message, 5);
        }
      }.bind(this)
    );
  },
  delData(id){
    service.delData(id).then(
      function({success, data, msg}){
        if(data.code==200){
          message.info('删除成功');
          this.flushDataList();
        } else {
          message.error(data.message, 5);
        }
      }.bind(this)
    );
  },
  onShowEditDataModal(target){
    this.state.target = target;
    this.setState({editModalVisible: true})
  },
  onCancelEditData(){
    this.setState({editModalVisible: false})
  },
  onSubmitEditData(){
    const form = this.editForm;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      values['id'] = this.state.target.id
      console.log('Received values of EditData form: ', values);
      this.modifyData(values);
      form.resetFields();
      this.setState({ editModalVisible: false });
    });
  },
  saveEditFormRef(form) {
    this.editForm = form;
  },
  onShowAddDataModal(){
    this.setState({addModalVisible: true})
  },
  onCancelAddData(){
    this.setState({addModalVisible: false})
  },
  onSubmitAddData(){
    const form = this.addForm;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log('Received values of EditData form: ', values);
      this.addData(values);
      form.resetFields();
      this.setState({ editModalVisible: false });
    });
  },
  saveAddFormRef(form) {
    this.addForm = form;
  },
  onShowViewModal(target){
    this.state.target = target;
    this.setState({viewDataModalVisible: true})
  },
  onCancelViewData(){
    this.setState({viewDataModalVisible: false})
  },
  componentWillMount(){
    this.flushDataList();
  },
  handleTableChange(pagination, filters, sorter){
    const pageSize = pagination.pageSize;
    const current = pagination.current;
    const pager = this.state.pagination;
    pager.current = current;
    pager.pageSize = pageSize;
    this.setState({
      pagination: pager,
    });
    //this.getDatasByType(this.state.data_type, pageSize*(current-1), pageSize);
    this.flushDataList();
  },
  render(){
    const columns=[{
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'table-row',
    }, {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: 'table-row',
    }, {
      title: 'Data',
      dataIndex: 'data',
      key: 'data',
      className: 'table-row',
    }, {
      title: 'CUser',
      dataIndex: 'cuser',
      key: 'cuser',
      className: 'table-row',
    }, {
      title: 'CTime',
      dataIndex: 'ctime',
      key: 'ctime',
      className: 'table-row',
    }, {
      title: 'UUser',
      dataIndex: 'uuser',
      key: 'uuser',
      className: 'table-row',
    }, {
      title: 'UTime',
      dataIndex: 'utime',
      key: 'utime',
      className: 'table-row',
    }, {
      title: '操作',
      key: 'operation',
      width: 120,
      className: 'table-row',
      render: (text, record) => (
        <p>
          <a onClick={() => this.onShowViewModal(record)}>查看</a>
          &nbsp;&nbsp;
          <a onClick={() => this.onShowEditDataModal(record)}>修改</a>
          &nbsp;&nbsp;
          <Popconfirm title='确定要删除吗？' onConfirm={() => this.delData(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </p>
      )
    }];
    const pagination = this.state.pagination;
    pagination.showTotal=(total) => `共${total}条`
    pagination.total = this.state.total;
    const table_props = {
      columns: columns,
      rowKey: 'id',
      size: 'small',
      dataSource: this.state.data_list,
      pagination: pagination,
      loading: this.state.loading,
      onChange: this.handleTableChange,
    };
    return (
      <Layout location='data'>
        <div c={{padding: '10px 25px 30px 25px'}}>
          <div>
            <Row style={{padding:'10px 5px'}}>
              <Button type='primary' style={{float: 'right'}} onClick={this.onShowAddDataModal}>添加</Button>
            </Row>
            <Row>
              <Table {...table_props}/>
              <DataFormModal
                ref={this.saveEditFormRef}
                visible={this.state.editModalVisible}
                onCancel={this.onCancelEditData}
                onSubmit={this.onSubmitEditData}
                target = {this.state.target}
              />
              <DataFormModal
                ref={this.saveAddFormRef}
                visible={this.state.addModalVisible}
                onCancel={this.onCancelAddData}
                onSubmit={this.onSubmitAddData}
              />
              <DataModal
                visible={this.state.viewDataModalVisible}
                target={this.state.target}
                onCancel={this.onCancelViewData}
              />
            </Row>
          </div>
        </div>
      </Layout>
    );
  }
});

export default DataList;
