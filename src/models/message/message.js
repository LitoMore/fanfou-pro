const defaultState = {
	message: '',
};

export const message = {
	state: defaultState,

	reducers: {
		setMessage: (state, message) => ({...state, message}),
	},

	effects: dispatch => ({
		notify: message => {
			dispatch.message.setMessage(message);
		},
	}),
};
