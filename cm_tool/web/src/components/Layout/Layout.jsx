import React from 'react';
import { Link } from 'react-router';
import { Menu, Breadcrumb, Icon, Row, Col, BackTop} from 'antd';
import cookie from 'js-cookie';

import './../common.css';

const Layout  = React.createClass({
  render(){

    return (
      <div>
        <div className='layout-header' >
          <Row>
            <Col span='18' style={{'borderBottom': '1px solid #e9e9e9'}}>
              <div className='layout-header-title'>
                <span id='xMetric' className='layout-header-title-main'><Link to='/'>CMTool</Link></span>
                <span className='layout-header-title-sub'><Link to='/'> | cm管理平台</Link></span>
              </div>
              <div className='layout-header-menu'>
                <Menu
                  mode='horizontal'
                  onClick={this.props.handleHeaderMenuClick}
                  selectedKeys={[this.props.location]}
                  style={{backgroundColor: '#336699', color: 'white'}}
                >
                  <Menu.Item key='data' style={{color: 'white', backgroundColor: (this.props.location!='data')||'#2e5c8a'}}><span>数据管理</span></Menu.Item>
                </Menu>
              </div>
            </Col>
            <Col span='6' style={{'borderBottom': '1px solid #e9e9e9'}}>
              <div className='layout-header-menu' style={{float: 'right'}}>
                <Menu mode='horizontal'
                  style={{backgroundColor: '#336699', color: 'white'}}
                >
                  <Menu.Item style={{padding: 0}}><a href='http://sm.cn' target='_blank' style={{color: 'white'}}><Icon type='question-circle-o' />帮助</a></Menu.Item>
                  <Menu.SubMenu title={(<div><span style={{paddingRight: '10px', color: 'white'}}>{cookie.get('username') || '匿名用户'}</span><Icon type='setting' style={{color: 'white'}}/></div>)}>
                    <Menu.Item key='xonline'><Link to='http://xonline.alibaba-inc.com' style={{color: '#666'}}>XOnline</Link></Menu.Item>
                    <Menu.Item key='xcase'><Link to='http://xcase.alibaba-inc.com' style={{color: '#666'}}>XCase</Link></Menu.Item>
                  </Menu.SubMenu>
                </Menu>
              </div>
            </Col>
          </Row>
        </div>
        <div className='layout-body'>
          {this.props.children}
        </div>
        <div className='layout-footer'>
          cmtool by 王义忠 @ 2018
        </div>
        <BackTop />
      </div>
    );
  }
});

export default Layout;
