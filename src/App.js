
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import Layout from './pages/Layout';
import Login from './pages/Login';
import { AuthRoute } from '../src/components/AuthComponent'  //导入鉴权组件
import Publish from './pages/Publish';
import Home from './pages/Home';
import Article from './pages/Article';



function App() {

  // 路由配置

  return (
    <BrowserRouter>
      <div className="App">
        {/* 创建路由出口Routes,二级路由出口是outlet         */}
        <Routes>

          {/* 为防止不经过登录直接跳转首页的行为，需要配置鉴权，登录页不需要鉴权 */}
          <Route path="/" element={
            <AuthRoute>
              <Layout />
            </AuthRoute>
          }>
            <Route index element={<Home></Home>}></Route>
            <Route path='/article' element={<Article></Article>}></Route>
            <Route path='/publish' element={<Publish></Publish>}></Route>
          </Route>
          <Route path="/Login" element={<Login />}></Route>
        </Routes>
      </div>

    </BrowserRouter>
  );
}

export default App;
