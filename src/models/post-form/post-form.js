import {ff} from '../../api';
import U from 'uprogress';

const defaultState = {
	text: '',
	page: ''
};

export const postForm = {
	state: defaultState,

	reducers: {
		setText: (state, text) => ({...state, text}),
		setPage: (state, page) => ({...state, page}),
		reset: state => ({...state, text: ''})
	},

	effects: dispatch => ({
		update: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				await ff.post('/statuses/update', {...parameters});
				dispatch.postForm.reset();
				dispatch.message.notify('发送成功！');
				u.done();

				switch (state.postForm.page) {
					case 'home':
						dispatch.home.fetch();
						break;
					default:
						break;
				}
			} catch (error) {
				const body = await error.response.text();
				let errorMessage = error.message;

				try {
					const result = JSON.parse(body);
					if (result.error) {
						errorMessage = result.error;
					}
				} catch {}

				dispatch.message.notify(errorMessage);
				u.done();
			}
		}
	})
};
