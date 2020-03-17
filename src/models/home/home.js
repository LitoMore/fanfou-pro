import {ff} from '../../api';
import {startProgress, stopProgress} from '../../components';

const defaultState = {
	loading: false,
	timleine: [],
	parameters: null
};

export const home = {
	state: defaultState,

	reducers: {
		setTimeline: (state, {timeline, parameters}) => ({...state, timeline, parameters})
	},

	effects: dispatch => ({
		fetch: async parameters => {
			try {
				startProgress();
				const timeline = await ff.get('/statuses/home_timeline', {...parameters});
				dispatch.home.setTimeline({timeline, parameters});
			} finally {
				stopProgress();
			}
		}
	})
};
