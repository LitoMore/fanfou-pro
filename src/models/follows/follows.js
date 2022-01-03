import U from 'uprogress';
import {ff} from '../../api/index.js';
import {ffErrorHandler} from '../../utils/model.js';

const defaultState = {
	users: [],
	parameters: null,
	profile: null,
	isNoPermit: false,
	type: '',
};

export const follows = {
	state: defaultState,

	reducers: {
		setUsers: (state, {users, parameters}) => ({...state, users, parameters}),
		setProfile: (state, profile) => ({...state, profile}),
		setIsNoPermit: (state, isNoPermit) => ({...state, isNoPermit}),
		setType: (state, type) => ({...state, type}),
	},

	effects: dispatch => ({
		fetchFollowers: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				const [profile, users] = await Promise.all([
					state.login.current && (parameters.id === state.login.current.id) ? state.login.current : ff.get('/users/show', {id: parameters.id}),
					ff.get('/users/followers', {count: 20, ...parameters})
						.catch(() => Promise.resolve(null)),
				]);
				dispatch.follows.setType('followers');
				dispatch.follows.setProfile(profile);
				dispatch.follows.setUsers({users: users || [], parameters});
				dispatch.follows.setIsNoPermit(users === null);
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
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
						.catch(() => Promise.resolve(null)),
				]);
				dispatch.follows.setType('following');
				dispatch.follows.setProfile(profile);
				dispatch.follows.setUsers({users: users || [], parameters});
				dispatch.follows.setIsNoPermit(users === null);
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		},

		follow: async (id, state) => {
			const u = new U();
			const {profile} = state.user;
			const {setProfile} = dispatch.user;
			const {users} = state.follows;
			const {setUsers} = dispatch.follows;

			try {
				u.start();
				await ff.post('/friendships/create', {id});

				if (profile && profile.id === id) {
					setProfile({...profile, following: true});
				}

				setUsers({users: users.map(u => {
					if (u.id === id) {
						u.following = true;
						return u;
					}

					return u;
				})});

				dispatch.message.notify('关注成功！');
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		},

		unfollow: async (id, state) => {
			const u = new U();
			const {profile} = state.user;
			const {setProfile} = dispatch.user;
			const {users} = state.follows;
			const {setUsers} = dispatch.follows;

			try {
				u.start();
				await ff.post('/friendships/destroy', {id});

				if (profile && profile.id === id) {
					setProfile({...profile, following: false});
				}

				setUsers({users: users.map(u => {
					if (u.id === id) {
						u.following = false;
						return u;
					}

					return u;
				})});

				dispatch.message.notify('已取消关注！');
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		},
	}),
};
