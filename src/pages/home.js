import React from 'react';
import styled from 'styled-components';
import {uProgress, Status} from '../components';
import {ff} from '../api';

export default class Home extends React.Component {
	state = {
		page: 1,
		timeline: []
	}

	componentDidMount() {
		this.fetchHome();
	}

	fetchHome = async () => {
		uProgress.start();
		const {page} = this.state;
		ff.oauthToken = localStorage.getItem('fanfouProToken');
		ff.oauthTokenSecret = localStorage.getItem('fanfouProTokenSecret');
		const timeline = await ff.get('/statuses/home_timeline', {page, format: 'html'});
		uProgress.done();
		this.setState({timeline});
	}

	render() {
		const {timeline} = this.state;

		return (
			<Container>
				<Main>
					{timeline.map(t => <Status key={t.id} status={t}/>)}
				</Main>
				<Side>
					test
				</Side>
			</Container>
		);
	}
}

const Container = styled.div`
	display: flex;
	border-radius: 10px;
	background-color: white;
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
`;

const Side = styled(Base)`
	display: inline-block;
	box-sizing: border-box;
	vertical-align: top;
	background-color: #e2f2da;
	width: 235px;
	border-left: 1px solid #e2f2da;
`;
