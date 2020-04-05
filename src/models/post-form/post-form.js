import {ff} from '../../api';
import {ffErrorHandler} from '../../utils/model';

const defaultState = {
	file: null,
	text: '',
	page: '',
	isPosting: false
};

export const postForm = {
	state: defaultState,

	reducers: {
		setFile: (state, file) => ({...state, file}),
		setText: (state, text) => ({...state, text}),
		setPage: (state, page) => ({...state, page}),
		setIsPosting: (state, isPosting) => ({...state, isPosting}),
		reset: state => ({...state, text: '', file: null})
	},

	effects: dispatch => ({
		update: async (parameters, state) => {
			try {
				dispatch.postForm.setIsPosting(true);
				let status = await ff.post('/statuses/update', parameters);

				if (/[@#]|http/.test(status.text)) {
					try {
						status = await ff.get('/statuses/show', {id: status.id, format: 'html'});
					} catch {}
				}

				dispatch.postForm.reset();
				dispatch.message.notify('发送成功！');
				const {page} = state.postForm;

				switch (page) {
					case 'home':
						status.virtual = true;
						dispatch[page].setTimeline({timeline: [status].concat(state[page].timeline)});
						break;
					default:
						break;
				}

				dispatch.history.add(status);
				dispatch.postForm.setIsPosting(false);
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				dispatch.postForm.setIsPosting(false);
			}
		},

		upload: async (parameters, state) => {
			try {
				dispatch.postForm.setIsPosting(true);
				const photo = state.postForm.file;
				let status = await ff.upload('/photos/upload', {...parameters, photo});

				if (/@/.test(status.text)) {
					try {
						status = await ff.get('/statuses/show', {id: status.id, format: 'html'});
					} catch {}
				}

				dispatch.postForm.reset();
				dispatch.message.notify('发送成功！');
				const {page} = state.postForm;

				switch (page) {
					case 'home':
						status.virtual = true;
						dispatch[page].setTimeline({timeline: [status].concat(state[page].timeline)});
						break;
					default:
						break;
				}

				dispatch.postForm.setIsPosting(false);
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				dispatch.postForm.setIsPosting(false);
			}
		}
	})
};
