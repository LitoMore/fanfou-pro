import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Link as RouterLink} from 'react-router-dom';
import styled from 'styled-components';
import {defaultState} from '../models/notification/notification';

export default @connect(
	state => ({
		current: state.login.current,
		notification: state.notification.notification
	})
)

class SystemNotice extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		notification: PropTypes.object
	}

	static defaultProps = {
		current: null,
		notification: defaultState
	}

	render() {
		const {current, notification} = this.props;
		const linkColor = current ? current.profile_link_color : '#06c';
		const {friend_requests: friendRequests} = notification;

		if (friendRequests === 0) {
			return null;
		}

		return (
			<Container>
				{friendRequests} 个人申请关注你，<Link color={linkColor} to="/friend.request">去看看是谁</Link>
			</Container>
		);
	}
}

const Container = styled.div`
	clear: both;
	margin: 0 0 10px;
	padding: 5px 10px;
	border: 1px solid #ffed00;
	background: #fffcaa;
	font-size: 12px;
`;

const Link = styled(RouterLink)`
	color: ${props => props.color};
	border-radius: 2px;

	&:visited {
		color: ${props => props.color};
	}

	&:hover {
		background-color: ${props => props.color};
		text-decoration: none;
		color: #fff;
	}
`;
