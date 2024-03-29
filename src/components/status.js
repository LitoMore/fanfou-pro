import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
import {LoadingOutlined} from '@ant-design/icons';
import moment from 'moment';
import {ff} from '../api/index.js';
import {ffErrorHandler} from '../utils/model.js';
import msgIcons from '../assets/msg-icons.svg';
import favoriteStar from '../assets/favorite-star.svg';

export default @withRouter @connect(
	_ => ({}),
	dispatch => ({
		reply: dispatch.postFormFloat.reply,
		repost: dispatch.postFormFloat.repost,
		favorite: dispatch.postFormFloat.favorite,
		destroy: dispatch.postFormFloat.destroy,
		resend: dispatch.postFormFloat.resend,
		removeHistory: dispatch.history.remove,
		fetchUser: dispatch.user.fetch,
		fetchSearch: dispatch.search.fetch,
		openImage: dispatch.imageViewer.open,
		notify: dispatch.message.notify,
	}),
)

class Status extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		type: PropTypes.string,
		status: PropTypes.object,
		reply: PropTypes.func,
		repost: PropTypes.func,
		favorite: PropTypes.func,
		destroy: PropTypes.func,
		resend: PropTypes.func,
		removeHistory: PropTypes.func,
		fetchUser: PropTypes.func,
		fetchSearch: PropTypes.func,
		openImage: PropTypes.func,
		notify: PropTypes.func,
	};

	static defaultProps = {
		status: null,
		type: '',
		reply: () => {},
		repost: () => {},
		favorite: () => {},
		destroy: () => {},
		resend: () => {},
		removeHistory: () => {},
		fetchUser: () => {},
		fetchSearch: () => {},
		openImage: () => {},
		notify: () => {},
	};

	state = {
		isLoadingContext: false,
		context: [],
	};

	reply = () => {
		const {status, reply} = this.props;
		reply(status);
	};

	repost = () => {
		const {status, repost} = this.props;
		repost(status);
	};

	favorite = () => {
		const {status, favorite} = this.props;
		favorite(status);
	};

	destroy = () => {
		const {status, destroy} = this.props;
		// eslint-disable-next-line
		const choice = confirm('你确定要删除这条消息吗？');
		if (choice === true) {
			destroy(status);
		}
	};

	resendHistory = () => {
		const {status, resend} = this.props;
		resend(status);
	};

	removeStatusesHistory = () => {
		const {status, removeHistory} = this.props;
		// eslint-disable-next-line
		const choice = confirm('你确定要删除这条回顾吗？');
		if (choice === true) {
			removeHistory(status.id);
		}
	};

	goToUser = async id => {
		const {history, fetchUser} = this.props;
		await fetchUser({id, format: 'html'});
		history.push(`/${id}`);
	};

	goToSearch = async q => {
		const {history, fetchSearch} = this.props;
		await fetchSearch({q, format: 'html'});
		history.push(`/search/${q}`);
	};

	parseBold = (t, key) => {
		if (t.bold_arr) {
			return t.bold_arr.map((b, i) => b.bold
				? <Bold key={key + String(i)}>{b.text}</Bold>
				: <Text key={key + String(i)}>{b.text}</Text>);
		}

		return t.text;
	};

	getContext = async (id, type) => {
		if (this.state.context.length > 0) {
			this.setState({context: []});
			return;
		}

		try {
			this.setState({isLoadingContext: true});
			const context = await ff.get('/statuses/context_timeline', {id, format: 'html'});
			this.setState({
				isLoadingContext: false,
				context: type === 'reply' ? context.filter(status => status.id === id) : context,
			});
		} catch (error) {
			this.setState({isLoadingContext: false});
			const errorMessage = await ffErrorHandler(error);
			this.props.notify(errorMessage);
		}
	};

	render() {
		const {status, openImage, type} = this.props;
		const {isLoadingContext, context} = this.state;

		if (!status) {
			return null;
		}

		return (
			<>
				<Container>
					<div>
						<AvatarLink onClick={() => this.goToUser(status.user.id)}>
							<Avatar src={status.user.profile_image_url_large.replace(/^http:/, 'https:')}/>
						</AvatarLink>
						<Content>
							{status.photo ? <Photo src={status.photo.thumburl} onClick={() => openImage(status.photo.originurl)}/> : null}
							<UserLink
								css="color: #222; font-weight: 600; line-height: 1.6;"
								onClick={() => this.goToUser(status.user.id)}
							>
								{status.user.name}
							</UserLink>
							<Paragraph>
								{status.txt.map((t, idx) => {
									const key = `part-${String(idx)}`;
									switch (t.type) {
										case 'at':
											return <span key={key}><UserLink onClick={() => this.goToUser(t.id)}>{this.parseBold(t)}</UserLink></span>;
										case 'link':
											return <span key={key}><UserLink as="a" href={t.link} target="_blank" rel="noopener noreferrer">{this.parseBold(t)}</UserLink></span>;
										case 'tag':
											return <span key={key}><UserLink onClick={() => this.goToSearch(t.query)}>{this.parseBold(t)}</UserLink></span>;
										default:
											return this.parseBold(t, key);
									}
								})}
							</Paragraph>
						</Content>
						<Info>
							<Time>{moment(new Date(status.created_at)).fromNow()}</Time>
							{' 通过 '}
							<SourceName>
								{status.source_url ? (
									<SourceUrl href={status.source_url} target="_blank" rel="noopener noreferrer">{status.source_name}</SourceUrl>
								) : status.source_name}
							</SourceName>
							{status.in_reply_to_screen_name ? <Reference onClick={() => this.getContext(status.in_reply_to_status_id, 'reply')}>{` 给${status.in_reply_to_screen_name}的回复 `}</Reference> : ''}
							{status.repost_status_id ? <Reference onClick={() => this.getContext(status.repost_status_id, 'repost')}>{` 转自${status.repost_screen_name} `}</Reference> : ''}
							{isLoadingContext ? <LoadingOutlined/> : null}
						</Info>
						{type === 'statuses_history' ? (
							<IconGroup>
								<Resend onClick={this.resendHistory}/>
								<Destroy onClick={this.removeStatusesHistory}/>
							</IconGroup>
						) : (
							<IconGroup>
								{status.is_self ? null : <Reply onClick={this.reply}/>}
								<Favorite favorited={status.favorited} onClick={this.favorite}/>
								<Repost onClick={this.repost}/>
								{status.is_self ? <Destroy onClick={this.destroy}/> : null}
							</IconGroup>
						)}
						{status.favorited ? <FavoriteStar/> : null}
					</div>

				</Container>
				<Context>
					{context.length > 0 ? (
						context.map(status => <Status key={'context-' + status.id} {...this.props} status={status}/>)
					) : null}
				</Context>
			</>
		);
	}
}

