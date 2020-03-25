import {ff} from '../../api';
import U from 'uprogress';

const defaultState = {
	loading: false,
	timleine: [],
	parameters: null
};

export const favorites = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters})
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const [profile, timeline] = await Promise.all([
					state.login.current && (parameters.id === state.login.current.id) ? state.login.current : ff.get('/users/show', {id: parameters.id}),
					ff.get('/favorites', {format: 'html', ...parameters})
				]);
				dispatch.user.setProfile(profile);
				dispatch.favorites.setTimeline({timeline, parameters});
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
