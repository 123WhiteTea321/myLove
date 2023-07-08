
import * as echarts from 'echarts'
import { useEffect, useRef } from 'react';

function Bar({title,xData,yData,style}){
   
    // 获取dom元素（原生js是用document.getElementById获取，react是用useRef()获取）
    const domRef = useRef()
    console.log("huhasdjbskdjfksdskhclo;", domRef.current)    //undefined


    // 封装一个图表初始化函数，用以完成一个小demo,此处用函数封装demo的所有参数
    const chartInit = () => {

        // 基于准备好的dom，初始化echarts实例
        // echarts.init 是 echarts 库提供的初始化函数，用于创建一个图表实例。
        // 在括号中，document.getElementById('main') 是获取 HTML 页面上 id 属性为 "main" 的元素。
        // 然后，myChart 这个变量将保存所创建的图表实例，以便后续使用。
        // const myChart = echarts.init(document.getElementById('main'));
        const myChart = echarts.init(domRef.current);
        console.log("huhaskhclo;", domRef.current)    //有东西

        // 绘制图表
        myChart.setOption({
            title: {
                text: title
            },
            tooltip: {},
            xAxis: {
                data: xData
            },
            yAxis: {},
            series: [
                {
                    name: '销量',
                    type: 'bar',
                    data: yData
                }
            ]
        });
    }
    // 执行这个初始化的函数
    useEffect(() => {
        chartInit()
    }, [])

    // 渲染
    return (
        <div>
            {/*准备一个对应的节点 */}
            <div ref={domRef} style={style}></div>
        </div>
    )
}

export default Bar