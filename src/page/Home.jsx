import { List, Pagination, Space, message } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getInitMain } from './../api/url';
import useBaseRequest from './../hooks/useBaseRequest';

export default function Home() {
	const [messageApi, contextHolder] = message.useMessage();
	const [data, setData] = useState([]);
	const [week, setWeek] = useState(0);
	const [pagetotal, setTotal] = useState(0);

	const { run: requestData, loading } = useBaseRequest(getInitMain, {
		defaultParams: [
			{
				page: 1,
				row: 10,
			},
		],
		onSuccess: result => {
			if (result?.data) {
				console.log(result);
				setWeek(result.currentWeek);
<<<<<<< HEAD
				setData(reverseArray(result.data));
=======
				setData(result.data);
>>>>>>> 2c438b8f0e6cd16ec80283803863d4ac2de7eec2
				setTotal(result.total);
			}
		},
		onerror: err => {
			setData([]);
		},
	});
	function reverseArray(arr) {
		var length = arr.length;
		var mid = Math.floor(length / 2);
		for (var i = 0; i < mid; i++) {
			var temp = arr[i];
			arr[i] = arr[length - 1 - i];
			arr[length - 1 - i] = temp;
		}
		return arr;
	}
	return (
		<Space direction='vertical' style={{ display: 'flex' }}>
			{contextHolder}
			<List
				bordered
				loading={loading}
				dataSource={data}
				renderItem={item => (
					<List.Item className='listItem' key={item.id}>
						<Link to={`/list/${item.id}/${week}`}>{item.name}</Link>
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
