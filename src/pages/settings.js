import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {LoadingOutlined, UploadOutlined} from '@ant-design/icons';
import {Main, Tabs} from '../components/index.js';
import {ff} from '../api/index.js';
import {ffErrorHandler} from '../utils/model.js';
import {deleteAllStatusesHistory} from '../utils/indexed-db.js';

export default @connect(
	state => ({
		current: state.login.current,
	}),
	dispatch => ({
		notify: dispatch.message.notify,
		setCurrent: dispatch.login.setCurrent,
		loadCurrent: dispatch.login.loadCurrent,
	}),
)

class Settings extends React.Component {
	static propTypes = {
		current: PropTypes.object,
		notify: PropTypes.func,
		setCurrent: PropTypes.func,
		loadCurrent: PropTypes.func,
	};

	static defaultProps = {
		current: null,
		notify: () => {},
		setCurrent: () => {},
		loadCurrent: () => {},
	};

	state = {
		selectedKey: 'basic',
		isUpdating: false,
		isUploading: false,
		name: null,
		location: '',
		url: '',
		description: '',
		avatarKey: '',
	};

	async componentDidMount() {
		const user = await this.props.loadCurrent();
		this.setState({
			name: user.name,
			location: user.location,
			url: user.url,
			description: user.description,
		});
	}

	handleName = event => {
		this.setState({name: event.target.value});
	};

	handleLocation = event => {
		this.setState({location: event.target.value});
	};

	handleUrl = event => {
		this.setState({url: event.target.value});
	};

	handleDescription = event => {
		this.setState({description: event.target.value});
	};

	updateProfile = async event => {
		event.preventDefault();

		const {notify} = this.props;
		const {name, location, url, description, isUpdating} = this.state;

		if (isUpdating) {
			return;
		}

		if (!name) {
			notify('用户名不能为空！');
			return;
		}

		this.setState({isUpdating: true});
		try {
			await ff.post('/account/update_profile', {
				name,
				location: location || ' ',
				url: url || ' ',
				description: description || ' ',
			});
			this.setState({isUpdating: false});
			notify('保存成功！');
		} catch (error) {
			const errorMessage = await ffErrorHandler(error);
			this.setState({isUpdating: false});
			notify(errorMessage);
		}
	};

	clearTimeMachine = async () => {
		const {notify} = this.props;

		// eslint-disable-next-line
		const choice = confirm('你确定要清空时光机吗？');
		if (choice === true) {
			try {
				await deleteAllStatusesHistory();
				notify('已清空！');
			} catch (error) {
				notify(error.message);
			}
		}
	};

	handleUpload = async event => {
		const {files} = event.target;
		const {notify, setCurrent} = this.props;

		if (files[0]) {
			this.setState({isUploading: true});
			try {
				const user = await ff.upload('/account/update_profile_image', {image: files[0]});
				setCurrent(user);
				this.setState({isUploading: false, avatarKey: String(Date.now())});
				notify('头像上传成功！');
			} catch (error) {
				const errorMessage = await ffErrorHandler(error);
				this.setState({isUploading: false});
				notify(errorMessage);
			}
		}
	};

