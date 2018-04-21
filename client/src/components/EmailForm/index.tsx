import * as _ from 'lodash';
import * as React from 'react';
import axios from 'axios';
import './EmailForm.css';
import ValidationStatus from '../ValidationStatus';

export interface Props {
  emailSuggestions: any;
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

    this.checkEmail = this.checkEmail.bind(this);
    this.initTypeahead = this.initTypeahead.bind(this);
    this.filterSuggestions = this.filterSuggestions.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);
    this.validRegexEmail = this.validRegexEmail.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }

  private filterSuggestions() {
    let query = this.state.email.split('@').splice(1, 1)[0];

    if (!query || query.length < 1) {
      return;
    }

    let queryLength = query.length;

    let suggestions =
      queryLength === 0
        ? []
        : this.props.emailSuggestions.filter(item => {
            return item.toLowerCase().slice(0, queryLength) === query;
          });

    this.setState({ suggestions });
  }

  private renderSuggestions() {
    const { suggestions } = this.state;

    if (suggestions.length === 0) {
      return;
    }
    return (
      <ul className="typehead__results">
        {this.state.suggestions.map(item => {
          return <li key={item}>{item}</li>;
        })}
      </ul>
    );
  }

  private initTypeahead() {
    this.refs.textInput.addEventListener('keyup', this.filterSuggestions);
  }

  componentWillUnmount() {
    this.refs.textInput.removeEventListener('keyup', this.filterSuggestions);
  }

  /**
   * Before sending a network request to Kickbox API,
   * check that the e-mail follows correct regex protocol.
   * @returns {boolean}
   */
  private validRegexEmail() {
    const { emailRegex } = this.props;
    const { email } = this.state;

    return email.length > 0 && emailRegex.test(email);
  }

  /**
   * Initiates the e-mail check process and detects @ symbol keyup to initiate
   * typeahead suggestions.
   * @param key {string} The detected key on keyup event to activate typeahead.
   * @returns {null}
   */
  private checkEmail(key: string) {
    if (key === '@') {
      this.initTypeahead();
    }

    this.setState({ checking: true });
    this.verifyEmail();
  }

  /**
    * Makes the call to the Kickbox API and sets component state accordingly.
    @returns {Promise} Promise resolves if Kickbox API responds with an object,
    otherwise logs the error to the console.
  */
  private verifyEmail() {
    if (!this.validRegexEmail()) {
      return;
    }

    this.setState({ loading: true });

    axios
      .get(`/api/verify/${this.state.email}`)
      .then(res => {
        // console.log(res.data);
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

        this.setState({ valid: false, loading: false, reason: detailedReason });
      })
      .catch(err => console.log(err));
  }

  public render() {
    const { label, maxLength, placeholder } = this.props;
    const { checking, loading, reason, valid } = this.state;

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
              onKeyUp={e => {
                _.debounce(this.checkEmail, 1500, {
                  leading: true,
                })(e.key);
              }}
              value={this.state.email}
            />
            {this.renderSuggestions()}
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