const AvatarLink = styled.a`
	float: left;
	margin-top: 3px;
	margin-left: -59px;
	text-decoration: none;
	cursor: pointer;
`;

const UserLink = styled.a`
	color: #06c;
	text-decoration: none;
	cursor: pointer;

	&:hover {
		color: #06c;
	}

	&:visited {
		color: #06c;
	}
`;

const Paragraph = styled.div`
	white-space: pre-line;
`;

const Avatar = styled.img`
	display: block;
	width: 48px;
	height: 48px;
	border-radius: 2px;
`;

const Content = styled.div`
	word-break: break-word;
`;

const Text = styled.span`
	white-space: pre-line;
`;

const Bold = styled(Text)`
	background-color: #ffff0099;
`;

const Photo = styled.img`
	float: right;
	margin-left: 5px;
	border-radius: 4px;
	cursor: pointer;
`;

const Time = styled.span``;

const SourceName = styled.span``;

const Reference = styled.span`
	cursor: pointer;
`;

const SourceUrl = styled.a`
	color: #999;
`;

const Info = styled.div`
	margin-top: 3px;
	color: #999;
	font-size: 12px;
`;

const IconGroup = styled.div`
	position: absolute;
	top: 7px;
	right: 5px;
	float: right;
	width: 40px;
`;

const MessageIcon = styled.div`
	width: 40px;
	height: 16px;
	background-image: url(${msgIcons});

	&:hover {
		background-position-x: 40px;
		cursor: pointer;
	}

	&:nth-child(n+2) {
		margin-top: 4px;
	}
`;

const Reply = styled(MessageIcon)`
`;

const Favorite = styled(MessageIcon)`
	background-position-y: ${props => props.favorited ? '-48px' : '-16px'};
`;

const Repost = styled(MessageIcon)`
	background-position-y: -64px;
`;

const Resend = styled(MessageIcon)`
	background-position-y: -80px;
`;

const Destroy = styled(MessageIcon)`
	background-position-y: -32px;
`;

const FavoriteStar = styled.div`
	position: absolute;
	top: 16px;
	right: 16px;
	width: 16px;
	height: 16px;
	background-image: url(${favoriteStar});
`;

const Context = styled.div`
	padding-left: 20px !important;
	font-size: 12px;

	${Avatar} {
		width: 32px;
		height: 32px;
	}

	${Info} {
		margin-left: -16px;
		font-size: 10px;
	}

	${Content} {
		margin-left: -16px;
	}
`;

const Container = styled.div`
	position: relative;
	overflow: hidden;
	padding: 9px 50px 12px 62px;
	min-height: 50px;
	height: auto;
	border-bottom: 1px solid #eee;

	&:hover {
		background-color: #f5f5f5;
	}

	&:hover ${IconGroup} {
		visibility: visible;
	}

	&:hover ${FavoriteStar} {
		visibility: hidden;
	}

	&:hover ${Time} {
		color: #06c;
	}

	&:hover ${SourceUrl} {
		color: #06c;
	}

	&:hover ${Reference} {
		color: #06c;
	}

	${IconGroup} {
		visibility: hidden;
	}
`;
