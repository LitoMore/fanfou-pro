import U from 'uprogress';
import {ff} from '../../api';

const defaultState = {
	ref: null,
	isShow: false,
	reference: '',
	text: '',
	page: '',
	inReplyToStatusId: null,
	repostStatusId: null
};

export const postFormFloat = {
	state: defaultState,

	reducers: {
		setRef: (state, ref) => ({...state, ref}),
		setShow: (state, isShow) => ({...state, isShow}),
		setReference: (state, reference) => ({...state, reference}),
		setText: (state, text) => ({...state, text}),
		reset: state => {
			const {ref, ...restState} = defaultState;
			return {...state, ...restState};
		}
	},

	effects: dispatch => ({
		hide: () => {
			dispatch.postFormFloat.reset();
		},

		reply: (status, state) => {
			const {ref} = state.postFormFloat;
			const {setShow, setReference, setText} = dispatch.postFormFloat;
			const users = [`@${status.user.name}`].concat([...new Set(status.txt.filter(t => t.type === 'at').map(t => t.text))]);
			const text = users.join(' ') + ' ';
			const reference = '回复：' + (status.plain_text.length > 20 ?
				status.plain_text.slice(0, 20) + '…' :
				status.plain_text);

			setReference(reference);
			setText(text);
			setShow(true);
			ref.current.focus();
			ref.current.selectionStart = `@${status.user.name} `.length;
			ref.current.selectionEnd = text.length;
		},

		repost: (status, state) => {
			const {ref} = state.postFormFloat;
			const {setShow, setReference, setText} = dispatch.postFormFloat;
			const text = ' 转@' + status.user.name + ' ' + status.plain_text;

			setReference('');
			setText(text);
			setShow(true);
			ref.current.focus();
			ref.current.selectionStart = 0;
			ref.current.selectionEnd = 0;
			ref.current.scrollTop = 0;
		},

		update: async (parameters, state) => {
			const u = new U();

			try {
				u.start();
				await ff.post('/statuses/update', {...parameters});
				dispatch.postFormFloat.reset();
				dispatch.message.notify('发送成功！');
				u.done();

				switch (state.postForm.page) {
					case 'home':
						dispatch.home.fetch({format: 'html'});
						break;
					default:
						break;
				}
			} catch (error) {
				const body = await error.response.text();
				let errorMessage = error.message;

				try {
					const result = JSON.parse(body);
					if (result.error) {
						errorMessage = result.error;
					}
				} catch {}

				dispatch.message.notify(errorMessage);
				u.done();
			}
		}
	})
};
