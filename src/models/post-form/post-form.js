import U from 'uprogress';
import {ff} from '../../api';

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
				let status = await ff.post('/statuses/update', parameters);

				if (/@/.test(status.text)) {
					try {
						status = await ff.get('/statuses/show', {id: status.id, format: 'html'});
					} catch {}
				}

				dispatch.postForm.reset();
				dispatch.message.notify('发送成功！');

				switch (state.postForm.page) {
					case 'home':
						status.virtual = true;
						dispatch.home.setTimeline({timeline: [status].concat(state.home.timeline)});
						break;
					default:
						break;
				}

				u.done();
			} catch (error) {
				let errorMessage = error.message;

				try {
					const body = await error.response.text();
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
				let errorMessage = error.message;

				try {
					const body = await error.response.text();
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
