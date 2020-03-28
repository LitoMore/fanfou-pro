import U from 'uprogress';
import {ff} from '../../api';

const defaultState = {
	users: [],
	parameters: null,
	profile: null,
	isNoPermit: false
};

export const following = {
	state: defaultState,

	reducers: {
		setUsers: (state, {users, parameters}) => ({...state, users, parameters}),
		setProfile: (state, profile) => ({...state, profile}),
		setIsNoPermit: (state, isNoPermit) => ({...state, isNoPermit})
	},

	effects: dispatch => ({
		fetch: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const [profile, users] = [
					state.login.current && (parameters.id === state.login.current.id) ? state.login.current : ff.get('/users/show', {id: parameters.id}),
					ff.get('/users/friends', parameters)
						.catch(() => Promise.resolve(null))
				];
				dispatch.following.setProfile(profile);
				dispatch.following.setUsers({users: users || [], parameters});
				dispatch.following.setIsNoPermit(users === null);
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
