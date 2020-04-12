import React from 'react';
import styled from 'styled-components';
import {Tabs} from '../components';

export default class Settings extends React.Component {
	state = {
		selectedKey: 'time-machine'
	}

	renderBasic = () => {
		return (
			<BorderBase>
				<Section>
					<Label>昵称</Label>
				</Section>
			</BorderBase>
		);
	}

	renderTimeMachine = () => {
		return (
			<BorderBase>
				<Section>
					<Label>启用时光机</Label>
				</Section>
			</BorderBase>
		);
	}

	render() {
		const {selectedKey} = this.state;

		return (
			<Container>
				<Main>
					<Tabs>
						{/* <Tabs.TabPane
							isActive={selectedKey === 'basic'}
							id="basic"
							tab="基本信息"
							onClick={() => {
								this.setState({selectedKey: 'basic'});
							}}
						/> */}
						<Tabs.TabPane
							isActive={selectedKey === 'time-machine'}
							id="time-machine"
							tab="时光机"
							onClick={() => {
								this.setState({selectedKey: 'time-machine'});
							}}
						/>
					</Tabs>
					{selectedKey === 'basic' ? this.renderBasic() : null}
					{selectedKey === 'time-machine' ? this.renderTimeMachine() : null}
				</Main>
			</Container>
		);
	}
}

const Container = styled.div`
	position: relative;
	display: flex;
	border-radius: 10px;
	overflow: hidden;
	height: auto;
`;

const Base = styled.div`
	padding: 20px;
	font-size: 12px;
`;

const Main = styled(Base)`
	display: inline-block;
	box-sizing: border-box;
	vertical-align: top;
	width: 775px;
	background-color: white;
`;

const BorderBase = styled.div`
	border-top: 1px solid #eee;
`;

const Section = styled.div`
	min-height: 25px;
	margin: 5px 0;
`;

const Label = styled.div`
	float: left;
	width: 155px;
	text-align: right;
	line-height: 25px;
`;

