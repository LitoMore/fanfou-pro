import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export default class Paginator extends React.Component {
	static propTypes = {
		total: PropTypes.number,
		current: PropTypes.number,
		onChange: PropTypes.func,
	}

	static defaultProps = {
		total: 0,
		current: 1,
		onChange: () => {},
	}

	render() {
		const {total, current, onChange} = this.props;

		const pageCount = Math.ceil(total / 20);

		if (pageCount === 0) {
			return null;
		}

		let from = current - 3;
		let to = current + 3;

		if (from <= 0) {
			from = 1;
		}

		if (to < 7) {
			to = 7;
		}

		if (pageCount < to) {
			to = pageCount;
		}

		const pageArray = Array.from({length: to - from + 1}, (_, i) => i + from);

		return (
			<Container>
				{from > 1 ? <TextPageButton onClick={() => onChange(1)}>第一页</TextPageButton> : null}
				{from > 1 ? <TextPageButton onClick={() => onChange(current - 1)}>上一页</TextPageButton> : null}
				{pageArray.map(page => (
					<PageButton
						key={page}
						active={page === current}
						onClick={() => {
							if (page !== current) {
								onChange(page);
							}
						}}
					>
						{page}
					</PageButton>
				))}
				{to < pageCount ? <TextPageButton onClick={() => onChange(current + 1)}>下一页</TextPageButton> : null}
				{pageCount !== Number.POSITIVE_INFINITY && to < pageCount ? <TextPageButton onClick={() => onChange(pageCount)}>最后一页</TextPageButton> : null}
			</Container>
		);
	}
}

const Container = styled.div`
	float: right;
	padding: 15px 0 0 0;
	text-align: right;
`;

const PageButton = styled.div`
	float: left;
	margin: 0 3px;
	width: 28px;
	height: 28px;
	border: 1px solid #eee;
	border-radius: 2px;
	text-align: center;
	font-size: 12px;
	line-height: 28px;

	${props => props.active ? `
		border: 1px solid white;
		font-weight: bold;
	` : `
		&:hover {
			color: #0cf;
			font-weight: 400;
			border-color: #0cf;
			cursor: pointer;
		}
	`}
`;

const TextPageButton = styled(PageButton)`
	padding: 0 10px;
	width: auto;
`;
