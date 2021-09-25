import U from 'uprogress';
import {ff} from '../../api.js';
import {ffErrorHandler} from '../../utils/model.js';

const defaultState = {
	isLoading: false,
	timeline: [],
	cached: [],
	parameters: null,
	isLoadingMore: false,
};

export const home = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters}),
		setCached: (state, cached) => ({...state, cached}),
		setIsLoading: (state, isLoading) => ({...state, isLoading}),
		setIsLoadingMore: (state, isLoadingMore) => ({...state, isLoadingMore}),
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const {setTimeline, setCached} = dispatch.home;
			const u = new U();

			try {
				u.start();
				await dispatch.notification.load();
				const timeline = await ff.get('/statuses/home_timeline', {format: 'html', ...state.home.parameters, ...parameters});
				setTimeline({timeline, parameters});
				setCached([]);
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				const isTimeout = errorMessage === 'Request timed out';

				if (isTimeout) {
					u.done();
					dispatch.home.fetch(parameters);
				} else {
					dispatch.message.notify(errorMessage);
					u.done();
				}
			}
		},

		cache: async (_, state) => {
			try {
				const timeline = await ff.get('/statuses/home_timeline', {format: 'html'});
				const cachedIdsSet = new Set(state.home.cached.map(c => c.id));
				const timelineIdsSet = new Set(state.home.timeline.map(t => t.id));
				const filtered = timeline.filter(t => !cachedIdsSet.has(t.id) && !timelineIdsSet.has(t.id));
				dispatch.home.setCached([...filtered, ...state.home.cached]).slice(0, 100);
			} catch {}
		},

		mergeCache: (_, state) => {
			const timelineIdsSet = new Set(state.home.timeline.map(t => t.id));
			dispatch.home.setTimeline({
				timeline: [...state.home.cached.filter(c => !timelineIdsSet.has(c.id)), ...state.home.timeline].slice(0, 100).sort((a, b) => b.rawid - a.rawid),
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
				dispatch.home.setTimeline({timeline: [...timeline, ...more].slice(-100)});
				dispatch.home.setIsLoadingMore(false);
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				dispatch.home.setIsLoadingMore(false);
			}
		},
	}),
};
