import * as React from 'react';
import './Header.css';

export interface Props {
	title: string;
}

class Header extends React.Component<Props, object> {
	render() {
		const { title } = this.props;
		return <header>{title}</header>;
	}
}

export default Header;
