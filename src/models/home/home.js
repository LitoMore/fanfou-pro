import U from 'uprogress';
import {ff} from '../../api';

const defaultState = {
	loading: false,
	timeline: [],
	cached: [],
	parameters: null,
	isLoadingMore: false
};

export const home = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters}),
		setCached: (state, cached) => ({...state, cached}),
		setIsLoadingMore: (state, isLoadingMore) => ({...state, isLoadingMore})
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const timeline = await ff.get('/statuses/home_timeline', {format: 'html', ...state.home.parameters, ...parameters});
				dispatch.home.setTimeline({timeline, parameters});
				dispatch.home.setCached([]);
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

		cache: async (_, state) => {
			try {
				const timeline = await ff.get('/statuses/home_timeline', {format: 'html'});
				const cachedIds = state.home.cached.map(c => c.id);
				const timelineIds = state.home.timeline.map(t => t.id);
				const filtered = timeline.filter(t => !cachedIds.includes(t.id) && !timelineIds.includes(t.id));
				dispatch.home.setCached(filtered.concat(state.home.cached)).slice(0, 100);
			} catch {}
		},

		mergeCache: (_, state) => {
			const timelineIds = state.home.timeline.map(t => t.id);
			dispatch.home.setTimeline({
				timeline: state.home.cached.filter(c => !timelineIds.includes(c.id)).concat(state.home.timeline).slice(0, 100)
			});
			dispatch.home.setCached([]);
		},

		loadMore: async (_, state) => {
			const {timeline} = state.home;
			const parameters = {};

			if (timeline.length > 0) {
				parameters.max_id = timeline[timeline.length - 1].id;
			}

			try {
				dispatch.home.setIsLoadingMore(true);
				const more = await ff.get('/statuses/home_timeline', {format: 'html', ...parameters});
				dispatch.home.setTimeline({timeline: timeline.concat(more).slice(-100)});
				dispatch.home.setIsLoadingMore(false);
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
				dispatch.home.setIsLoadingMore(false);
			}
		}
	})
};
