import U from 'uprogress';
import {ff} from '../../api/index.js';
import {ffErrorHandler} from '../../utils/model.js';

const defaultState = {
	isLoading: false,
	timeline: [],
	cached: [],
	parameters: null,
	isLoadingMore: false,
};

export const recents = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters}),
		setCached: (state, cached) => ({...state, cached}),
		setIsLoading: (state, isLoading) => ({...state, isLoading}),
		setIsLoadingMore: (state, isLoadingMore) => ({...state, isLoadingMore}),
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const {setTimeline, setCached} = dispatch.recents;
			const u = new U();

			try {
				u.start();
				await dispatch.notification.load();
				const timeline = await ff.get('/statuses/public_timeline', {format: 'html', ...state.recents.parameters, ...parameters});
				setTimeline({timeline, parameters});
				setCached([]);
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				const isTimeout = errorMessage === 'Request timed out';

				if (isTimeout) {
					u.done();
					dispatch.recents.fetch(parameters);
				} else {
					dispatch.message.notify(errorMessage);
					u.done();
				}
			}
		},

		cache: async (_, state) => {
			try {
				const timeline = await ff.get('/statuses/public_timeline', {format: 'html'});
				const cachedIdsSet = new Set(state.recents.cached.map(c => c.id));
				const timelineIdsSet = new Set(state.recents.timeline.map(t => t.id));
				const filtered = timeline.filter(t => !cachedIdsSet.has(t.id) && !timelineIdsSet.has(t.id));
				dispatch.recents.setCached([...filtered, ...state.recents.cached]).slice(0, 100);
			} catch {}
		},

		mergeCache: (_, state) => {
			const timelineIdsSet = new Set(state.recents.timeline.map(t => t.id));
			dispatch.recents.setTimeline({
				timeline: [...state.recents.cached.filter(c => !timelineIdsSet.has(c.id)), ...state.recents.timeline].slice(0, 100).sort((a, b) => b.rawid - a.rawid),
			});
			dispatch.recents.setCached([]);
		},
	}),
};
