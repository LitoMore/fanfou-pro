import {addStatusesHistory, loadStatusesHistory, deleteStatusesHistory} from '../../utils/indexed-db';

const defaultState = {
	timeline: []
};

export const history = {
	state: defaultState,

	reducers: {
		setTimeline: (state, timeline) => ({...state, timeline})
	},

	effects: dispatch => ({
		load: async () => {
			const timeline = await loadStatusesHistory();
			dispatch.history.setTimeline(timeline.sort((a, b) => b.rawid - a.rawid));
		},

		add: async status => {
			try {
				await addStatusesHistory(status);
				dispatch.history.load();
			} catch {}
		},

		remove: async id => {
			console.log('id', id);
			try {
				await deleteStatusesHistory(id);
				dispatch.history.load();
			} catch (error) {
				console.log(error);
			}
		}
	})
};
