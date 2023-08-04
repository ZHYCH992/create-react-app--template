/** 主页 **/

/** 所需的各种插件 **/
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
/** 所需的各种资源 **/
import { useUpdateEffect } from 'ahooks';
import { Button, Table, message } from 'antd';
import { Link } from 'react-router-dom';
import UseModal from '../component/UseModal';
import { Svg } from '../util/svg';
import { getInitList } from './../api/url';
import useBaseRequest from './../hooks/useBaseRequest';
import './list.scss';
export default function List(props) {
	const columns = [
		{
			title: '日期',
			dataIndex: 'date',
			key: 'date',
			render: (text, record, index) => {
				const current = record.date;
				const previous = index > 0 ? data[index - 1].date : null;
				//当前日期与上一个日期相同则当前日期列为0，不同则为列表中所有相同的长度
				const rowSpan = previous === current ? 0 : data.filter(item => item.date === current).length;
				return {
					children: (
						<>
							<div key={text}>{text}</div>
							<div key={record.dayOfWeek}>{record.dayOfWeek}</div>
						</>
					),
					props: {
						rowSpan: rowSpan,
					},
				};
			},
		},
		{
			title: '时间',
			dataIndex: 'time',
			key: 'time',
		},
		{
			title: '地点',
			dataIndex: 'place',
			key: 'place',
		},
		{
			title: '会议主题',
			dataIndex: 'theme',
			key: 'theme',
		},
		{
			title: '参加人员',
			dataIndex: 'participants',
			key: 'participants',
		},
		{
			title: '召集人',
			dataIndex: 'convener',
			key: 'convener',
		},
	];
	const navigate = useNavigate();
	const { id, week } = useParams();
	const [messageApi, contextHolder] = message.useMessage();
	const [data, setData] = useState([]);
	const [msg, setMsg] = useState('');
	const [modalOpen, setModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [modalid, setModalId] = useState(1);
	const handleRowClick = record => {
		if (!record.id) {
			messageApi.open({
				key: nanoid(),
				type: 'warning',
				content: '当日没有会议！',
			});
			return;
		}
		setModalTitle(`${record.date}   ${record.time}   ${record.theme}`);
		setModalId(record.id);
		setModalOpen(true);
	};
	const { run: requestData, loading } = useBaseRequest(getInitList, {
		defaultParams: [
			{
				id: id,
			},
		],
		onSuccess: result => {
			result?.errorMsg ? setMsg(result.errorMsg) : void 0;
			if (result?.data) {
				// // 按日期进行排序
				result.data
					.map(i => {
						return { ...i, key: nanoid() };
					})
					.sort((a, b) => new Date(a.date) - new Date(b.date));
				// const modifiedData = result.data.map((item, index, arr) => {
				// 	// 如果是第一个元素或者和前一个元素的日期不同，则保留该元素，否则将date字段设置为空
				// 	if (index === 0 || item.date !== arr[index - 1].date) {
				// 		return {
				// 			...item,
				// 			key: nanoid(),
				// 			date: `${item.date} ${item.dayOfWeek}`,
				// 		};
				// 	} else {
				// 		return { ...item, date: '', key: nanoid() }; // 设置date字段为空
				// 	}
				// });
				setData(result.data);
			} else {
				setData([]);
			}
		},
	});
	const lastWeek = () => {
		let [year, month] = [parseInt(id.substring(0, 4)), parseInt(id.substring(4))];
		const page = month - 1;
		if (page <= 0) {
			year--;
			month = 52;
		} else {
			month--;
		}
		navigate(`/list/${year}${String(month).padStart(2, '0')}/${week}`);
	};
	const nextWeek = () => {
		let [year, month] = [parseInt(id.substring(0, 4)), parseInt(id.substring(4))];
		const page = month + 1;
		if (page > 52) {
			year++;
			month = 1;
		} else {
			month++;
		}

		navigate(`/list/${year}${String(month).padStart(2, '0')}/${week}`);
	};
	//路由拦截，最大显示至当前周
	const routerX = () => {
		const y = new Date().getFullYear();
		let [year, month] = [parseInt(id.substring(0, 4)), parseInt(id.substring(4))];
		if (year == y && month > week) {
			messageApi.open({
				key: nanoid(),
				type: 'warning',
				content: 'url输入有误，已经为您跳转至本周！',
			});
			navigate(`/list/${y}${week}/${week}`);
		}
	};
	routerX();
	useUpdateEffect(() => {
		requestData({ id: id });
	}, [id]);
	return (
		<>
			{contextHolder}
			<div className='callback'>
				<Button type='primary' key='callback'>
					<Link to={'/'}> &lt; 返回列表</Link>
				</Button>
			</div>
			<div className='top'>
				<Button className='left' key='left' onClick={() => lastWeek()}>
					上一周
				</Button>
				<div className='title'>一周会议安排</div>
				<Button className='right' key='right' onClick={() => nextWeek()} disabled={id == `${new Date().getFullYear()}${week}`}>
					下一周
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={data}
				loading={loading}
				onRow={record => ({
					onClick: () => handleRowClick(record),
				})}
				locale={{ emptyText: <Svg title='noData' text={msg || '本周暂无数据'} /> }}
			/>
			<UseModal title={modalTitle} id={modalid} open={modalOpen} setOpen={setModalOpen} />
		</>
	);
}
