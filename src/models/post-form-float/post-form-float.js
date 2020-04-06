import U from 'uprogress';
import {ff} from '../../api';
import {ffErrorHandler} from '../../utils/model';

const defaultState = {
	ref: null,
	isShow: false,
	reference: '',
	text: '',
	file: null,
	page: '',
	inReplyToStatusId: null,
	repostStatusId: null,
	isPosting: false,
	isResend: false
};

export const postFormFloat = {
	state: defaultState,

	reducers: {
		setRef: (state, ref) => ({...state, ref}),
		setShow: (state, isShow) => ({...state, isShow}),
		setReference: (state, reference) => ({...state, reference}),
		setText: (state, text) => ({...state, text}),
		setFile: (state, file) => ({...state, file}),
		setPage: (state, page) => ({...state, page}),
		setInReplyToStatusId: (state, inReplyToStatusId) => ({...state, inReplyToStatusId}),
		setRepostStatusId: (state, repostStatusId) => ({...state, repostStatusId}),
		setIsPosting: (state, isPosting) => ({...state, isPosting}),
		setIsResend: (state, isResend) => ({...state, isResend}),
		reset: state => {
			const {ref, page, ...restState} = defaultState;
			return {...state, ...restState};
		}
	},

	effects: dispatch => ({
		hide: () => {
			dispatch.postFormFloat.reset();
		},

		resend: (status, state) => {
			const {ref} = state.postFormFloat;
			const {setShow, setIsResend, setReference, setText, setFile} = dispatch.postFormFloat;
			const text = status.plain_text;

			if (status.file) {
				setFile(status.file);
			}

			setIsResend(true);
			setReference('重发：');
			setText(text);
			setShow(true);
			setTimeout(() => {
				ref.current.focus();
				ref.current.selectionStart = text.length;
				ref.current.selectionEnd = text.length;
			}, 200);
		},

		comment: (user, state) => {
			const {ref} = state.postFormFloat;
			const {setShow, setText} = dispatch.postFormFloat;
			const text = `@${user.name} `;

			setText(text);
			setShow(true);
			setTimeout(() => {
				ref.current.focus();
				ref.current.selectionStart = text.length;
				ref.current.selectionEnd = text.length;
			}, 200);
		},

		reply: (status, state) => {
			const {current} = state.login;
			const {ref} = state.postFormFloat;
			const {setShow, setReference, setText, setInReplyToStatusId} = dispatch.postFormFloat;
			const users = [...new Set([`@${status.user.name}`].concat(status.txt.filter(t => t.type === 'at' && t.id !== current.id).map(t => t.text)))];
			const text = users.join(' ') + ' ';
			const reference = '回复：' + (status.plain_text.length > 20 ?
				status.plain_text.slice(0, 20) + '…' :
				status.plain_text);

			setInReplyToStatusId(status.id);
			setReference(reference);
			setText(text);
			setShow(true);
			setTimeout(() => {
				ref.current.focus();
				ref.current.selectionStart = `@${status.user.name} `.length;
				ref.current.selectionEnd = text.length;
			}, 200);
		},

		repost: (status, state) => {
			const {ref} = state.postFormFloat;
			const {setShow, setReference, setText, setRepostStatusId} = dispatch.postFormFloat;
			const text = ' 转@' + status.user.name + ' ' + status.plain_text;

			setRepostStatusId(status.repost_status_id || status.id);
			setReference('');
			setText(text);
			setShow(true);
			setTimeout(() => {
				ref.current.focus();
				ref.current.selectionStart = 0;
				ref.current.selectionEnd = 0;
				ref.current.scrollTop = 0;
			}, 200);
		},

		update: async (_, state) => {
			const {text, inReplyToStatusId, repostStatusId} = state.postFormFloat;
			const parameters = {
				status: text,
				in_reply_to_status_id: inReplyToStatusId,
				repost_status_id: repostStatusId
			};

			if (!inReplyToStatusId) {
				delete parameters.in_reply_to_status_id;
			}

			if (!repostStatusId) {
				delete parameters.repost_status_id;
			}

			try {
				dispatch.postFormFloat.setIsPosting(true);
				let status = await (state.postFormFloat.file ?
					ff.upload('/photos/upload', {...parameters, photo: state.postFormFloat.file}) :
					ff.post('/statuses/update', parameters));

				try {
					status = await ff.get('/statuses/show', {id: status.id, format: 'html'});
				} catch {}

				const {page} = state.postFormFloat;
				dispatch.postFormFloat.reset();
				dispatch.message.notify('发送成功！');

				switch (page) {
					case 'home':
						status.virtual = true;
						dispatch[page].setTimeline({timeline: [status].concat(state[page].timeline)});
						break;
					default:
						break;
				}

				dispatch.postFormFloat.setIsPosting(false);
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				dispatch.postFormFloat.setIsPosting(false);
			}
		},

		favorite: async (status, state) => {
			const u = new U();

			try {
				u.start();
				const favorite = await ff.post(`/favorites/${status.favorited ? 'destroy' : 'create'}/${status.id}`);
				const {page} = state.postFormFloat;

				switch (page) {
					case 'home':
					case 'mentions':
					case 'favorites':
					case 'user':
					case 'search': {
						const {timeline} = state[page];
						const {setTimeline} = dispatch[page];

						setTimeline({timeline: timeline.map(t => {
							if (t.id !== favorite.id) {
								return t;
							}

							t.favorited = favorite.favorited;
							return t;
						})});

						dispatch.message.notify(`${favorite.favorited ? '' : '取消'}收藏成功！`);
						break;
					}

					default:
						break;
				}

				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		},

		destroy: async (status, state) => {
			const u = new U();

			try {
				u.start();
				const deleted = await ff.post('/statuses/destroy', {id: status.id});
				const {page} = state.postFormFloat;

				switch (page) {
					case 'home':
					case 'mentions':
					case 'favorites':
					case 'user':
					case 'search': {
						const {timeline} = state[page];
						const {setTimeline} = dispatch[page];
						setTimeline({timeline: timeline.filter(t => t.id !== deleted.id)});
						dispatch.message.notify('删除成功！');
						break;
					}

					default:
						break;
				}

				u.done();
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				dispatch.message.notify(errorMessage);
				u.done();
			}
		}
	})
};
