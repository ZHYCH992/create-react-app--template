import { message } from 'antd';
import axios from 'axios';

const service = axios.create({
	timeout: 100000,
});

const err = error => {
	if (error.response) onceResponseWarning(error.response?.data);
	return Promise.reject(error);
};
//请求之前
service.interceptors.request.use(config => {
	if (!sessionStorage.getItem('_p')) {
		const url = window.location.href;
		const match = url.match(/_p=([^&]+)/);
		const _p = match ? match[1] : null;
		console.log(_p);
		if (!_p) {
			message.error({
				content: '请在href中添加_p参数！',
				key: onceResponseWarningKey,
				duration: 3,
			});
			return;
		}
		sessionStorage.setItem('_p', _p);
	}
	config.data = Object.assign({ _p: sessionStorage.getItem('_p') }, config.data);
	//if (config.method === 'post') {
	let data = '';
	for (let item in config.data) {
		if (config.data[item]) {
			data += encodeURIComponent(item) + '=' + encodeURIComponent(config.data[item]) + '&';
		}
	}
	config.data = data.slice(0, data.length - 1);
	//}
	const newConfig = config;
	return newConfig;
}, err);

message.config({
	top: 50,
	maxCount: 1,
	duration: 1.8,
});

let onceResponseWarningKey = 'onceResponseWarningKey';

export function onceResponseWarning(res) {
	if (res?.resultCode !== 0 || !res || !res?.result?.data) {
		message.destroy(onceResponseWarningKey);
		message.warning({
			content: res.errorMsg || `响应错误，请重试或联系管理员`,
			key: onceResponseWarningKey,
			duration: 3,
		});
	}
}
//返回之前
service.interceptors.response.use(response => {
	const {
		status,
		data,
		data: { result, resultCode },
	} = response || {};
	onceResponseWarning(data);
	data.weekInfo ? (data.result.currentWeek = data.weekInfo) : void 0;
console.log(response)
	if (resultCode !== 0 || status >= 300) {
		return Promise.reject(data);
	}
	if (resultCode === 0 || JSON.stringify(data) === '{}') {
		return Promise.resolve(result);
	}
	return Promise.reject(response);
}, err);

export { service as axios };

