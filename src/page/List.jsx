/** 主页 **/

/** 所需的各种插件 **/
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
/** 所需的各种资源 **/
import { useUpdateEffect } from 'ahooks';
import { Button, Table, message } from 'antd';
import UseModal from '../component/UseModal';
import { getInitList } from './../api/url';
import useBaseRequest from './../hooks/useBaseRequest';
import './list.scss';
export default function List(props) {
	const columns = [
		{
			title: '日期',
			dataIndex: 'date',
			key: 'date',
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
	const { id } = useParams();
	const [messageApi, contextHolder] = message.useMessage();
	const key = 'weekList';
	const [data, setData] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [modalid, setModalId] = useState(1);
	const handleRowClick = record => {
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
			if (result?.data) {
				// 按日期进行排序
				data.sort((a, b) => new Date(a.date) - new Date(b.date));
				const modifiedData = data.map((item, index, arr) => {
					// 如果是第一个元素或者和前一个元素的日期不同，则保留该元素，否则将date字段设置为空
					if (index === 0 || item.date !== arr[index - 1].date) {
						return {
							...item,
							key: nanoid(),
							date: `${item.date}
						${item.dayOfWeek}`,
						};
					} else {
						return { ...item, date: '', key: nanoid() }; // 设置date字段为空
					}
				});
				setData(modifiedData);
			}
		},
		onerror: err => {
			setData([]);
			messageApi.open({
				key,
				type: 'error',
				content: err,
			});
		},
	});
	const lastWeek = () => {
		const page = Number(id) - 1;
		if (page <= 0) {
			messageApi.open({
				key,
				type: 'warning',
				content: '没有了，已经到达第一周了！',
			});
			return;
		}
		navigate(`/list/${page}`);
		return;
	};
	const nextWeek = () => {
		const page = Number(id) + 1;
		if (page > data.weekNumber) {
			messageApi.open({
				key,
				type: 'warning',
				content: '没有了，已经到达本周了！',
			});
			return;
		}
		navigate(`/list/${page}`);
		return;
	};
	useUpdateEffect(() => {
		requestData({ id: id });
		setData(data);
	}, [id]);
	return (
		<>
			{contextHolder}
			<div className='top'>
				<Button className='left' onClick={() => lastWeek()} disabled={Number(id) - 1 <= 0}>
					上一周
				</Button>
				<div className='title'>一周会议安排</div>
				<Button className='right' onClick={() => nextWeek()} disabled={Number(id) + 1 >= data.weekNumber}>
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
			/>
			<UseModal title={modalTitle} id={modalid} open={modalOpen} setOpen={setModalOpen} />
		</>
	);
}
