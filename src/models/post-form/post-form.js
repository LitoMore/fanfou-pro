import {ff} from '../../api';
import U from 'uprogress';

const defaultState = {
	file: null,
	text: '',
	page: ''
};

export const postForm = {
	state: defaultState,

	reducers: {
		setFile: (state, file) => ({...state, file}),
		setText: (state, text) => ({...state, text}),
		setPage: (state, page) => ({...state, page}),
		reset: state => ({...state, text: '', file: null})
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
						dispatch.home.fetch({format: 'html'});
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
		},

		upload: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const photo = state.postForm.file;
				await ff.upload('/photos/upload', {...parameters, photo});
				dispatch.postForm.reset();
				dispatch.message.notify('发送成功！');
				u.done();

				switch (state.postForm.page) {
					case 'home':
						dispatch.home.fetch({format: 'html'});
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
