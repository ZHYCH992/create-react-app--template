/** 主页 **/

/** 所需的各种插件 **/
import { nanoid } from 'nanoid';
import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
				setData([
					...result.data.map(obj => {
						return {
							...obj,
							key: nanoid(),
						};
					}),
				]);
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

	useUpdateEffect(() => {
		requestData({ id: id });
	}, [id]);
	return (
		<>
			{contextHolder}
			<div className='top'>
				<Button className='left'>
					<Link to={`/list/${Number(id) - 1}`}>上一周</Link>
				</Button>
				<div className='title'>一周会议安排</div>
				<Button className='right'>
					<Link to={`/list/${Number(id) + 1}`}>下一周</Link>
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
