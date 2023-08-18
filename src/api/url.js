console.log(process.env.NODE_ENV);
let context;
process.env.NODE_ENV === 'development' ? (context = '/api/webpluspro') : (context = '');
const url = {
	main: `${context}/_web/_weeklyMeetingShow/api/weeks.rst`,
	list: `${context}/_web/_weeklyMeetingShow/api/week/1.rst`,
	info: `${context}/_web/_weeklyMeetingShow/api/meeting/1.rst`,
};

function getInitMain(parameters = {}) {
	return {
		url: url.main,
		method: 'post',
		data: parameters,
	};
}
function getInitList(parameters = {}) {
	const { id } = parameters;
	return {
		url: `${context}/_web/_weeklyMeetingShow/api/week/${id}.rst`,
		method: 'post',
		data: parameters,
	};
}
function getInitInfo(parameters = {}) {
	const { id } = parameters;
	return {
		url: `${context}/_web/_weeklyMeetingShow/api/meeting/${id}.rst`,
		method: 'post',
		data: parameters,
	};
}

export { getInitInfo, getInitList, getInitMain };

