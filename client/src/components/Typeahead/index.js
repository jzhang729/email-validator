import * as classnames from 'classnames';
import * as React from 'react';
import './Typeahead.css';

export interface Props {
  suggestions: any[];
  useSuggestion: any;
}

export interface State {
  selectedIndex: number;
  mouseHovering: boolean;
}

class Typeahead extends React.Component<Props, State> {
  refs: {
    [key: string]: Element,
    typeaheadResults: HTMLElement,
  };

  constructor(props: Props) {
    super(props);

    this.state = { selectedIndex: -1 };

    this._keyArrowDown = this._keyArrowDown.bind(this);
    this._keyArrowUp = this._keyArrowUp.bind(this);
    this._keyEnter = this._keyEnter.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._renderListItems = this._renderListItems.bind(this);
  }

  _keyArrowDown() {
    const { selectedIndex } = this.state;

    if (selectedIndex < this.props.suggestions.length) {
      // Adding 1 to -1 starts the index at 0
      this.setState({ selectedIndex: selectedIndex + 1 });
    } else {
      this.setState({ selectedIndex: 0 });
    }
  }

  _keyArrowUp() {
    const { selectedIndex } = this.state;

    if (selectedIndex > 0) {
      this.setState({ selectedIndex: selectedIndex - 1 });
    } else {
      this.setState({ selectedIndex: this.props.suggestions.length });
    }
  }

  _keyEnter() {
    const value = this.props.suggestions[this.state.selectedIndex] || '';
    setTimeout(this.props.useSuggestion(value), 1000);
  }

  _onKeyDown(e) {
    switch (e.which) {
      case 13:
        this._keyEnter();
        break;
      case 38:
        this._keyArrowUp();
        break;
      case 40:
        this._keyArrowDown();
        break;
      default:
        return null;
    }
  }

  /**
   * Renders the typeahead results as list items and allow user to use the
   * mouse or use up/down arrow keys to pick results
   */
  _renderListItems() {
    const { suggestions, useSuggestion } = this.props;
    const { selectedIndex, mouseHovering } = this.state;

    return suggestions.map((item, index) => {
      let classes = classnames(`typeahead__li--${index}`, {
        hovered: index === selectedIndex && !mouseHovering,
      });

      return (
        <li
          key={index}
          className={classes}
          onClick={e => {
            const value = e.target.innerHTML || '';
            useSuggestion(value);
          }}
        >
          {item}
        </li>
      );
    });
  }

  componentDidMount() {
    window.addEventListener('keydown', this._onKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._onKeyDown);
  }

  render() {
    return (
      <ul
        className="typeahead__ul"
        onMouseEnter={() => {
          this.setState({ mouseHovering: true });
        }}
        onMouseLeave={() => {
          this.setState({ mouseHovering: false });
        }}
        ref="typeaheadResults"
      >
        {this._renderListItems()}
      </ul>
    );
  }
}

export default Typeahead;
