import {ff} from '../../api';
import U from 'uprogress';

const defaultState = {
	loading: false,
	timleine: [],
	parameters: null
};

export const search = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters})
	},

	effects: dispatch => ({
		fetch: async parameters => {
			const u = new U();

			try {
				u.start();
				const timeline = await ff.get('/search/public_timeline', {format: 'html', ...parameters});
				console.log(timeline);
				dispatch.search.setTimeline({timeline, parameters});
				u.done();
			} catch (error) {
				console.log(error);
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
