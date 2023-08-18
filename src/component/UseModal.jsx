import { useUpdateEffect } from 'ahooks';
import { Descriptions, Modal, message } from 'antd';
import React, { useState } from 'react';
import { getInitInfo } from './../api/url';
import useBaseRequest from './../hooks/useBaseRequest';
// const columns = [
// 	{
// 		title: '活动名称',
// 		dataIndex: 'theme',
// 		key: 'theme',
// 	},
// 	{
// 		title: '申请单位',
// 		dataIndex: 'applicant',
// 		key: 'applicant',
// 	},
// 	{
// 		title: '召集人',
// 		dataIndex: 'convener',
// 		key: 'convener',
// 	},
// 	{
// 		title: '参加人员',
// 		dataIndex: 'participants',
// 		key: 'participants',
// 	},
// 	{
// 		title: '规模',
// 		dataIndex: 'scope',
// 		key: 'scope',
// 	},
// 	{
// 		title: '活动地点',
// 		dataIndex: 'location',
// 		key: 'location',
// 	},
// 	{
// 		title: '会议内容',
// 		dataIndex: 'content',
// 		key: 'content',
// 	},
// ];

const UseModal = ({ title, id, open, setOpen }) => {
	const [data, setData] = useState([]);
	const [messageApi] = message.useMessage();
	const key = 'weekList';
	const handleCancel = () => {
		setOpen(false);
	};
	const { run: requestData } = useBaseRequest(getInitInfo, {
		manual: true,
		defaultParams: [
			{
				id: id,
			},
		],
		onSuccess: result => {
			result.data ? setData(result.data) : setData([]);
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
		open ? requestData({ id: id }) : void 0;
	}, [open]);
	return (
		<>
			<Modal
				open={open}
				centered
				title={title}
				onOk={handleCancel}
				cancelButtonProps={{ style: { display: 'none' } }} // 设置取消按钮不显示
			>
				<Descriptions column={4} bordered>
					<Descriptions.Item label='活动名称' span={4}>
						{data.theme}
					</Descriptions.Item>
					<Descriptions.Item label='申请单位' span={4}>
						{data.applicant}
					</Descriptions.Item>

					<Descriptions.Item label='召集人' span={4}>
						{data.convener}
					</Descriptions.Item>
					<Descriptions.Item label='参加人员' span={4}>
						{data.participants}
					</Descriptions.Item>

					<Descriptions.Item label='规模' span={4}>
						{data.scope}
					</Descriptions.Item>
					<Descriptions.Item label='活动地点' span={4}>
						{data.location}
					</Descriptions.Item>

					<Descriptions.Item label='会议内容' span={4}>
						{data.content}
					</Descriptions.Item>
				</Descriptions>
				{/* <Table loading={loading} columns={columns} dataSource={data} pagination={false}/> */}
			</Modal>
		</>
	);
};

export default UseModal;
