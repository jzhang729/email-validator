import axios from 'axios';
import * as _ from 'lodash';
import * as React from 'react';

import ValidationStatus from '../ValidationStatus';
import './EmailForm.css';

export interface Props {
  label?: string;
  placeholder?: string;
}

export interface State {
  checking: boolean;
  email: string;
  reason: string;
  valid: boolean;
  loading: boolean;
  suggestions: any[];
}

export interface SyntheticEvent<T> {
  target: EventTarget & T;
  key: KeyboardEvent & T;
}

class EmailForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      checking: false,
      email: '',
      reason: '',
      valid: false,
      loading: false,
      suggestions: [],
    };

    this.validRegexEmail = this.validRegexEmail.bind(this);
    this.checkEmail = this.checkEmail.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }

  private validRegexEmail() {
    const { email } = this.state;

    // Regex taken from http://emailregex.com
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

    return email.length > 0 && emailRegex.test(email);
  }

  private checkEmail(key: string) {
    if (key === '@') {
      console.log('Typeahead should start here');
    }

    this.setState({ checking: true });
    this.verifyEmail();
  }

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

        detailedReason += '. Please try another e-mail.';

        this.setState({ valid: false, loading: false, reason: detailedReason });
      })
      .catch(err => console.log(err));
  }

  public render() {
    const { label, placeholder } = this.props;

    return (
      <div>
        <div className="input__wrapper">
          <label htmlFor="email">{label}</label>
          <input
            id="email"
            type="email"
            placeholder={placeholder}
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
        </div>

        {this.validRegexEmail() ? (
          <div className="validation__wrapper">
            <ValidationStatus
              checking={this.state.checking}
              loading={this.state.loading}
              valid={this.state.valid}
              reason={this.state.reason}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default EmailForm;
