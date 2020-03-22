import {ff} from '../../api';
import U from 'uprogress';

const defaultState = {
	loading: false,
	timleine: [],
	parameters: null
};

export const mentions = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters})
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const timeline = await ff.get('/statuses/mentions', {format: 'html', ...state.mentions.parameters, ...parameters});
				dispatch.mentions.setTimeline({timeline, parameters});
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
		}
	})
};
