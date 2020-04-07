import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';

export default @connect(
	state => ({
		current: state.login.current
	})
)

class ConversationCard extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		isActive: PropTypes.bool,
		conversation: PropTypes.object,
		onClick: PropTypes.func
	}

	static defaultProps = {
		current: null,
		isActive: false,
		conversation: null,
		onClick: () => {}
	}

	render() {
		const {current, isActive, conversation, onClick} = this.props;

		if (!(current && conversation)) {
			return null;
		}

		const imSender = current.id === conversation.dm.sender_id || current.unique_id === conversation.dm.sender_id;
		const displayUser = imSender ? 'recipient' : 'sender';

		return (
			<Container isActive={isActive} onClick={onClick}>
				<Avatar image={conversation.dm[displayUser].profile_image_origin_large}/>
				<InfoGroup>
					<Username>{conversation.dm[displayUser].name}</Username>
					<Preview>{conversation.dm.text.slice(0, 12)}</Preview>
					{/* <Time>{moment(new Date(conversation.dm.created_at)).fromNow()}</Time> */}
				</InfoGroup>
			</Container>
		);
	}
}

const Container = styled.div`
	height: 65px;
	cursor: pointer;
	border-right: ${props => props.isActive ? '2px solid #0cf' : 0};

	&:nth-child(n+2) {
		border-top: 1px solid #eee;
	}

	&:hover {
		background-color: #f5f5f5;
	}
`;

const Avatar = styled.div`
	float: left;
	width: 45px;
	height: 45px;
	margin: 10px;
	background-image: url(${props => props.image});
	background-size: cover;
	background-position: center center;
	border-radius: 50%;
`;

const InfoGroup = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	float: left;
	height: 45px;
	margin: 10px 0;
`;

const Username = styled.div`
	font-size: 12px;
	font-weight: 600;
`;

const Preview = styled.div`
	font-size: 12px;
`;

// Const Time = styled.div`
// 	font-size: 12px;
// 	overflow: hidden;
// `;
