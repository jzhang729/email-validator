import * as React from 'react';
import './App.css';
import EmailForm from './components/EmailForm';
import Header from './components/Header';

class App extends React.Component {
	public render() {
		return (
			<div className="App">
				<Header title="Invoice Simple E-mail Validator" />
				<EmailForm label="E-mail Address" />
			</div>
		);
	}
}

export default App;
