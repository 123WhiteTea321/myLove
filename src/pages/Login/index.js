import logo from '../../assets/logo.png'
import { Card, Input, Button, Form, Checkbox,message } from 'antd'
import { useNavigate } from 'react-router-dom'
import './index.scss' // 导入样式文件
import { useStore } from '../../store'       //1.
// import loginStore from '../../store/login.Store'  //那明明也用export导出了，为什么用不了呢     //2.

function Login() {

    const {loginStore}=useStore()        //1.

    const navigate=useNavigate()

    //绑定事件，以获取表单中用户输入的值
    const onFinish = values => {
        console.log(values)
        // values里面含有表单的mobile和code
        // loginStore.get...  错误的，这里没有用mobx导出，所以没有getToken方法，index那里才有mobx统一管理和导出??
        // loginStore.getToken=()=>{     这是定义函数，不是调用函数
        //     mobile:values.mobile
        //     code
        // }
        //为什么输入loginStore还是没有getToken提示，因为没有安装craco????          
         loginStore.getToken({                //2.  1.
            mobile: values.username,
            code: values.password
        })
         
        // loginStore.getToken=({                //嗷嗷嗷嗷，这里多打了一个"=" !!!!! 怪不得一直没有显示结果
        //     mobile: values.username,
        //     code: values.password
        // })


        // 跳转首页 (要做token判断)
          navigate('/',{replace:true})     //把目的路径传进去就行
        // 成功提示
        message.success("登录成功")
    }

    return (
        <div className="login">
            <Card className="login-container">
                <img className="login-logo" src={logo} alt="" />
                {/* 登录表单 */}
                <Form
                    // 设置初始值
                    initialValues={{ 
                        remember: true,
                        username: '13811111111',
                        password: '246810',
                    
                    }}
                    // 校验规则事件
                    validateTrigger={['onBlur', 'onChange']}
                    //绑定事件，以获取表单中用户输入的值
                    onFinish={onFinish}
                >
                    {/* 手记号。。。。。。。。。。。。。。。。。。。。。。 */}
                    <Form.Item
                        // name中的值就是后台对象中的key  {mobile:手机号name.value}
                        name="username"
                        rules={[
                            {
                                pattern: /^1[3-9]\d{9}$/,
                                message: '手机号码格式不对',
                                validateTrigger: 'onBlur'    //该失焦事件需要用到上面的validateTrigger
                            },
                            { required: true, message: '请输入手机号' }
                        ]}>
                        <Input size="large" placeholder="请输入手机号" />
                    </Form.Item>
                    {/* 验证码。。。。。。。。。。。。。。。。。。。。。。。。。 */}
                    <Form.Item
                        name="password"
                        rules={[
                            { len: 6, message: '验证码6个字符', validateTrigger: 'onBlur' },
                            { required: true, message: '请输入验证码' }
                        ]}>
                        <Input size="large" placeholder="请输入验证码" />
                    </Form.Item>
                    {/* 同意协议。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。。 */}
                    <Form.Item
                        name="remember" valuePropName="checked"   //加上这俩属性，checkbox就可以默认显示了
                    >
                        <Checkbox className="login-checkbox-label">
                            我已阅读并同意「用户协议」和「隐私条款」
                        </Checkbox>
                    </Form.Item>

                    {/* 登录这里好像没绑定onclick事件吧 */}
                    <Form.Item>
                        <Button type="primary" htmlType="submit" size="large" block>
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    )
}

export default Login