import * as classnames from 'classnames';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import './Typeahead.css';

export interface Props {
  suggestions: any[];
  useSuggestion: any;
}

export interface State {
  selectedIndex: number;
}

class Typeahead extends React.Component<Props, State> {
  refs: {
    [key: string]: Element,
    typeaheadResults: HTMLElement,
  };

  constructor(props: Props) {
    super(props);

    this.state = { selectedIndex: -1 };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.downArrow = this.downArrow.bind(this);
    this.upArrow = this.upArrow.bind(this);
    this.enterKey = this.enterKey.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e) {
    // console.log(e.which);
    switch (e.which) {
      case 13:
        this.enterKey();
        break;
      case 38:
        this.upArrow();
        break;
      case 40:
        this.downArrow();
        break;
      default:
        return null;
    }
  }

  downArrow() {
    if (this.state.selectedIndex < this.props.suggestions.length) {
      this.setState({ selectedIndex: this.state.selectedIndex + 1 });
    } else {
      this.setState({ selectedIndex: 0 });
    }
  }

  upArrow() {
    if (this.state.selectedIndex > 0) {
      this.setState({ selectedIndex: this.state.selectedIndex - 1 });
    } else {
      this.setState({ selectedIndex: this.props.suggestions.length });
    }
  }

  enterKey() {
    const value = this.props.suggestions[this.state.selectedIndex] || '';
    this.props.useSuggestion(value);
  }

  renderListItems() {
    return this.props.suggestions.map((item, index) => {
      let classes = classnames(`typeahead__li--${index}`, {
        hovered: index === this.state.selectedIndex,
      });

      return (
        <li
          key={index}
          className={classes}
          onClick={e => {
            const value = e.target.innerHTML || '';
            this.props.useSuggestion(value);
          }}
        >
          {item}
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="typeahead__ul" ref="typeaheadResults">
        {this.renderListItems()}
      </ul>
    );
  }
}

export default Typeahead;
