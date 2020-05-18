import {ff} from '../../api';

const defaultState = {
	accounts: [],
	current: null
};

export const login = {
	state: defaultState,

	reducers: {
		addAccount: (state, account) => {
			const accounts = state.accounts.filter(a => a.id !== account.id);
			accounts.unshift(account);
			return {...state, accounts};
		},

		setCurrent: (state, current) => {
			return {...state, current};
		},

		removeAccount: (state, id) => {
			const accounts = state.accounts.filter(a => a.id !== id);
			return {...state, accounts};
		}
	},

	effects: dispatch => ({
		login: account => {
			dispatch.login.addAccount(account);
			dispatch.login.setCurrent(account);
		},

		logout: id => {
			dispatch.login.removeAccount(id);
			dispatch.login.setCurrent(null);
		},

		loadCurrent: async (_, state) => {
			try {
				const current = await ff.get('/users/show');
				dispatch.login.setCurrent(current);
				return current;
			} catch {
				return state.login.current;
			}
		}
	})
};
