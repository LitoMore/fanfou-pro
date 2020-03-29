const defaultState = {
	isOpen: false,
	isLoading: false,
	image: null
};

export const imageViewer = {
	state: defaultState,

	reducers: {
		setIsOpen: (state, isOpen) => ({...state, isOpen}),
		setIsLoading: (state, isLoading) => ({...state, isLoading}),
		setImage: (state, image) => ({...state, image})
	},

	effects: dispatch => ({
		open: url => {
			const {setIsOpen, setIsLoading, setImage} = dispatch.imageViewer;
			setIsOpen(true);
			setIsLoading(true);
			const image = new Image();
			image.addEventListener('load', () => {
				setIsLoading(false);
			});
			image.src = url;
			setImage(image);
		},

		close: () => {
			const {setIsOpen, setIsLoading, setImage} = dispatch.imageViewer;
			setIsOpen(false);
			setIsLoading(false);
			setImage(null);
		}
	})
};
