const defaultState = {};

export const notification = {
	state: defaultState,

	reducers: {
		setNotification: (state, notification) => {
			return {...state, notification};
		}
	},

	effects: dispatch => ({
		updateNotification: notification => {
			dispatch.notification.setNotification(notification);
		}
	})
};
