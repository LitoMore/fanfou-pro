import U from 'uprogress';
import {ff} from '../../api';
import {ffErrorHandler} from '../../utils/model';

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
				dispatch.search.setTimeline({timeline, parameters});
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		}
	})
};
