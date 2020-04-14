import U from 'uprogress';
import {ff} from '../../api';
import {ffErrorHandler} from '../../utils/model';

const defaultState = {
	loading: false,
	isLoadingMore: false,
	timleine: [],
	parameters: null
};

export const search = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters}),
		setIsLoadingMore: (state, isLoadingMore) => ({...state, isLoadingMore})
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
				const isTimeout = errorMessage === 'Request timed out';

				if (isTimeout) {
					u.done();
					dispatch.search.fetch(parameters);
				} else {
					dispatch.message.notify(errorMessage);
					u.done();
				}
			}
		},

		loadMore: async (_, state) => {
			const {timeline} = state.search;
			const parameters = {};

			if (timeline.length > 0) {
				parameters.max_id = timeline[timeline.length - 1].id;
			}

			try {
				dispatch.search.setIsLoadingMore(true);
				const more = await ff.get('/search/public_timeline', {format: 'html', ...parameters, ...state.search.parameters});
				dispatch.search.setTimeline({timeline: timeline.concat(more), parameters: {...parameters, ...state.search.parameters}});
				dispatch.search.setIsLoadingMore(false);
				if (more.length === 0) {
					dispatch.message.notify('没有更多了');
				}
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				dispatch.search.setIsLoadingMore(false);
			}
		}
	})
};
