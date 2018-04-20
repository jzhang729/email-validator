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
}

export interface SyntheticEvent<T> {
  target: EventTarget & T;
}

class EmailForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      // checking: false,
      checking: true,
      email: '',
      reason: '',
      valid: false,
      // loading: false,
      loading: true,
    };

    this.checkEmail = this.checkEmail.bind(this);
    this.verifyEmail = this.verifyEmail.bind(this);
  }

  private checkEmail() {
    if (this.state.email.length > 5 && this.state.email.indexOf('@') !== -1) {
      this.setState({ checking: true });
      this.verifyEmail();
    }
  }

  private verifyEmail() {
    this.setState({ loading: true });

    axios
      .get(`/api/verify/${this.state.email}`)
      .then(res => {
        console.log(res.data);
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

        this.setState({ valid: false, loading: false, reason: detailedReason });
      })
      .catch(err => console.log(err));
  }

  public render() {
    const { label, placeholder } = this.props;
    return (
      <div className="input__wrapper">
        <label htmlFor="email">{label}</label>
        <input
          id="email"
          type="email"
          placeholder={placeholder}
          onChange={e => {
            this.setState({ email: e.target.value });
            _.debounce(this.checkEmail, 1000, { leading: true })();
          }}
          value={this.state.email}
        />

        <ValidationStatus
          checking={this.state.checking}
          loading={this.state.loading}
          valid={this.state.valid}
          reason={this.state.reason}
        />
      </div>
    );
  }
}

export default EmailForm;
