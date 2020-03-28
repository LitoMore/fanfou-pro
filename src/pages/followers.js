import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {Tabs, Paginator, UserCard} from '../components';

export default @connect(
	state => ({
		current: state.login.current,
		isNoPermit: state.followers.isNoPermit,
		type: state.followers.type,
		users: state.followers.users,
		parameters: state.followers.parameters,
		profile: state.followers.profile
	}),
	dispatch => ({
		fetchFollowing: dispatch.followers.fetchFollowing,
		fetchFollowers: dispatch.followers.fetchFollowers
	})
)

class Followers extends React.Component {
	static propTypes = {
		history: PropTypes.object.isRequired,
		match: PropTypes.object.isRequired,
		isNoPermit: PropTypes.bool,
		type: PropTypes.string,
		users: PropTypes.array,
		parameters: PropTypes.object,
		profile: PropTypes.object,
		fetchFollowing: PropTypes.func,
		fetchFollowers: PropTypes.func
	}

	static defaultProps = {
		users: [],
		isNoPermit: false,
		type: '',
		parameters: null,
		profile: null,
		fetchFollowing: () => {},
		fetchFollowers: () => {}
	}

	componentDidMount() {
		const {users, parameters} = this.props;
		if (users.length === 0 && !parameters) {
			this.fetch();
		}
	}

	componentDidUpdate() {
		if (this.props.isNoPermit) {
			this.props.history.replace(`/${this.props.match.params.id}`);
		}
	}

	fetch = async () => {
		const {match, parameters, fetchFollowing, fetchFollowers} = this.props;
		const {id} = match.params;
		switch (match.path) {
			case '/following/:id':
				fetchFollowing({...parameters, id});
				break;
			case '/followers/:id':
				fetchFollowers({...parameters, id});
				break;
			default:
				break;
		}
	}

	render() {
		const {history, type, users, parameters, profile, fetchFollowing, fetchFollowers} = this.props;

		if (!profile) {
			return null;
		}

		const page = (parameters && parameters.page) || 1;
		const countDict = {
			following: 'friends_count',
			followers: 'followers_count'
		};

		return (
			<Container>
				<Main>
					<Tabs>
						<Tabs.TabPane
							isActive={type === 'following'}
							id="following"
							tab={`我关注的人 (${profile.friends_count})`}
							onClick={async () => {
								await fetchFollowing({id: profile.id});
								history.push(`/following/${profile.id}`);
							}}
						/>
						<Tabs.TabPane
							isActive={type === 'followers'}
							id="followers"
							tab={`关注我的人 (${profile.followers_count})`}
							onClick={() => {
								fetchFollowers({id: profile.id});
								history.push(`/followers/${profile.id}`);
							}}
						/>
					</Tabs>
					<Users>
						{users.map(user => <UserCard key={user.id} user={user}/>)}
					</Users>
					<Paginator
						total={profile[countDict[type]] || Infinity}
						current={page}
						onChange={page => {
							fetch({id: profile.id, page});
						}}
					/>
				</Main>
			</Container>
		);
	}
}

const Container = styled.div`
	display: flex;
	border-radius: 10px;
	overflow: hidden;
	height: auto;
`;

const Base = styled.div`
	padding: 20px;
`;

const Main = styled(Base)`
	display: inline-block;
	box-sizing: border-box;
	vertical-align: top;
	width: 775px;
	background-color: white;
`;

const Users = styled.div`
	border-top: 1px solid #eee;
`;
