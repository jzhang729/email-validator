import * as React from 'react';
import Loading from '../Loading';

export interface Props {
  checking: boolean;
  loading: boolean;
  reason: string;
  valid: boolean;
}

class ValidationStatus extends React.Component<Props, {}> {
  public render() {
    return (
      <div>
        {!this.props.checking ? null : (
          <div>
            {this.props.loading ? (
              <Loading />
            ) : (
              <div>
                {this.props.valid ? (
                  <span className="valid">Valid!</span>
                ) : (
                  <div>
                    <span className="invalid">Invalid!</span>
                    <span>{this.props.reason}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ValidationStatus;
