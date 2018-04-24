import * as _ from 'lodash';
import axios from 'axios';
import './EmailForm.css';
import * as React from 'react';
import Typeahead from '../Typeahead';
import ValidationStatus from '../ValidationStatus';

export interface Props {
  emailSuggestions: string[];
  emailRegex: any;
  label: string;
  maxLength: number;
  placeholder: string;
}

export interface State {
  checking: boolean;
  email: string;
  loading: boolean;
  reason: string;
  suggestions: any[];
  valid: boolean;
}

export interface SyntheticEvent<T> {
  key: KeyboardEvent & T;
  target: EventTarget & T;
}

class EmailForm extends React.Component<Props, State> {
  timeout: any;

  refs: {
    [key: string]: Element;
    textInput: HTMLInputElement;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      checking: false,
      email: '',
      loading: false,
      reason: '',
      suggestions: [],
      valid: false,
    };

    this._checkEmail = this._checkEmail.bind(this);
    this._initTypeahead = this._initTypeahead.bind(this);
    this._typeaheadCallback = this._typeaheadCallback.bind(this);
    this._useSuggestion = this._useSuggestion.bind(this);
    this._validRegexEmail = this._validRegexEmail.bind(this);
    this._verifyEmail = this._verifyEmail.bind(this);
  }

  /**
   * Initiates the e-mail check process and detects '@' symbol keyup to
   *  initiate typeahead suggestions.
   * @param e {event} They keyboard event that initiates the callback.
   */
  _checkEmail(e: any) {
    clearTimeout(this.timeout);

    // Detect the @ symbol to initiate typeahead
    if (e.which === 64 || e.key === '@') {
      this._initTypeahead();
    } else if (e.which === 13 || 9) {
      // Fixes a timing issue where the user might see an error after they
      // confirm a typeahead selection
      this.setState({ reason: '' });
    }

    this.timeout = setTimeout(this._verifyEmail, 1000);
  }

  /**
   * Adds the keyup event listener to the text input if '@' symbol is typed.
   */
  _initTypeahead() {
    this.refs.textInput.addEventListener('keyup', this._typeaheadCallback);
  }

  /**
   * We need to prevent the browser from tabbing from text input
   * to the address bar so that we can use it for when the typeahead is open.
   */
  _modifyTabKey(e) {
    if (e.which === 9) {
      e.preventDefault();
    }
  }

  /**
   * Called when a keyup event is detected on the text input.
   */
  _typeaheadCallback(e) {
    const { email } = this.state;

    // Get the last part of the string after '@' symbol
    const query = email.split('@').splice(1, 1)[0];

    let queryLength;

    if (email.length === 0 || email.indexOf('@') === -1) {
      this.setState({ suggestions: [] });
    }

    try {
      queryLength = query.length;
    } catch (e) {
      queryLength = 0;
    }

    if (!query || queryLength < 1) {
      return;
    }

    // Get e-mail suggestions based on what the user is typing
    let suggestions = this.props.emailSuggestions.filter(item => {
      return item.toLowerCase().slice(0, queryLength) === query;
    });

    this.setState({ suggestions });
  }

  /**
   * Takes the domain of the suggestion that the user has picked and modifies
   * the string, setting a new state.
   */
  _useSuggestion(value) {
    // Unbind the keyup event listener on the text input
    this.refs.textInput.removeEventListener('keyup', this._typeaheadCallback);

    const inputValue = this.refs.textInput.value;
    const substringToReplace = /@.*$/;
    const newString = inputValue.replace(substringToReplace, `@${value}`);

    this.setState({ email: newString, suggestions: [], valid: false });
  }

  /**
   * Checks that the e-mail follows correct regex protocol before sending a
   *  network request to Kickbox API.
   * @returns {boolean}
   */
  _validRegexEmail() {
    const { emailRegex } = this.props;
    const { email } = this.state;

    return email.length > 0 && emailRegex.test(email);
  }

  /**
    * Makes the call to the Kickbox API and sets component state accordingly.
    @returns {Promise} Promise resolves if Kickbox API responds with an object,
    otherwise logs the error to the console.
  */
  _verifyEmail() {
    // Don't check e-mail unless it meets valid regex conditions.
    if (this.state.email.length === 0) {
      return null;
    }

    this.setState({
      loading: true,
      checking: true,
    });

    axios
      .get(`/api/verify/${this.state.email}`)
      .then(res => {
        const { result, reason } = res.data;

        if (result === 'deliverable' && reason === 'accepted_email') {
          this.setState({
            loading: false,
            suggestions: [],
            valid: true,
          });

          return;
        }

        let detailedReason = reason
          .split('_')
          .map(word => {
            return word.charAt(0).toUpperCase() + word.slice(1);
          })
          .join(' ');

        detailedReason += '. Please check and try again.';

        this.setState({
          checking: false,
          loading: false,
          reason: detailedReason,
          valid: false,
        });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.refs.textInput.focus();
    window.addEventListener('keydown', this._modifyTabKey);
  }

  componentWillUnmount() {
    this.refs.textInput.removeEventListener('keyup', this._typeaheadCallback);
    window.removeEventListener('keydown', this._modifyTabKey);
  }

  render() {
    const { label, maxLength, placeholder } = this.props;
    const { checking, loading, reason, valid, suggestions } = this.state;

    return (
      <div>
        <div className="input__wrapper">
          <div className="typeahead">
            <label htmlFor="email">{label}</label>
            <input
              ref="textInput"
              id="email"
              type="email"
              placeholder={placeholder}
              maxLength={maxLength}
              onChange={e => {
                this.setState({ email: e.target.value });
              }}
              onKeyPress={e => {
                _.debounce(this._checkEmail, 1500, {
                  leading: true,
                })(e);
              }}
              value={this.state.email}
            />
            {suggestions.length > 0 ? (
              <Typeahead
                suggestions={suggestions}
                useSuggestion={this._useSuggestion}
              />
            ) : null}
          </div>
        </div>

        {this._validRegexEmail() ? (
          <div className="validation__wrapper">
            <ValidationStatus
              checking={checking}
              loading={loading}
              reason={reason}
              valid={valid}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default EmailForm;
