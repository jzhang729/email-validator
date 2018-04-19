import axios from 'axios';
import * as _ from 'lodash';
import * as React from 'react';
import './EmailForm.css';

export interface Props {
  label: string;
}

export interface State {
  email: string;
}

export interface SyntheticEvent<T> {
  target: EventTarget & T;
}

class EmailForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      email: '',
    };

    this.verifyEmail = this.verifyEmail.bind(this);
  }

  private verifyEmail() {
    if (this.state.email.length > 5 && this.state.email.indexOf('@') !== -1) {
      axios
        .get(`/api/verify/${this.state.email}`)
        .then(res => {
          console.log(res.data);
        })
        .catch(err => console.log(err));
    }
  }

  public render() {
    const { label } = this.props;
    return (
      <div className="input__wrapper">
        <label htmlFor="email">{label}</label>
        <input
          id="email"
          type="email"
          onChange={e => {
            this.setState({ email: e.target.value });
            _.throttle(this.verifyEmail, 1300, { trailing: true })();
          }}
          value={this.state.email}
        />
      </div>
    );
  }
}

export default EmailForm;
