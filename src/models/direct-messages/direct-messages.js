import {ff} from '../../api';

const defaultState = {
	conversation: [],
	conversations: [],
	conversationParameters: null,
	conversationsParameters: null,
	isLoadingConversations: false,
	isLoadingEarlierConversation: false,
	isLoadingMoreConversations: false,
	isConversationTop: false,
	isConversationsBottom: false,
	isPosting: false
};

export const directMessages = {
	state: defaultState,

	reducers: {
		setConversation: (state, {conversation, conversationParameters}) => ({...state, conversation, conversationParameters}),
		setConversations: (state, {conversations, conversationsParameters}) => ({...state, conversations, conversationsParameters}),
		setIsLoadingConversations: (state, isLoadingConversations) => ({...state, isLoadingConversations}),
		setIsLoadingEarlierConversation: (state, isLoadingEarlierConversation) => ({...state, isLoadingEarlierConversation}),
		setIsLoadingMoreConversations: (state, isLoadingMoreConversations) => ({...state, isLoadingMoreConversations}),
		setIsConversationTop: (state, isConversationTop) => ({...state, isConversationTop}),
		setIsConversationsBottom: (state, isConversationsBottom) => ({...state, isConversationsBottom}),
		setIsPosting: (state, isPosting) => ({...state, isPosting})
	},

	effects: dispatch => ({
		fetchConversation: async conversationParameters => {
			try {
				const conversation = await ff.get('/direct_messages/conversation', {...conversationParameters});
				dispatch.directMessages.setConversation({conversation: conversation.reverse(), conversationParameters});
				dispatch.directMessages.setIsConversationTop(false);
			} catch {}
		},

		earlierConversation: async (_, state) => {
			if (state.directMessages.conversation.length > 0) {
				try {
					dispatch.directMessages.setIsLoadingEarlierConversation(true);
					const firstId = Number(state.directMessages.conversation[0].id) - 1;
					const conversation = await ff.get('/direct_messages/conversation', {...state.directMessages.conversationParameters, max_id: firstId});

					if (conversation.length === 0) {
						dispatch.directMessages.setIsConversationTop(true);
						dispatch.directMessages.setIsLoadingEarlierConversation(false);
						return;
					}

					dispatch.directMessages.setConversation({
						conversation: conversation.reverse().concat(state.directMessages.conversation),
						conversationParameters: {...state.directMessages.conversationParameters, max_id: firstId}
					});
					dispatch.directMessages.setIsLoadingEarlierConversation(false);
				} catch (error) {
					console.log(error);
					dispatch.directMessages.setIsLoadingEarlierConversation(false);
				}
			}
		},

		fetchConversations: async (conversationsParameters, state) => {
			try {
				dispatch.directMessages.setIsLoadingConversations(true);
				const conversations = await ff.get('/direct_messages/conversation_list', {...state.directMessages.conversationsParameters, ...conversationsParameters});
				dispatch.directMessages.setConversations({conversations, conversationsParameters});
				dispatch.directMessages.setIsConversationsBottom(false);
				dispatch.directMessages.setIsLoadingConversations(false);
				return conversations;
			} catch {
				dispatch.directMessages.setIsLoadingConversations(false);
				return [];
			}
		},

		moreConversations: async (_, state) => {
			try {
				dispatch.directMessages.setIsLoadingMoreConversations(true);
				const conversations = await ff.get('/direct_messages/conversation_list', {page: state.directMessages.conversationsParameters.page + 1});

				if (conversations.length === 0) {
					dispatch.directMessages.setIsConversationsBottom(true);
					dispatch.directMessages.setIsLoadingMoreConversations(false);
					return;
				}

				const mergedConversations = state.directMessages.conversations.concat(conversations);
				dispatch.directMessages.setConversations({
					conversations: mergedConversations,
					conversationsParameters: {page: state.directMessages.conversationsParameters.page + 1}
				});
				dispatch.directMessages.setIsLoadingMoreConversations(false);
			} catch {
				dispatch.directMessages.setIsLoadingMoreConversations(false);
			}
		},

		reply: async (parameters, state) => {
			try {
				dispatch.directMessages.setIsPosting(true);
				const message = await ff.post('/direct_messages/new', parameters);
				dispatch.directMessages.setConversation({
					conversation: state.directMessages.conversation.concat(message),
					conversationParameters: {id: parameters.user}
				});
				dispatch.directMessages.setIsPosting(false);
				return true;
			} catch {
				dispatch.directMessages.setIsPosting(false);
				return false;
			}
		}
	})
};
