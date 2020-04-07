import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

export default class ChatBubble extends React.Component {
	static propTypes = {
		isMe: PropTypes.bool,
		hasTimeTag: PropTypes.bool,
		message: PropTypes.object
	}

	static defaultProps = {
		isMe: false,
		hasTimeTag: false,
		message: null
	}

	getTimeTag = createdAt => {
		const date = new Date();
		const create = new Date(createdAt);
		const nowYear = moment(date).format('YYYY');
		const createYear = moment(create).format('YYYY');
		const nowDate = moment(date).format('YYYYMMDD');
		const createDate = moment(create).format('YYYYMMDD');

		if (nowDate === createDate) {
			return moment(create).format('HH:mm');
		}

		if (nowYear === createYear) {
			return moment(create).format('MM/DD HH:mm');
		}

		return moment(create).format('YYYY/MM/DD HH:mm');
	}

	render() {
		const {isMe, hasTimeTag, message} = this.props;

		if (!message) {
			return null;
		}

		return (
			<Row isMe={isMe}>
				<div>
					<Container isMe={isMe}>
						{message.text.split('\n').map((t, i) => <div key={String(i)}>{t}</div>)}
					</Container>
				</div>
				{hasTimeTag ? (
					<div css="margin-top: -5px;">
						<Time>{this.getTimeTag(message.created_at)}</Time>
					</div>
				) : null}
			</Row>
		);
	}
}

const Row = styled.div`
	text-align: ${props => props.isMe ? 'right' : 'left'};
`;

const Container = styled.div`
	display: inline-block;
	text-align: left;
	max-width: 400px;
	min-width: 20px;
	min-height: 30px;
	padding: 5px 9px;
	margin: 2px 0;
	border-radius: 10px;
	word-wrap: break-word;
	background-color: ${props => props.isMe ? '#0cf' : 'rgb(230, 236, 240)'};
	color: ${props => props.isMe ? 'white' : 'inherit'};
`;

const Time = styled.div`
	display: inline-block;
	font-size: 10px;
	padding: 0 5px;
	color: rgb(101, 119, 134);
	margin-top: -5px;
`;
