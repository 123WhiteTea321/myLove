import { Link } from 'react-router-dom'
import { Card, Breadcrumb, Form, Button, Radio, DatePicker, Select, Table, Tag, Space } from 'antd'
import moment from 'moment';
import 'moment/locale/zh-cn'
import locale from 'antd/es/date-picker/locale/zh_CN'
import './index.scss'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import img404 from '../../assets/error.png'
import { useEffect, useState } from 'react';
import { http } from '@/utils';
import { useStore } from '@/store';
// import { makeAutoObservable, observable } from 'mobx';
import { observer } from 'mobx-react';  //必须是小写的o
import { useNavigate } from 'react-router-dom';
moment.locale('zh-cn');

const { Option } = Select
const { RangePicker } = DatePicker




const Article = () => {

    // // 频道列表管理（常态法）
    // // 盒子
    // const [channelList, setChannels] = useState([])   // []就是channelList的初始值
    // // 获取频道列表数据
    // // 往盒子里面赋值
    // useEffect(() => {
    //     async function fetchChannels() {
    //         const res = await http.get('/channels')
    //         console.log("res", res)
    //         setChannels(res.data.channels)   //setChannels(括号里面的值就是channelList)
    //     }
    //     fetchChannels()
    // }, [])

    //频道列表管理(mobx状态管理法)    错误示范，那边公共部分首页layout已经发起过请求了,没必要多此一举
    // const {ChannelStore}=useStore()
    // useEffect(()=>{
    //     ChannelStore.fetchChannels()
    // },[ ChannelStore])

    // 频道列表管理(mobx状态管理法) 
    const { ChannelStore } = useStore()   //这里是因为layout已经发起过请求了才能用吗
    console.log("ChannelStore.channelList",ChannelStore.channelList)
    console.log(typeof(ChannelStore.channelList))   //object,怎么成对象了？之前在useEffect里都还是数组啊，自己在channelstore定义成对象了




    // 文章列表管理
    const [list, setList] = useState({
        list: [],
        count: 0
    })
    // 文章参数管理,用于下面请求传参的，不参与渲染
    const [params, setParams] = useState({
        page: 1,
        per_page: 10
    })
    // useEffect实现响应式，[params]变化会引起重新申请
    useEffect(() => {
        const loadList = async () => {
            const res = await http.get("/mp/articles", { params })
            console.log("12345", res)
            // 通过文章参数管理文章列表（页数page，每页作品数per_page）
            const { results, total_count } = res.data
            setList({
                list: results,   //返回的结果中只有results是数组 这里给list赋值了，可以拿去下面模板渲染数据了
                count: total_count
            })
        }
        loadList()
    }, [params])
    //  上面两个useEffect合起来写也行，实例如下：
    // useEffect(() => {
    //     const loadList = async () => {
    //         const res = await http.get("/mp/articles", { params })
    //         console.log("12345", res)
    //     }
    //     loadList()
    //     async function fetchChannels() {
    //         const res = await http.get('/channels')
    //         console.log("res", res)
    //         setChannels(res.data.channels)   //setChannels(括号里面的值就是channelList)
    //     }
    //     fetchChannels()
    // }, [params])


    // Form 处绑定一个onfinish，实现values获取表单内容
    const onFinish = (values) => {
        console.log("values", values)  //没有打印？？？要操作表格之后点击筛选有显示
        // 先解构出来
        const { channel_id, date, status } = values
        // 弄一个盒子
        const _params = {}
        // 
        if (channel_id) {
            _params.channel_id = channel_id
        }
        if (date) {
            _params.begin_pubdate = date[0].format('YYYY-MM-DD')
            _params.end_pubdate = date[1].format('YYYY-MM-DD')
        }
        // if(status){
        _params.status = status
        // }
        setParams({
            ...params,
            ..._params
        })
    }
    // 切换页数引起跳转
    const pageChange = (page) => {
        // 拿到当前页参数 修改params 引起接口更新
        setParams({
            ...params,
            page
        })
    }
    // 删除数据
    const delData = async (data) => {
        console.log("data",data)
        //增删改查一般都有接口的
        await http.delete(`/mp/articles/${data.id}`)
        // 更新列表
        setParams({
            page: 1,
            per_page: 10
        })
    }
    // 点击跳转编辑
    const navigate=useNavigate()
    const jumpToEdit=async (data)=>{
        navigate(`/publish?id=${data.id}`)
        console.log("data",data)
    }  


    const columns = [
        {
            title: '封面',
            dataIndex: 'cover',
            width: 120,
            render: cover => {
                return <img src={cover || img404} width={80} height={60} alt="" />
            }
        },
        {
            title: '标题',
            dataIndex: 'title',
            width: 220
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: data => <Tag color="green">审核通过</Tag>
        },
        {
            title: '发布时间',
            dataIndex: 'pubdate'
        },
        {
            title: '阅读数',
            dataIndex: 'read_count'
        },
        {
            title: '评论数',
            dataIndex: 'comment_count'
        },
        {
            title: '点赞数',
            dataIndex: 'like_count'
        },
        {
            title: '操作',
            render: data => {
                return (
                    <Space size="middle">
                        <Button type="primary" shape="circle" icon={<EditOutlined onClick={()=>jumpToEdit(data)}/>} />
                        <Button
                            type="primary"
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            onClick={() => delData(data)}    //这里的data是render传的
                        />
                    </Space>
                )
            }
        }
    ]
    // 假数据
    // const data = [
    //     {
    //         id: '8218',
    //         comment_count: 0,
    //         cover: {
    //             images: ['http://geek.itheima.net/resources/images/15.jpg'],
    //         },
    //         like_count: 0,
    //         pubdate: '2019-03-11 09:00:00',
    //         read_count: 2,
    //         status: 2,
    //         title: 'wkwebview离线化加载h5资源解决方案'
    //     }
    // ]
    return (
        <div>
            {/* 筛选列表 */}
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>内容管理</Breadcrumb.Item>
                    </Breadcrumb>
                }
                style={{ marginBottom: 20 }}
            >
                <Form onFinish={onFinish} initialValues={{ status: null }} >
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            <Radio value={null}>全部</Radio>
                            <Radio value={0}>草稿</Radio>
                            <Radio value={1}>待审核</Radio>
                            <Radio value={2}>审核通过</Radio>
                            <Radio value={3}>审核失败</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="频道" name="channel_id">
                        <Select
                            placeholder="请选择文章频道"
                            style={{ width: 120 }}
                        >
                            {/* 方法1 */}
                            {/* {channelList.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))} */}
                            {/* 方法2错误示范:fetchChannels() */}
                            {/* {ChannelStore.fetchChannels().map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))} */}
                            {/* 方法3：*/}
                            {ChannelStore.channelList.map(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))}
                            {/* {Object.keys(ChannelStore.channelList).forEach(item => (<Option key={item.id} value={item.id}>{item.name}</Option>))} */}
                        </Select>
                    </Form.Item>

                    <Form.Item label="日期" name="date">
                        {/* 传入locale属性 控制中文显示*/}
                        <RangePicker locale={locale}></RangePicker>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            {/* 文章列表 */}
            <Card title={`根据筛选条件共查询到 ${list.count} 条结果：`}>
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={list.list}
                    pagination={{
                        position: ['bottomCenter'],
                        current: params.page,
                        pageSize: params.per_page,
                        onChange: pageChange
                    }}
                />
            </Card>
        </div>
    )
}

export default observer(Article)