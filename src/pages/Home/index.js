
// 思路：
// 1.安装echarts
// 2.使用hook--useRef获取dom节点
// 3.什么时机获取节点--在dom执行之后才执行的useEffect()
// 4.按照需求自定义参数，抽象出来
import Bar from "../../components/Bar"

function Home() {
    return (
        <div>

            <Bar
                title='主流框架1'
                xData={['vue', 'react', 'augular']}
                yData={[50, 40, 40]}
                style={{ width: '200px', height: '300px' }}
            />

            <Bar
                title='主流框架2'
                xData={['vue', 'react', 'augular']}
                yData={[40, 50, 10]}
                style={{ width: '400px', height: '600px' }}
            />

        </div>
    )
}

export default Home