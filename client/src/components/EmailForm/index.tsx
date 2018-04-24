import * as _ from 'lodash';
import * as React from 'react';
import axios from 'axios';
import './EmailForm.css';
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
  suggestionsVisible: boolean;
  valid: boolean;
}

export interface SyntheticEvent<T> {
  key: KeyboardEvent & T;
  target: EventTarget & T;
}

class EmailForm extends React.Component<Props, State> {
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
      suggestionsVisible: false,
      valid: false,
    };

    this.checkEmail = this.checkEmail.bind(this);
    this.initTypeahead = this.initTypeahead.bind(this);
    this.typeaheadCallback = this.typeaheadCallback.bind(this);
    this.useSuggestion = this.useSuggestion.bind(this);
    this.validRegexEmail = this.validRegexEmail.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }

  typeaheadCallback(e) {
    const { email } = this.state;
    const query = email.split('@').splice(1, 1)[0];
    let queryLength;

    if (email.length === 0) {
      this.setState({ suggestions: [], suggestionsVisible: false });
    }

    try {
      queryLength = query.length;
    } catch (e) {
      queryLength = 0;
    }

    if (!query || queryLength < 1) {
      return;
    }

    let suggestions =
      queryLength === 0
        ? []
        : this.props.emailSuggestions.filter(item => {
            return item.toLowerCase().slice(0, queryLength) === query;
          });

    this.setState({ suggestions, suggestionsVisible: true });
  }

  /**
   * Called when a keyup event is detected on the text input
   */
  initTypeahead() {
    this.refs.textInput.addEventListener('keyup', this.typeaheadCallback);
  }

  componentWillUnmount() {
    this.refs.textInput.removeEventListener('keyup', this.typeaheadCallback);
  }

  /**
   * Before sending a network request to Kickbox API,
   * check that the e-mail follows correct regex protocol.
   * @returns {boolean}
   */
  validRegexEmail() {
    const { emailRegex } = this.props;
    const { email } = this.state;

    return email.length > 0 && emailRegex.test(email);
  }

  /**
   * Initiates the e-mail check process and detects @ symbol keyup to initiate
   * typeahead suggestions.
   * @param e {event} They keyboard event that initiates the callback.
   * @returns {null}
   */
  checkEmail(e: any) {
    // Detect the @ symbol to initiate typeahead
    if (e.which === 64) {
      this.initTypeahead();
    }

    // Don't check e-mail unless it meets valid regex conditions.
    if (!this.validRegexEmail()) {
      return null;
    }

    this.verifyEmail();
  }

  /**
   * Initiates the e-mail check process and detects @ symbol keyup to initiate 
   typeahead suggestions.
   * Unbinds the keyup event listener on the text input to prevent 
   new suggestions from showing after the user has already picked one
   * @param value {string} Uses the domain name suggestion that the user picks
   * @returns {null}
   */
  useSuggestion(value) {
    const inputValue = this.refs.textInput.value;
    const substringToReplace = /@(.*)/.exec(this.state.email)[1];
    const newString = inputValue.replace(substringToReplace, value);

    this.setState(
      {
        suggestions: [],
        suggestionsVisible: false,
        email: newString,
      },
      this.verifyEmail
    );

    // Unbind the keyup event listener on the text input
    this.refs.textInput.removeEventListener('keyup', this.typeaheadCallback);
  }

  /**
    * Makes the call to the Kickbox API and sets component state accordingly.
    @returns {Promise} Promise resolves if Kickbox API responds with an object,
    otherwise logs the error to the console.
  */
  verifyEmail() {
    this.setState({ loading: true, checking: true });

    axios
      .get(`/api/verify/${this.state.email}`)
      .then(res => {
        let { result, reason } = res.data;
        if (result === 'deliverable' && reason === 'accepted_email') {
          this.setState({ valid: true, loading: false });
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
          valid: false,
          loading: false,
          reason: detailedReason,
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const { label, maxLength, placeholder } = this.props;
    const {
      checking,
      loading,
      reason,
      valid,
      suggestions,
      suggestionsVisible,
    } = this.state;

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
                _.debounce(this.checkEmail, 1500, {
                  leading: true,
                })(e);
              }}
              value={this.state.email}
            />
            {suggestionsVisible && suggestions.length > 0 ? (
              <Typeahead
                suggestions={suggestions}
                useSuggestion={this.useSuggestion}
              />
            ) : null}
          </div>
        </div>

        {this.validRegexEmail() ? (
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
