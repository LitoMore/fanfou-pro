import {ff} from '../../api';

export const defaultState = {
	notification: {
		direct_messages: 0,
		friend_requests: 0,
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
				const {direct_messages: dm, mentions: m} = notification;
				const total = dm + m;

				if (total > 0) {
					document.title = `饭否 Pro (${total})`;
				} else {
					document.title = '饭否 Pro';
				}

				dispatch.notification.setNotification(notification);
			} catch {}
		}
	})
};
