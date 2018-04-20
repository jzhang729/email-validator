import * as React from 'react';
import './App.css';
import EmailForm from './components/EmailForm';
import Header from './components/Header';

class App extends React.Component {
	public render() {
		return (
			<div className="App">
				<Header title="Invoice Simple E-mail Validator" />
				<EmailForm label="Please enter a valid e-mail address" placeholder="john@smith.com" />
			</div>
		);
	}
}

export default App;
