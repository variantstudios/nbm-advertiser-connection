import React, { Component } from 'react';
import Axios from 'axios';
import _ from 'lodash';
import './App.css';
import HeaderImage from './header.jpg';
class App extends Component {
	constructor() {
		super();
		this.state = {
			listEditions: [],
			selectedEditiona: ''
		};
	}

	componentDidMount = () => {
		Axios.get('./advertiser_connect_v3.json')
			.then((response) => {
				this.setState({ listEditions: response.data });
				this.setState({
					selectedEdition: _.last(
						_.sortBy(response.data, 'issue_date')
							.map((item) => item.issue_text)
							.filter((value, index, self) => self.indexOf(value) === index)
					)
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	selectEdition() {
		//console.log(this.refs.valueSelector.value);
		this.setState({ selectedEdition: this.refs.valueSelector.value });
	}

	render() {
		console.log(this.state.listEditions);

		const uniqueList = _.sortBy(this.state.listEditions, 'issue_date')
			.map((item) => item.issue_text)
			.filter((value, index, self) => self.indexOf(value) === index);

		let options = uniqueList.map((item, i) => {
			return (
				<option key={i} value={`${item}`}>
					{item}
				</option>
			);
		});

		var selectedThing = _.filter(this.state.listEditions, (listEditions) => {
			return listEditions.issue_text === this.state.selectedEdition;
		});

		const NBMlist = selectedThing.map((item, i) => (
			<li key={i}>
				<a
					href={`${item.url}`}
					title={`${item.pub} - ${item.issue} - ${item.issue_date}`}
					target="_blank"
					rel="noopener noreferrer"
				>
					{item.coname}
				</a>
			</li>
		));

		return (
			<div className="App" id="wrap">
				<header>
					<img src={HeaderImage} alt="Advertiser Connect" />
					<h1>Connect with Advertisers in this Issue</h1>
				</header>

				<div id="DrpDwn" className="select-style">
					<select
						ref="valueSelector"
						value={`${this.state.selectedEdition}`}
						onChange={(e) => {
							this.selectEdition();
						}}
					>
						{options}
					</select>
				</div>
				<div id="details">
					<h2>Company Name</h2>
					<ul>{NBMlist}</ul>
				</div>
			</div>
		);
	}
}

export default App;
