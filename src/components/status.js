import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import msgIcons from '../assets/msg-icons.svg';
import favoriteStar from '../assets/favorite-star.svg';

export default @withRouter @connect(
	state => ({
		current: state.login.current
	}),
	dispatch => ({
		reply: dispatch.postFormFloat.reply,
		repost: dispatch.postFormFloat.repost,
		favorite: dispatch.postFormFloat.favorite,
		destroy: dispatch.postFormFloat.destroy,
		fetchUser: dispatch.user.fetch
	})
)

class Status extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		current: PropTypes.object,
		status: PropTypes.object,
		reply: PropTypes.func,
		repost: PropTypes.func,
		favorite: PropTypes.func,
		destroy: PropTypes.func,
		fetchUser: PropTypes.func
	}

	static defaultProps = {
		current: null,
		status: null,
		reply: () => {},
		repost: () => {},
		favorite: () => {},
		destroy: () => {},
		fetchUser: () => {}
	}

	reply = () => {
		const {status, reply} = this.props;
		reply(status);
	}

	repost = () => {
		const {status, repost} = this.props;
		repost(status);
	}

	favorite = () => {
		const {status, favorite} = this.props;
		favorite(status);
	}

	destroy = () => {
		const {status, destroy} = this.props;
		// eslint-disable-next-line
		const choice = confirm('你确定要删除这条消息吗？');
		if (choice === true) {
			destroy(status);
		}
	}

	goToUser = async id => {
		const {history, fetchUser} = this.props;
		await fetchUser({id, format: 'html'});
		history.push(`/${id}`);
	}

	render() {
		const {current, status} = this.props;
		const linkColor = current ? current.profile_link_color : '#06c';

		if (!status) {
			return null;
		}

		return (
			<Container color={linkColor}>
				<div>
					<AvatarLink onClick={() => this.goToUser(status.user.id)}>
						<Avatar src={status.user.profile_image_origin_large}/>
					</AvatarLink>
					<Content>
						{status.photo ? <Photo color={linkColor} src={status.photo.thumburl}/> : null}
						<UserLink
							css="color: #222; font-weight: 600; line-height: 1.6;"
							onClick={() => this.goToUser(status.user.id)}
						>
							{status.user.name}
						</UserLink>
						<div>
							{status.txt.map((t, i) => {
								const key = String(i);
								switch (t.type) {
									case 'at':
										return <span key={key}><UserLink color={linkColor} onClick={() => this.goToUser(t.id)}>{t.text}</UserLink></span>;
									case 'link':
										return <span key={key}><UserLink as="a" color={linkColor} href={t.link} target="_blank" rel="noopener noreferrer">{t.text}</UserLink></span>;
									case 'tag':
										return <span key={key}>{t.text}</span>;
									default:
										return <span key={key}>{t.text}</span>;
								}
							})}
						</div>
					</Content>
					<Info>
						<Time>{moment(new Date(status.created_at)).fromNow()}</Time>
						{' 通过 '}
						<SourceName>
							{status.source_url ? (
								<SourceUrl href={status.source_url} target="_blank" rel="noopener noreferrer">{status.source_name}</SourceUrl>
							) : status.source_name}
						</SourceName>
						{status.repost_status ? ` 转自${status.repost_status.user.name}` : ''}
					</Info>
					<IconGroup>
						{status.is_self ? null : <Reply onClick={this.reply}/>}
						<Favorite favorited={status.favorited} onClick={this.favorite}/>
						<Repost onClick={this.repost}/>
						{status.is_self ? <Destroy onClick={this.destroy}/> : null}
					</IconGroup>
					{status.favorited ? <FavoriteStar/> : null}
				</div>
			</Container>
		);
	}
}

const AvatarLink = styled.a`
	float: left;
	margin-left: -59px;
	margin-top: 3px;
	text-decoration: none;
	cursor: pointer;
`;

const UserLink = styled.a`
	text-decoration: none;
	color: ${props => props.color};
	cursor: pointer;

	&:visited {
		color: ${props => props.color};
	}
`;

const Avatar = styled.img`
	display: block;
	width: 48px;
	height: 48px;
	border-radius: 2px;
`;

const Content = styled.div`
`;

const Photo = styled.img`
	float: right;
	border-radius: 4px;
	cursor: pointer;
`;

const Time = styled.span``;

const SourceName = styled.span``;

const SourceUrl = styled.a`
	color: #999;
`;

const Info = styled.div`
	margin-top: 3px;
	font-size: 12px;
	color: #999;
`;

const IconGroup = styled.div`
	width: 40px;
	float: right;
	position: absolute;
	top: 7px;
	right: 5px;
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

const Container = styled.div`
	position: relative;
	border-bottom: 1px solid #eee;
	min-height: 50px;
	height: auto;
	padding: 9px 50px 12px 62px;
	overflow: hidden;

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
		color: ${props => props.color};
	}

	&:hover ${SourceUrl} {
		color: ${props => props.color};
	}

	${IconGroup} {
		visibility: hidden;
	}
`;
