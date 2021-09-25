import U from 'uprogress';
import {ff} from '../../api.js';
import {ffErrorHandler} from '../../utils/model.js';

const defaultState = {
	list: [],
};

export const trends = {
	state: defaultState,

	reducers: {
		setList: (state, list) => ({...state, list}),
	},

	effects: dispatch => ({
		fetch: async () => {
			try {
				const list = await ff.get('/saved_searches/list');
				dispatch.trends.setList(list);
			} catch {}
		},

		create: async (query, state) => {
			const u = new U();

			try {
				u.start();
				const result = await ff.post('/saved_searches/create', {query});
				dispatch.trends.setList([...state.trends.list, result]);
				dispatch.message.notify('关注话题成功！');
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);

				if (errorMessage === 'Unexpected end of JSON input') {
					dispatch.message.notify('最多只能保存 10 个话题');
					u.done();
				} else {
					dispatch.message.notify(errorMessage);
					u.done();
				}
			}
		},

		destroy: async (id, state) => {
			const u = new U();

			try {
				u.start();
				const result = await ff.post('/saved_searches/destroy', {id});
				dispatch.trends.setList(state.trends.list.filter(l => l.query !== result.query));
				dispatch.message.notify('已取消关注话题！');
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		},
	}),
};
