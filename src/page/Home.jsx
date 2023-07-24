import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getInitMain } from './../api/url';
import useBaseRequest from './../hooks/useBaseRequest';

import { List, Pagination, Space, message } from 'antd';

export default function Home() {
	const [messageApi, contextHolder] = message.useMessage();
	const key = 'updatable';
	const [data, setData] = useState([]);
	const [pagetotal, setTotal] = useState(0);
	const { run: requestData, loading } = useBaseRequest(getInitMain, {
		defaultParams: [
			{
				page: 1,
				row: 10,
			},
		],
		onSuccess: result => {
			console.log(result)
			if (result?.data) {
				setData(result.data);
				setTotal(result.total);
			} else {
				messageApi.open({
					key,
					type: 'warning',
					content: result.errorMsg,
				});
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
	return (
		<Space direction='vertical' style={{ display: 'flex' }}>
			{contextHolder}
			<List
				bordered
				loading={loading}
				dataSource={data}
				renderItem={item => (
					<List.Item className='listItem' key={item.id}>
						<Link to={'/list/' + item.id}>{item.name}</Link>
					</List.Item>
				)}
			/>
			<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
				<Pagination
					defaultCurrent={1}
					defaultPageSize={10}
					total={pagetotal}
					showSizeChanger
					onChange={(page, pageSize) =>
						requestData({
							page: page,
							row: pageSize,
						})
					}
				/>
			</div>
		</Space>
	);
}
