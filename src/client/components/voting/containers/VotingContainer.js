// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as appActionCreators from '../../../action-creators/app/appActions'
import * as votingActionCreators from '../../../action-creators/votingActions' // TODO RENAME 2 VOTE
import Voting from '../Voting.js';

const mapStateToProps = (state, props) => {
  return {
    appReducers: state.appReducers,

    // Voting Reducers
    votes: state.votingReducer._votes,
    price: state.votingReducer._price,
    voteErrorMessage: state.votingReducer._voteErrorMessage,
    allowContinueToPayment: state.votingReducer._allowContinueToPayment,
    hasUserPaid: state.votingReducer._hasUserPaid,
    votesHaveFinishedUpdating: state.votingReducer._votesHaveFinishedUpdating,
  };
};

const bundledActionCreators = Object.assign({},
  appActionCreators,
  votingActionCreators,
);

const mapDispatchToProps = dispatch => bindActionCreators(bundledActionCreators, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Voting);
