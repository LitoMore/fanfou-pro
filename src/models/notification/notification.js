import {ff} from '../../api';

export const defaultState = {
	notification: {
		// eslint-disable-next-line
		direct_messages: 0,
		// eslint-disable-next-line
		friend_requests: 5,
		mentions: 0
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
