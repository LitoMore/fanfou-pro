import U from 'uprogress';
import {ff} from '../../api';

const defaultState = {
	users: [],
	parameters: null,
	profile: null,
	isNoPermit: false,
	type: ''
};

export const followers = {
	state: defaultState,

	reducers: {
		setUsers: (state, {users, parameters}) => ({...state, users, parameters}),
		setProfile: (state, profile) => ({...state, profile}),
		setIsNoPermit: (state, isNoPermit) => ({...state, isNoPermit}),
		setType: (state, type) => ({...state, type})
	},

	effects: dispatch => ({
		fetchFollowers: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const [profile, users] = await Promise.all([
					state.login.current && (parameters.id === state.login.current.id) ? state.login.current : ff.get('/users/show', {id: parameters.id}),
					ff.get('/users/followers', {count: 20, ...parameters})
						.catch(() => Promise.resolve(null))
				]);
				dispatch.followers.setType('followers');
				dispatch.followers.setProfile(profile);
				dispatch.followers.setUsers({users: users || [], parameters});
				dispatch.followers.setIsNoPermit(users === null);
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

		fetchFollowing: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const [profile, users] = await Promise.all([
					state.login.current && (parameters.id === state.login.current.id) ? state.login.current : ff.get('/users/show', {id: parameters.id}),
					ff.get('/users/friends', {count: 20, ...parameters})
						.catch(() => Promise.resolve(null))
				]);
				dispatch.followers.setType('following');
				dispatch.followers.setProfile(profile);
				dispatch.followers.setUsers({users: users || [], parameters});
				dispatch.followers.setIsNoPermit(users === null);
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
