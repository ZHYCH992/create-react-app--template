/** 路由页 - 真正意义上的根组件，已挂载到redux上，可获取store中的内容 **/

/** 所需的各种插件 **/
import React, { useEffect } from 'react';

// import { Router, Route, Switch, Redirect } from "react-router-dom";
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import Home from '../page/Home';
import List from '../page/List';
// antd的多语言
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

// import { zhCN } from 'antd/lib/locale-provider/zh_CN';

/** 组件 **/
export default function RootRouterContainer(props) {
	// 在组件加载完毕后触发
	useEffect(() => {
		// 可以手动在此预加载指定的模块：
		// Features.preload(); // 预加载Features页面
		// Test.preload(); // 预加载Test页面
		// 也可以直接预加载所有的异步模块
		// Loadable.preloadAll();
	}, []);

	/** 简单权限控制 路由守卫 **/
	function onEnter(Component) {
		// 例子：如果没有登录，直接跳转至login页
		// if (sessionStorage.getItem('userInfo')) {
		//   return Component;
		// } else {
		//   return <Redirect to='/login' />;
		// }
		return Component;
	}

	return (
		<ConfigProvider locale={zhCN}>
			<Router>
				<Routes>
					<Route path='/' element={onEnter(<Home />)} />
					<Route path='/list/:id/:week' element={onEnter(<List />)} />
				</Routes>
			</Router>
		</ConfigProvider>
	);
}
