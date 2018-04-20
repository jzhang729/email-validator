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

    this.renderSuccess = this.renderSuccess.bind(this);
    this.renderFailure = this.renderFailure.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
  }

  private renderSuccess() {
    if (this.props.loading) {
      return null;
    }

    let classes = classnames('draw', {
      checkmark: this.props.valid,
    });

    return <div className={classes} />;
  }

  private renderFailure() {
    return <span className="invalid">{this.props.reason}</span>;
  }

  private renderLoading() {
    let classes = classnames({
      'circle-loader': this.props.checking && this.props.valid,
      'load-complete': !this.props.loading,
    });

    return classes;
  }

  public render() {
    return (
      <div className={this.renderLoading()}>
        {this.props.valid ? this.renderSuccess() : this.renderFailure()}
      </div>
    );
  }
}

export default ValidationStatus;
