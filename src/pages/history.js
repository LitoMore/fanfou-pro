import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {Status, ProfileSide, MenuSide, SearchInput} from '../components';

export default @connect(
	state => ({
		current: state.login.current,
		timeline: state.history.timeline,
		profile: state.user.profile
	}),
	dispatch => ({
		setPostFormPage: dispatch.postForm.setPage,
		setPostFormFloatPage: dispatch.postFormFloat.setPage,
		fetch: dispatch.user.fetch,
		load: dispatch.history.load
	})
)

class User extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		timeline: PropTypes.array,
		setPostFormPage: PropTypes.func,
		setPostFormFloatPage: PropTypes.func,
		load: PropTypes.func
	}

	static defaultProps = {
		current: null,
		timeline: [],
		setPostFormPage: () => {},
		setPostFormFloatPage: () => {},
		load: () => {}
	}

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
	width: 540px;
	background-color: white;
`;

const Side = styled(Base)`
	display: inline-block;
	padding: 20px 0 20px 15px;
	box-sizing: border-box;
	vertical-align: top;
	background-color: rgba(255, 255, 255, 0.9);
	width: 235px;
`;

const Timeline = styled.div`
	border-top: 1px solid #eee;
`;