	renderBasic = () => {
		const {current} = this.props;
		const {avatarKey, name, location, url, description, isUpdating, isUploading} = this.state;

		if (!current || name === null) {
			return (
				<BorderBase>
					<LoadingContainer>
						<LoadingOutlined/>
					</LoadingContainer>
				</BorderBase>
			);
		}

		return (
			<BorderBase>
				<Section css="min-height: 50px;">
					<Label>头像</Label>
					<Option>
						<Avatar image={current.profile_image_url_large + avatarKey}>
							<label htmlFor="image">
								<UploadIcon isUploading={isUploading}>
									{isUploading ? <LoadingOutlined/> : <UploadOutlined/>}
								</UploadIcon>
							</label>
							<FileInput id="image" name="image" type="file" accept="image/jpeg,image/png,image/gif" onChange={this.handleUpload}/>
						</Avatar>
					</Option>
				</Section>
				<Section>
					<Label>昵称</Label>
					<Option>
						<Input css="width: 120px;" value={name} onChange={this.handleName}/>
					</Option>
				</Section>
				<Section>
					<Label>所在地</Label>
					<Option><Input css="width: 120px;" value={location} onChange={this.handleLocation}/></Option>
				</Section>
				<Section>
					<Label>个人网址</Label>
					<Option><Input css="width: 300px;" value={url} onChange={this.handleUrl}/></Option>
				</Section>
				<Section css="min-height: 68px;">
					<Label>自述</Label>
					<Option>
						<TextArea
							rows={4}
							value={description}
							onChange={this.handleDescription}
						/>
					</Option>
				</Section>
				<Section>
					<Label css="min-height: 30px;"/>
					<Option>
						<Button onClick={this.updateProfile}>
							{isUpdating ? <LoadingOutlined/> : '保 存'}
						</Button>
					</Option>
				</Section>
			</BorderBase>
		);
	};

	renderTimeMachine = () => (
		<BorderBase>
			<Section>
				<Label>数据管理</Label>
				<Option>
					<Danger width="auto" onClick={this.clearTimeMachine}>清空时光机</Danger>
				</Option>
			</Section>
		</BorderBase>
	);

	render() {
		const {selectedKey} = this.state;

		return (
			<Container>
				<Main>
					<Tabs>
						<Tabs.TabPane
							isActive={selectedKey === 'basic'}
							id="basic"
							tab="基本信息"
							onClick={() => {
								this.setState({selectedKey: 'basic'});
							}}
						/>
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
	overflow: hidden;
	height: auto;
	border-radius: 10px;
`;

const LoadingContainer = styled.div`
	text-align: center;
	line-height: 30px;
`;

const BorderBase = styled.div`
	padding-top: 10px;
	border-top: 1px solid #eee;
`;

const Section = styled.div`
	margin: 5px 0;
	min-height: 30px;
`;

const Label = styled.div`
	float: left;
	padding-right: 15px;
	width: 155px;
	text-align: right;
	line-height: 30px;
`;

const Option = styled.div`
	float: left;
	line-height: 30px;
`;

const Avatar = styled.div`
	width: 48px;
	height: 48px;
	border-radius: 2px;
	background-image: url(${props => props.image});
	background-position: center center;
	background-size: cover;
`;

const UploadIcon = styled.div`
	width: 48px;
	height: 48px;
	background-color: rgba(0, 0, 0, 0.2);
	color: white;
	text-align: center;
	font-size: 16px;
	line-height: 48px;
	opacity: ${props => props.isUploading ? '1' : '0'};
	cursor: pointer;

	&:hover {
		opacity: 1;
	}
`;

const FileInput = styled.input`
	display: none;
`;

const Input = styled.input`
	box-sizing: content-box;
	padding: 0 4px;
	width: 185px;
	height: 24px;
	outline: 0;
	border: 1px solid #bdbdbd;
	border-radius: 4px;
	background-color: rgba(255, 255, 255, 0.75);
	font-size: 12px;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;

	&:focus {
		border-color: #0cf;
	}
`;

const TextArea = styled.textarea`
	box-sizing: content-box;
	padding: 4px;
	width: 300px;
	outline: 0;
	border: 1px solid #bdbdbd;
	border-radius: 4px;
	background-color: rgba(255, 255, 255, 0.75);
	font-size: 12px;
	font-family: "Segoe UI Emoji", "Avenir Next", Avenir, "Segoe UI", "Helvetica Neue", Helvetica, sans-serif;

	&:focus {
		border-color: #0cf;
	}
`;

const Button = styled.button`
	margin-left: 0;
	padding: 0 1.5em;
	width: ${props => props.width ? props.width : '64px'};
	height: 25px;
	outline: 0;
	border: 0;
	border-radius: 3px;
	background-color: #f0f0f0;
	color: #222;
	font-size: 12px;
	cursor: pointer;
`;

const Danger = styled(Button)`
	background: #cb2431AA;
	color: #fff;
`;
