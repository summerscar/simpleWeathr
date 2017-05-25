# 极简天气

基于Vue的天气移动端网页

模仿自 安卓APP Pure天气

* 模仿自安卓APP Pure天气 的移动端网页
* 利用Vue.js的数据驱动概念配合Element ui进行构建
* 利用Canvas根据获取数据进行对未来天气的曲线图，风速等进行绘制
* 城市列表在LocalStorage中保存，每次开启读取并添加本地数据，显示设定过默认的城市
* 利用axios从API获取天气数据并且对添加城市存在性的判断
* 输入框下拉菜单的候选城市的显示利用了lodash的延时功能，降低Ajax请求频率

API：和风天气

demo地址：http://summerscar.com/weather/weather.html
