import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Main, Side, Status, ProfileSide, MenuSide, SearchInput} from '../components/index.js';

export default @connect(
	state => ({
		current: state.login.current,
		timeline: state.history.timeline,
		profile: state.user.profile,
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.user.fetch,
		load: dispatch.history.load,
	}),
)

class User extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		timeline: PropTypes.array,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func,
		load: PropTypes.func,
	};

	static defaultProps = {
		current: null,
		timeline: [],
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {},
		load: () => {},
	};

	componentDidMount() {
		const {setPostFormPage, setPostFormFloatPage, load} = this.props;
		setPostFormPage('history');
		setPostFormFloatPage('history');
		load();
	}

	render() {
		const {current, timeline} = this.props;

		if (!current) {
			return null;
		}

		return (
			<Container>
				<Main>
					{timeline.length > 0 ? (
						<Timeline>
							{timeline.map((t, i) => <Status key={`${t.id}-${t.favorited}-${String(i)}`} type="statuses_history" status={t}/>)}
						</Timeline>
					) : null}
				</Main>
				<Side>
					<ProfileSide user={current}/>
					<MenuSide user={current} activeKey="history"/>
					<SearchInput/>
				</Side>
			</Container>
		);
	}
}

const Container = styled.div`
	display: flex;
	overflow: hidden;
	height: auto;
	border-radius: 10px;
`;

const Timeline = styled.div`
	border-top: 1px solid #eee;
`;
