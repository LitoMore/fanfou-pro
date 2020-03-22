import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';
import msgIcons from '../assets/msg-icons.svg';

export default @connect(
	state => ({
		current: state.login.current
	}),
	dispatch => ({
		reply: dispatch.postFormFloat.reply,
		repost: dispatch.postFormFloat.repost
	})
)

class Status extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		status: PropTypes.object,
		reply: PropTypes.func,
		repost: PropTypes.func
	}

	static defaultProps = {
		current: null,
		status: null,
		reply: () => {},
		repost: () => {}
	}

	reply = () => {
		const {status, reply} = this.props;
		reply(status);
	}

	repost = () => {
		const {status, repost} = this.props;
		repost(status);
	}

	render() {
		const {current, status} = this.props;
		const linkColor = current ? current.profile_link_color : '#06c';

		if (!status) {
			return null;
		}

		return (
			<Container>
				<div>
					<AvatarLink to="/user">
						<Avatar src={status.user.profile_image_origin_large}/>
					</AvatarLink>
					<Content>
						{status.photo ? <Photo color={linkColor} src={status.photo.thumburl}/> : null}
						<UserLink to={`/${status.user.id}`} color={linkColor} css="text-decoration: underline">{status.user.name}</UserLink>
						{' '}
						{status.txt.map((t, i) => {
							const key = String(i);
							switch (t.type) {
								case 'at':
									return <span key={key}><UserLink color={linkColor} to={`/${t.id}`}>{t.text}</UserLink></span>;
								case 'link':
									return <span key={key}>{t.text}</span>;
								case 'tag':
									return <span key={key}>{t.text}</span>;
								default:
									return <span key={key}>{t.text}</span>;
							}
						})}
					</Content>
					<Info>
						{moment(new Date(status.created_at)).fromNow()}
						{' 通过'}
						{status.source_name}
						{status.repost_status ? ` 转自${status.repost_status.user.name}` : ''}
					</Info>
					<IconGroup>
						<Reply onClick={this.reply}/>
						<Favorite/>
						<Repost onClick={this.repost}/>
					</IconGroup>
				</div>
			</Container>
		);
	}
}

const AvatarLink = styled(RouterLink)`
	float: left;
	margin-left: -59px;
	margin-top: 3px;
	text-decoration: none;
`;

const UserLink = styled(RouterLink)`
	text-decoration: none;
	color: ${props => props.color};
	border-radius: 2px;

	&:visited {
		color: ${props => props.color};
	}

	&:hover {
		background-color: ${props => props.color};
		color: #fff;
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
	padding: 2px;
	border: 1px solid #ccc;
	border-radius: 2px;
	cursor: pointer;

	&:hover {
		border-color: ${props => props.color}
	}
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
	background-position-y: 64px;
`;

const Repost = styled(MessageIcon)`
	background-position-y: 16px;
`;

const Container = styled.div`
	position: relative;
	border-top: 1px dashed #ccc;
	min-height: 50px;
	height: auto;
	padding: 9px 50px 12px 62px;
  overflow: hidden;

	&:hover {
		background-color: #f5f5f5;
	}

	&:hover .${IconGroup.styledComponentId} {
		visibility: visible;
	}

	.${IconGroup.styledComponentId} {
		visibility: hidden;
	}
`;
