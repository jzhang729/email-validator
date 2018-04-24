import * as React from 'react';
import * as classnames from 'classnames';
import './ValidationStatus.css';

export interface Props {
  checking: boolean;
  loading: boolean;
  reason: string;
  valid: boolean;
}

class ValidationStatus extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);

    this._renderFailure = this._renderFailure.bind(this);
    this._renderLoading = this._renderLoading.bind(this);
    this._renderSuccess = this._renderSuccess.bind(this);
  }

  _renderFailure() {
    return <span className="invalid">{this.props.reason}</span>;
  }

  _renderLoading() {
    let classes = classnames({
      'circle-loader': this.props.checking && this.props.valid,
      'load-complete': !this.props.loading,
    });

    return classes;
  }

  _renderSuccess() {
    if (this.props.loading || !this.props.checking) {
      return null;
    }

    let classes = classnames('draw', {
      checkmark: this.props.valid,
    });

    return <div className={classes} />;
  }

  render() {
    return (
      <div className={this._renderLoading()}>
        {this.props.valid ? this._renderSuccess() : this._renderFailure()}
      </div>
    );
  }
}

export default ValidationStatus;
