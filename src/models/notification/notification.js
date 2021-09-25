import {ff} from '../../api.js';

export const defaultState = {
	notification: {
		direct_messages: 0,
		friend_requests: 0,
		mentions: 0,
	},
};

export const notification = {
	state: defaultState,

	reducers: {
		setNotification: (state, notification) => ({...state, notification}),
	},

	effects: dispatch => ({
		load: async () => {
			try {
				const notification = await ff.get('/account/notification');
				const {direct_messages: dm, mentions: m} = notification;
				const total = dm + m;

				document.title = total > 0 ? `饭否 Pro (${total})` : '饭否 Pro';

				dispatch.notification.setNotification(notification);
			} catch {}
		},
	}),
};
