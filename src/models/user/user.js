import {ff} from '../../api';
import U from 'uprogress';

const defaultState = {
	loading: false,
	timleine: [],
	parameters: null,
	profile: null,
	noPermit: false
};

export const user = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters}),
		setProfile: (state, profile) => ({...state, profile}),
		setNoPermit: (state, noPermit) => ({...state, noPermit})
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const [profile, timeline] = await Promise.all([
					ff.get('/users/show', {id: parameters.id}),
					ff.get('/statuses/user_timeline', {format: 'html', ...state.home.parameters, ...parameters})
						.catch(() => Promise.resolve(null))
				]);
				dispatch.user.setProfile(profile);
				dispatch.user.setTimeline({timeline: timeline || [], parameters});
				dispatch.user.setNoPermit(timeline === null);
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
