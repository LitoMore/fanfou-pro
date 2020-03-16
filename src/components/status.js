import React from 'react';
import PropTypes from 'prop-types';
import {Link as RouterLink} from 'react-router-dom';
import styled from 'styled-components';
import moment from 'moment';

export default class Status extends React.Component {
	static propTypes = {
		status: PropTypes.object
	}

	static defaultProps = {
		status: null
	}

	render() {
		const {status} = this.props;

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
						{status.txt.map((t, i) => {
							const key = String(i);
							switch (t.type) {
								case 'at':
									return <span key={key}><UserLink to={`/${t.id}`}>{t.text}</UserLink></span>;
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
				</div>
			</Container>
		);
	}
}

const Container = styled.div`
	border-top: 1px dashed #ccc;
	min-height: 50px;
	height: auto;
	padding: 9px 50px 12px 62px;
  overflow: hidden;
`;

const AvatarLink = styled(RouterLink)`
	float: left;
	margin-left: -59px;
	margin-top: 3px;
	text-decoration: none;
`;

const UserLink = styled(RouterLink)`
	text-decoration: none;

	&:visited {
		color: #06c;
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

const Info = styled.div`
	margin-top: 3px;
	font-size: 12px;
	color: #999;
`;
