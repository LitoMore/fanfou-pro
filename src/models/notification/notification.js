import {ff} from '../../api';

export const defaultState = {
	notification: {
		direct_messages: 100,
		friend_requests: 100,
		mentions: 100
	}
};

export const notification = {
	state: defaultState,

	reducers: {
		setNotification: (state, notification) => ({...state, notification})
	},

	effects: dispatch => ({
		load: async () => {
			try {
				const notification = await ff.get('/account/notification');
				dispatch.notification.setNotification(notification);
			} catch {}
		}
	})
};
