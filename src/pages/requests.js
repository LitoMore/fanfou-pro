import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Main, Paginator, UserCard} from '../components/index.js';

export default @connect(
	state => ({
		friendRequests: state.notification.notification.friend_requests,
		current: state.login.current,
		users: state.requests.users,
		parameters: state.requests.parameters,
	}),
	dispatch => ({
		fetchRequests: dispatch.requests.fetchRequests,
		fetchUser: dispatch.user.fetch,
	}),
)

class Followers extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		friendRequests: PropTypes.number,
		users: PropTypes.array,
		parameters: PropTypes.object,
		fetchRequests: PropTypes.func,
		fetchUser: PropTypes.func,
	};

	static defaultProps = {
		friendRequests: 0,
		users: [],
		parameters: null,
		fetchRequests: () => {},
		fetchUser: () => {},
	};

	componentDidMount() {
		const {users, parameters} = this.props;
		if (users.length === 0 && !parameters) {
			this.fetch();
		}
	}

	fetch = async () => {
		const {parameters, fetchRequests} = this.props;
		fetchRequests({...parameters});
	};

	goToUser = async id => {
		const {history, fetchUser} = this.props;
		await fetchUser({id});
		history.push(`/${id}`);
	};

	render() {
		const {users, parameters, friendRequests} = this.props;
		const page = (parameters && parameters.page) || 1;

		return (
			<Container>
				<Main>
					<Users>
						{users.map(user => <UserCard key={user.id + user.accept + user.deny + user.following} type="request" user={user}/>)}
					</Users>
					{friendRequests > 0 ? (
						<Paginator
							total={friendRequests}
							current={page}
							onChange={page => {
								fetch({page});
							}}
						/>
					) : null}
				</Main>
			</Container>
		);
	}
}

const Container = styled.div`
	position: relative;
	display: flex;
	overflow: hidden;
	height: auto;
	border-radius: 10px;
`;

const Users = styled.div`
	border-top: 1px solid #eee;
`;
