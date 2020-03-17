import UProgress from 'uprogress';

export const uProgress = new UProgress({
	duration: 7000,
	end: 0.7
});

export const startProgress = () => {
	const {progress} = uProgress.status();
	if (progress) {
		uProgress.refresh();
	} else {
		uProgress.start();
	}
};

export const stopProgress = () => {
	uProgress.done();
};
