import React from 'react';
import { browserHistory  } from 'react-router';
import { Menu, Breadcrumb, Icon, Input, Button, Card, Row, Col,
   Table, Popconfirm, message, Tooltip, Select } from 'antd';
import cookie from 'js-cookie';

import Layout from './../Layout/Layout';
import DataFormModal from './DataFormModal';
import AddClusterModal from './AddClusterModal';
import DataModal from './DataModal';
import * as service from './../../services/service';
import './../common.css';

const ClusterList  = React.createClass({
  getInitialState(){
    return {
      data_list: [],
      search_key: '',
      addModalVisible: false,
      editModalVisible: false,
      target: {id: '', data: '', name: ''},
      loading: true,
      pagination: {
        defaultCurrent: 1,
        current: 1,
        total: 0,
        pageSize: 20,
        showQuickJumper: true,
        showSizeChanger: true,
      }
    };
  },
  search(e){
    console.log('searching...');
    this.setState({search_key: e.target.value.toLowerCase()});
  },
  getClusterCfg(name, target, flag)
  {
      //获取制定的cm数据
    service.getClusterCfg(name).then(
      function({success, data, msg})
      {
        if(data.code == 200)
        {
          //target.data = data.data;
          var key={...target,data:data.data};
          console.log(this)
          this.setState({target:key});
          if(flag){
            this.setState({viewDataModalVisible: true})
          }
          else{
            this.setState({editModalVisible: true});
          }
        }
        else
        {
          message.error(data.message, 5);
        }
      }.bind(this)
    );
  },
  getAllCluster(offset, limit){
    this.setState({loading: true});
    service.getAllCluster(offset, limit).then(
      function({success, data, msg}){
        if(data.code==200){
          this.setState({
            data_list: data.data,
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
    this.getAllCluster(this.state.pagination.pageSize*(this.state.pagination.current-1), this.state.pagination.pageSize);
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
  setClusterCfg(params){
    service.setClusterCfg(params).then(
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
  delCluster(name){
    service.delCluster(name).then(
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
    //this.state.target = target;
    //this.setState({editModalVisible: true});
    this.getClusterCfg(target.name, target, 0);
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
      console.log(values.name);
      var params = {cm_name: values.name, cluster_xml: values.data};
      console.log(params);
      this.setClusterCfg(params);
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
      var params = {cm_name: values.name, cluster_xml: values.data}
      console.log('Received values of EditData form: ', params);
      this.setClusterCfg(params);
      form.resetFields();
      this.setState({ editModalVisible: false });
      this.flushDataList();
    });
  },
  saveAddFormRef(form) {
    this.addForm = form;
  },
  onShowViewModal(target){
    //1 查看
    //0 修改
    this.getClusterCfg(target.name, target, 1);
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
  buildClusterXml(params)
  {
    service.buildClusterXml(params).then(
      function({success, data, msg}){
        if(data.code == 200)
        {
          console.log(data.data);
          this.addForm.setFieldsValue({data: data.data.cluster_xml, name: data.data.cm_name});
        }
        else{
          message.error(data.message, 5);
        }
      }.bind(this)
    );
  },
  handleClick(){
    var protocol =  this.addForm.getFieldValue("protocol");
    var name = this.addForm.getFieldValue("name");
    var group_name = this.addForm.getFieldValue("group_name");
    var targets = this.addForm.getFieldValue("targets");
    if(targets == "" || name == "")
    {
      return;
    }
    var post_data = {cm_name: name, protocol:protocol, group_name: group_name, targets: targets};
    this.buildClusterXml(post_data);

  },
  render(){
    const columns=[{
      title: '名字',
      dataIndex: 'name',
      key: 'name',
      className: 'table-row',
    },{
      title: '操作',
      key: 'operation',
      className: 'table-row',
      render: (text, record) => (
        <p>
          <a onClick={() => this.onShowViewModal(record)}>查看</a>
          &nbsp;&nbsp;
          <a onClick={() => this.onShowEditDataModal(record)}>修改</a>
          &nbsp;&nbsp;
          <Popconfirm title='确定要删除吗？' onConfirm={() => this.delCluster(record.name)}>
            <a>删除</a>
          </Popconfirm>
        </p>
      )
    }];
    const search_key = this.state.search_key;
    var data_list = [];
    if(search_key != '')
    {
      data_list = this.state.data_list.filter((data)=>{
        let name = data.name.toLowerCase();
        if(name.indexOf(search_key) > -1)
        {
          return true;
        }
        else{
          return false;
        }
      })
    }
    else{
      data_list = this.state.data_list;
    }
    const pagination = this.state.pagination;
    pagination.showTotal=(total) => `共${total}条`
    pagination.total = this.state.total;
    const table_props = {
      columns: columns,
      rowKey: 'id',
      size: 'small',
      dataSource: data_list,
      pagination: pagination,
      loading: this.state.loading,
      onChange: this.handleTableChange,
    };
    return (
      <Layout location='data'>
        <div c={{padding: '10px 25px 30px 25px'}}>
          <div>
            <Row style={{padding:'10px 5px'}}>
            <Input.Search 
                  type='text'
                  value={search_key}
                  style={{width: '200px', margin: '2px'}}
                  size='default'
                  onChange={this.search}
                  placeholder='忽略大小写匹配'
              />
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
              <AddClusterModal
                ref={this.saveAddFormRef}
                visible={this.state.addModalVisible}
                onCancel={this.onCancelAddData}
                onSubmit={this.onSubmitAddData}
                handleClick={this.handleClick}
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

export default ClusterList;
