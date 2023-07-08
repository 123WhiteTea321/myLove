import { Layout, Menu, Popconfirm,message } from 'antd'
import {
    HomeOutlined,
    DiffOutlined,
    EditOutlined,
    LogoutOutlined
} from '@ant-design/icons'
import './index.scss'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react';
import { useStore } from '../../store';
// import { useHistory } from 'react-router-dom';     将useHistory换成useNavigate了


const { Header, Sider } = Layout


const GeekLayout = () => {

    // 高亮。。。。。。。。。。。。。。。。。。
    const navigate = useNavigate();
    // 解构useLocation, 打印useLocation的实例化，会有一个pathname,即当前路径
    const { pathname } = useLocation()     //在哪里打印这个useLocation里的内容来着，直接在下面console.log打印
    console.log("useLocation", useLocation)

    // 右上角的用户名。。。。。。。。。。。。。。。。。。
    const { userStore,loginStore,ChannelStore } = useStore()     //把这行注释掉后报错：下面的userStore undefined。奇怪，userStore不是导入的useStore的一个属性吗
    console.log("useStore", useStore)   //没有内容
    console.log("userStore", userStore) //有内容
    useEffect(() => {
        userStore.getUserInfo()       //上面const {userStore} =useStore() 注释，这行不注释就会报错
        console.log(2222, useStore.userStore)    //undefined
        console.log(5555)
        // console.log(3333,useStore().userStore)  //报错信息：钩子只能在函数组件或自定义钩子中使用，而我们正试图在一个类中使用钩子？？
        console.log(4444)                       //上面报错，这行就打印不了
        ChannelStore.fetchChannels()
    }, [userStore,ChannelStore])
    // 下面这个也报错
    // const use=()=>{
    //     console.log("用户数据1",useStore.userStore)
    //     console.log("用户数据2",useStore().userStore)
    // }


    //退出功能 
    // const confirm = (e: React.MouseEvent<HTMLElement>) => {     
    //     // 退出登录 删除token  跳回到登录
    //     console.log(e);
    //     message.success('Click on Yes');
    // };
    const onLogout = () => {
        loginStore.loginOut()
        navigate('/login')
    }
    const cancel=()=>{
         console.log(11122)
    }

    return (
        // 为什么这里有个layout,布局？
        <Layout>
            <Header className="header">
                <div className="logo" />
                <div className="user-info">
                    <span className="user-name">{userStore.userInfo.name}</span>
                    <span className="user-logout">
                        <Popconfirm
                            title="是否确认退出？"
                            okText="退出"
                            cancelText="取消"
                            onConfirm={onLogout}
                            onCancel={cancel}
                        >
                            <LogoutOutlined /> 退出
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            {/* 这里为什么也有一个layout????  */}
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        theme="dark"
                        // 使菜单高亮项与当前路径匹配
                        defaultSelectedKeys={pathname}   //这里数组，字符串都可以
                        selectedKeys={pathname}          //点击返回键也能跟路径匹配
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item icon={<HomeOutlined />} key="/" onClick={() => { navigate('/') }}>
                            数据概览
                        </Menu.Item>
                        <Menu.Item icon={<DiffOutlined />} key="/article" onClick={() => { navigate('/article') }}>
                            内容管理
                        </Menu.Item>
                        <Menu.Item icon={<EditOutlined />} key="/publish" onClick={() => { navigate('/publish') }}>
                            发布文章
                        </Menu.Item>
                    </Menu>
                </Sider>
                {/* 这里呢？也有一个？ */}
                <Layout className="layout-content" style={{ padding: 20 }}>
                    {/* 二级路由出口，没有任何参数，怎么知道是哪个路由的出口，而且为什么放在这里？？？ */}
                    <Outlet></Outlet>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default observer(GeekLayout)