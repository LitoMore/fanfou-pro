import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {LoadingOutlined, SendOutlined} from '@ant-design/icons';
import {ConversationCard, ChatBubble} from '../components';

export default @connect(
	state => ({
		current: state.login.current,
		conversation: state.directMessages.conversation,
		conversationParameters: state.directMessages.conversationParameters,
		conversations: state.directMessages.conversations,
		isLoadingConversations: state.directMessages.isLoadingConversations,
		isLoadingMoreConversations: state.directMessages.isLoadingMoreConversations,
		isLoadingEarlierConversation: state.directMessages.isLoadingEarlierConversation,
		isConversationsBottom: state.directMessages.isConversationsBottom,
		isConversationTop: state.directMessages.isConversationTop,
		isPosting: state.directMessages.isPosting
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetchConversation: dispatch.directMessages.fetchConversation,
		fetchConversations: dispatch.directMessages.fetchConversations,
		moreConversations: dispatch.directMessages.moreConversations,
		earlierConversation: dispatch.directMessages.earlierConversation,
		reply: dispatch.directMessages.reply
	})
)

class DirectMessages extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		conversation: PropTypes.array,
		conversationParameters: PropTypes.object,
		conversations: PropTypes.array,
		isLoadingConversations: PropTypes.bool,
		isLoadingMoreConversations: PropTypes.bool,
		isLoadingEarlierConversation: PropTypes.bool,
		isConversationsBottom: PropTypes.bool,
		isConversationTop: PropTypes.bool,
		isPosting: PropTypes.bool,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func,
		fetchConversation: PropTypes.func,
		fetchConversations: PropTypes.func,
		moreConversations: PropTypes.func,
		earlierConversation: PropTypes.func,
		reply: PropTypes.func
	}

	static defaultProps = {
		current: null,
		conversation: [],
		conversationParameters: null,
		conversations: [],
		isLoadingConversations: false,
		isLoadingMoreConversations: false,
		isLoadingEarlierConversation: false,
		isConversationsBottom: false,
		isConversationTop: false,
		isPosting: false,
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {},
		fetchConversation: () => {},
		fetchConversations: () => {},
		moreConversations: () => {},
		earlierConversation: () => {},
		reply: () => {}
	}

	side = React.createRef()
	main = React.createRef()
	anchor = React.createRef()
	textarea = React.createRef()

	quickSubmitFired = false

	state = {
		selectedKey: '',
		text: '',
		innerHeight: window.innerHeight
	}

	async componentDidMount() {
		window.addEventListener('resize', this.handleResize);

		const {setPostFormPage, setPostFormFloatPage, fetchConversation, fetchConversations} = this.props;
		setPostFormPage('direct_messages');
		setPostFormFloatPage('direct_messages');
		const list = await fetchConversations({page: 1});
		if (list.length > 0) {
			const [conversation] = list;
			this.setState({selectedKey: conversation.dm.id});
			await fetchConversation({id: conversation.otherid});
			if (this.anchor.current) {
				this.anchor.current.scrollIntoView();
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize = () => {
		this.setState({innerHeight: window.innerHeight});
	}

	handleSelect = selectedKey => {
		this.setState({selectedKey});
	}

	handlePaste = event => {
		event.preventDefault();
		document.execCommand('inserttext', false, event.clipboardData.getData('text/plain'));
	}

	handleSideScroll = () => {
		const {isLoadingMoreConversations, isConversationsBottom, moreConversations} = this.props;
		const {offsetHeight, scrollTop, scrollHeight} = this.side.current;
		if (!isLoadingMoreConversations && !isConversationsBottom && (offsetHeight + scrollTop === scrollHeight)) {
			moreConversations();
		}
	}

	handleMainScroll = async () => {
		const {isLoadingEarlierConversation, isConversationTop, earlierConversation} = this.props;
		const {scrollTop, scrollHeight} = this.main.current;
		const previousHeight = scrollHeight;
		if (!isLoadingEarlierConversation && !isConversationTop && scrollTop === 0) {
			await earlierConversation();
			const offset = this.main.current.scrollHeight - previousHeight;
			this.main.current.scrollTop = offset - 14;
		}
	}

	handleKeyDown = event => {
		if (event.keyCode === 13) {
			event.preventDefault();
		}

		if (this.qucickSubmitFired) {
			return;
		}

		if (event.keyCode === 13 && (event.metaKey || event.ctrlKey)) {
			this.qucickSubmitFired = true;
			this.handleSend();
		}
	}

	handleKeyUp = event => {
		if (event.keyCode === 13 || event.keyCode === 93) {
			this.qucickSubmitFired = false;
		}
	}

	handleInput = event => {
		this.setState({text: event.currentTarget.textContent});
	}

	handleSend = async () => {
		const {current, conversation, conversationParameters, reply} = this.props;
		const {text} = this.state;

		if (text) {
			const parameters = {
				text,
				user: conversationParameters.id
			};

			const filtered = conversation.filter(c => !(c.sender_id === current.id || c.sender_id === current.unique_id));

			if (filtered.length > 0) {
				parameters.in_reply_to_id = filtered.reverse()[0].id;
			}

			const sent = await reply(parameters);

			if (sent) {
				this.setState({text: ''});
				this.textarea.current.textContent = '';
				this.anchor.current.scrollIntoView();
			}
		}
	}

	render() {
		const {current, conversation, conversations, isLoadingConversations, isLoadingMoreConversations, isLoadingEarlierConversation, isPosting, fetchConversation} = this.props;
		const {innerHeight, selectedKey, text} = this.state;

		if (!current) {
			return null;
		}

		return (
			<Container innerHeight={innerHeight}>
				<Side ref={this.side} onScroll={this.handleSideScroll}>
					{isLoadingConversations ? <SideLoading css="margin-top: 10px;"><LoadingOutlined/></SideLoading> : null}
					{conversations.map(c => (
						<ConversationCard
							key={c.dm.id}
							isActive={selectedKey === c.dm.id}
							conversation={c}
							onClick={async () => {
								this.handleSelect(c.dm.id);
								await fetchConversation({id: c.otherid});
								this.anchor.current.scrollIntoView();
							}}
						/>
					))}
					{isLoadingMoreConversations ? <SideLoading css="float: left;"><LoadingOutlined/></SideLoading> : null}
				</Side>
				<Main ref={this.main} onScroll={this.handleMainScroll}>
					<div css="margin-bottom: 45px;">
						{isLoadingEarlierConversation ? <MainLoading><LoadingOutlined/></MainLoading> : null}
						{conversation.map((m, i) => (
							<ChatBubble
								key={m.id}
								isMe={m.sender_id === current.id || m.sender_id === current.unique_id}
								hasTimeTag={(conversation[i + 1] && conversation[i + 1].sender_id !== m.sender_id) || conversation.length - 1 === i}
								message={m}
							/>
						))}
						<div ref={this.anchor}/>
					</div>
					<InputField>
						<TextArea
							ref={this.textarea}
							onPaste={this.handlePaste}
							onKeyDown={this.handleKeyDown}
							onKeyUp={this.handleKeyUp}
							onInput={this.handleInput}
						/>
						<PostIcon disabled={text.length === 0} onClick={this.handleSend}>
							{isPosting ? <LoadingOutlined/> : <SendOutlined/>}
						</PostIcon>
					</InputField>
				</Main>
			</Container>
		);
	}
}

const Base = styled.div`
	padding: 20px;
`;

const Side = styled(Base)`
	background-color: rgba(255, 255, 255, 1);
	border-right: 1px solid #eee;
	box-sizing: border-box;
	display: inline-block;
	overflow: scroll;
	padding: 0;
	vertical-align: top;
	width: 235px;

	::-webkit-scrollbar {
		background: transparent;
		height: 0;
		width: 0;
	}
`;

const SideLoading = styled.div`
	margin-bottom: 5px;
	text-align: center;
	width: 235px;
`;

const Main = styled(Base)`
	background-color: white;
	box-sizing: border-box;
	display: inline-block;
	overflow: scroll;
	vertical-align: top;
	width: 540px;
`;

const MainLoading = styled.div`
	float: left;
	margin-bottom: 5px;
	margin-top: -10px;
	text-align: center;
	width: 500px;
`;

const InputField = styled.div`
	background-color: white;
	border-top: 1px solid #eee;
	bottom: 0;
	margin: 0 -20px;
	min-height: 50px;
	position: absolute;
	width: 540px;
`;

const TextArea = styled.div.attrs(() => ({
	autoComplete: 'off',
	contentEditable: true
}))`
	float: left;
	outline: 0;
	resize: none;
	background-color: rgb(230, 236, 240);
	border: 0;
	width: 480px;
	min-height: 30px;
	max-height: 90px;
	margin: 10px 0 10px 10px;
	border-radius: 10px;
	padding: 5px 9px;
	box-sizing: border-box;
	overflow: auto;
`;

const PostIcon = styled.div`
	color: ${props => props.disabled ? '#eee' : '#00ccff99'};
	display: table-cell;
	float: left;
	font-size: 20px;
	height: 30px;
	margin: 10px;
	padding: 2px;
	text-align: center;
	vertical-align: middle;
	width: 30px;

	${props => props.disabled ? '' : `
		cursor: pointer;

		&:hover {
			color: #0cf;
		}
	`}
`;

const Container = styled.div`
	border-radius: 10px;
	display: flex;
	height: ${props => props.innerHeight - 147}px;
	overflow: hidden;
	position: relative;

	&:focus-within ${TextArea} {
		background-color: white;
		border: 2px solid #0cf;
		padding: 3px 7px;
	}
`;
