import U from 'uprogress';
import {ff} from '../../api';
import {ffErrorHandler} from '../../utils/model';

const defaultState = {
	loading: false,
	timleine: [],
	parameters: null,
	profile: null,
	isNoPermit: false
};

export const user = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters}),
		setProfile: (state, profile) => ({...state, profile}),
		setIsNoPermit: (state, isNoPermit) => ({...state, isNoPermit})
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const [profile, timeline] = await Promise.all([
					state.login.current && (parameters.id === state.login.current.id) ? state.login.current : ff.get('/users/show', {id: parameters.id}),
					ff.get('/statuses/user_timeline', {format: 'html', ...parameters})
						.catch(() => Promise.resolve(null))
				]);
				dispatch.user.setProfile(profile);
				dispatch.user.setTimeline({timeline: timeline || [], parameters});
				dispatch.user.setIsNoPermit(timeline === null);
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		}
	})
};
