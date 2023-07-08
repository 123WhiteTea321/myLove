import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store'
import { observer } from 'mobx-react'
import { useEffect, useState, ref, useRef } from 'react'   //怎么没有提示补全？？
import { http } from '@/utils'
import { type } from '@testing-library/user-event/dist/type'
const { Option } = Select

const Publish = () => {

  // 获取文章频道数据
  const { ChannelStore } = useStore()


  // 暂存图片列表实现
  // 1. 通过useRef创建一个暂存仓库，在上传完毕图片的时候把图片列表存入
  // 2. 如果是单图模式，就从仓库里取第一张图，以数组的形式存入fileList
  // 3. 如果是三图模式，就把仓库里所有的图片，以数组的形式存入fileList
  const cacheImgList = useRef()       //1.

  // 存放上传图片的列表（upload里面的）
  const [fileList, setFileList] = useState([])
  const onUploadChange = ({ fileList }) => {
    setFileList(fileList)
    // 在上传完毕图片的时候把图片列表存入仓库
    cacheImgList.current = fileList     //1.

  }

  // 使用
  // 切换图片数量
  const [imgCount, setImgCount] = useState(1)
  const changeImg = (e) => {
    console.log(e)
    setImgCount(e.target.value)
    // 2. 如果是单图模式，就从仓库里取第一张图，以数组的形式存入fileList
    // 3. 如果是三图模式，就把仓库里所有的图片，以数组的形式存入fileList
    // 点击切图时imgcount是不会变化的，用e.target.value能获取到真正的值
    if (cacheImgList.current && cacheImgList.current.length===0) {
      return false
    }
    if (cacheImgList.current && e.target.value === 1) {
      //  取图操作
      const img = cacheImgList.current[0]
      //  存入filelist
      setFileList([img])
    } else if (cacheImgList.current && e.target.value === 3)
      setFileList(cacheImgList.current)

  }
  // useEffect(()=>{      //useEffect是初次渲染时执行的，这里是渲染后的事情。试试看？或许可以呢
  //       setImgCount(imgCount)
  // },[ setImgCount])



  // 获取表单内容
  const navigate = useNavigate()
  const onfinish = async (values) => {
    console.log(values)
    // 为什么这里也是对象，因为缩进？？
    const { channel_id, content, title, type } = values
    // 参数明显是json格式，所以用对象
    const params = {
      channel_id, content, title, type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if(id){
      // 编辑
      await http.put(`/mp/articles/${id}?draft=false`,params)     //id是在下面用const定义的，这里也能用吗？
    }else{
      // 新增
      await http.post('/mp/articles?draft=false', params)
    }
    // 跳转到文章
    navigate("/article")
    message.success(`${id?'更新成功':'发布成功'}`)
  }

  // 适配文章
  // 获取地址
  const [params] = useSearchParams()
  console.log(params)
  // 获取地址id
  const id = params.get("id")
  console.log("id", id)  //id是undefined???


  // 数据回显: 1.表单回填   2.暂存列表   3.upload组件fileList
  const form = useRef(null)    //在下面Form绑定ref,这里才能用
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      // 表单回填，实例方法
      form.current.setFieldsValue({ ...res.data, type: res.data.cover.type })    //后面这个主要是为了回显照片时照片数量对的上
      //调用setFileList方法回填upload
      setFileList(res.data.cover.images.map(url => {
        return {
          url
        }
      }))
      // 暂存列表里也存一份照片
      // cacheImgList.current=fileList
      // cacheImgList.current=res.data.cover.images
      cacheImgList.current = res.data.cover.images.map(url => {
        return {
          url
        }
      })
    }
    if (id) {
      loadDetail()
    }
  }, [id])



  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? "编辑" : "发布"}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          onFinish={onfinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1 }}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>

          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: '请选择文章频道' }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {/* <Option value={0}>推荐</Option> */}
              {/* value是为了后台能获取该值以进行操作 */}
              {ChannelStore.channelList.map(item => <Option key={item.id} value={item.id}>{item.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={changeImg}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {/* 下面这段代码实现了if（imgCount > 0 ）的效果 */}
            {imgCount > 0 && (<Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList
              // action表示上传到指定地址里
              action="http://geek.itheima.net/v1_0/upload"
              fileList={fileList}
              onChange={onUploadChange}
              // 是否多传
              multiple={imgCount > 1}
              // 最多传多少张
              maxCount={imgCount}
            >
              <div style={{ marginTop: 8 }}>
                <PlusOutlined />
              </div>
            </Upload>)}

          </Form.Item>


          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: '请输入文章内容' }]}   //不填写点击发布就会报错
          >
            {/* 内容字样的旁边出现了一个文本编辑器，此处富文本编辑器已经被form.item控制了，它的输入内容会被onfinish收集起来 */}
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? "更新" : "发布"}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)