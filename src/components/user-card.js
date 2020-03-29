import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

export default @withRouter @connect(
	_ => ({}),
	dispatch => ({
		fetchUser: dispatch.user.fetch
	})
)

class UserCard extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		user: PropTypes.object,
		fetchUser: PropTypes.func
	}

	static defaultProps = {
		user: null,
		fetchUser: () => {}
	}

	goToUser = async id => {
		const {history, fetchUser} = this.props;
		await fetchUser({id, format: 'html'});
		history.push(`/${id}`);
	}

	render() {
		const {user} = this.props;

		if (!user) {
			return null;
		}

		return (
			<Container>
				<AvatarLink onClick={() => this.goToUser(user.id)}>
					<Avatar src={user.profile_image_origin_large}/>
				</AvatarLink>
				<Content>
					<UserLink
						css="color: #222; font-weight: 600; line-height: 1.6;"
						onClick={() => this.goToUser(user.id)}
					>
						{user.name}
					</UserLink>
					{/* <div>
						{user.following ? <Unfollow>取消关注</Unfollow> : <Follow>关注此人</Follow>}
						<DirectMessage>发送私信</DirectMessage>
					</div> */}
				</Content>
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
	color: #06c;
	cursor: pointer;

	&:hover {
		color: #06c;
	}

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

const Button = styled.button`
	box-sizing: content-box;
	width: 70px;
	height: 20px;
	line-height: 20px;
	font-size: 12px;
	border: 0;
	outline: 0;
	border-radius: 3px;
	cursor: pointer;
`;

// Const Follow = styled(Button)`
// 	background-color: #0cf;
// 	color: white;
// `;

// const Unfollow = styled(Button)`
// 	background-color: #f0f0f0;
// 	color: #333;
// `;

// const DirectMessage = styled(Button)`
// 	background-color: #f0f0f0;
// 	color: #333;
// `;

const Container = styled.div`
	position: relative;
	border-bottom: 1px solid #eee;
	min-height: 50px;
	height: auto;
	padding: 9px 50px 12px 62px;
	overflow: hidden;

	&:hover {
		background-color: #f5f5f599;
	}

	${Button}:nth-child(2) {
		margin-left: 5px;
	}
`;
