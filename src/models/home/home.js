import U from 'uprogress';
import {ff} from '../../api';

const defaultState = {
	loading: false,
	timleine: [],
	cache: [],
	parameters: null
};

export const home = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters}),
		setCache: (state, cache) => ({...state, cache})
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const u = new U(document.querySelector('#timeline'));

			try {
				u.start();
				const timeline = await ff.get('/statuses/home_timeline', {format: 'html', ...state.home.parameters, ...parameters});
				dispatch.home.setTimeline({timeline, parameters});
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

		cache: async () => {
			try {
				const timeline = await ff.get('/statuses/home_timeline', {format: 'html'});
				dispatch.home.setCache(timeline);
			} catch {}
		},

		mergeCache: () => {

		}
	})
};
