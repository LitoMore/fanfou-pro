import U from 'uprogress';
import {ff} from '../../api';
import {ffErrorHandler} from '../../utils/model';

const defaultState = {
	users: [],
	parameters: null,
	profile: null
};

export const requests = {
	state: defaultState,

	reducers: {
		setUsers: (state, {users, parameters}) => ({...state, users, parameters}),
		setProfile: (state, profile) => ({...state, profile})
	},

	effects: dispatch => ({
		fetchRequests: async parameters => {
			const u = new U();

			try {
				u.start();
				const users = await ff.get('/friendships/requests', {count: 20, ...parameters});
				dispatch.requests.setUsers({users, parameters});
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		},

		follow: async (id, state) => {
			const u = new U();
			const {users} = state.requests;
			const {setUsers} = dispatch.requests;

			try {
				u.start();
				await ff.post('/friendships/create', {id});

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

		accept: async (id, state) => {
			const u = new U();
			const {users} = state.requests;
			const {setUsers} = dispatch.requests;

			try {
				u.start();
				await ff.post('/friendships/accept', {id});

				setUsers({users: users.map(u => {
					if (u.id === id) {
						u.accept = true;
						return u;
					}

					return u;
				})});

				dispatch.message.notify('已接受好友请求！');
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		},

		deny: async (id, state) => {
			const u = new U();
			const {users} = state.requests;
			const {setUsers} = dispatch.requests;

			try {
				u.start();
				await ff.post('/friendships/deny', {id});

				setUsers({users: users.map(u => {
					if (u.id === id) {
						u.deny = true;
						return u;
					}

					return u;
				})});

				dispatch.message.notify('已拒绝好友请求！');
				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		}
	})
};
