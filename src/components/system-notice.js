import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';
import styled from 'styled-components';
import {defaultState} from '../models/notification/notification';

export default @connect(
	state => ({
		notification: state.notification.notification
	})
)

class SystemNotice extends React.Component {
	static propTypes = {
		notification: PropTypes.object
	}

	static defaultProps = {
		notification: defaultState
	}

	render() {
		const {notification} = this.props;
		const {friend_requests: friendRequests} = notification;

		if (friendRequests === 0) {
			return null;
		}

		return (
			<Container>
				{friendRequests} 个人申请关注你，<Link to="/friend.request">去看看是谁</Link>
			</Container>
		);
	}
}

const Container = styled.div`
	background-color: #fff8e1;
	border: 0;
	border-radius: 4px;
	clear: both;
	color: #795548;
	font-size: 12px;
	margin: 0 0 10px;
	padding: 5px 10px;
	text-align: center;

	&:hover {
		background-color: #ffecb399;
	}
`;

const Link = styled(RouterLink)`
	border-radius: 2px;
	color: ${props => props.color};

	&:visited {
		color: ${props => props.color};
	}

	&:hover {
		color: #795548;
		text-decoration: none;
	}
`;
