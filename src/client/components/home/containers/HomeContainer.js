// Redux imports
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// Redux actions imports
import * as homeActionCreators from '../../../action-creators/homeActions';
import Home from '../Home.js';

const mapStateToProps = (state) => {
  return {
    date: state.homeReducer._date,
    vote: state.homeReducer._vote,
    remainingCalendar: state.homeReducer._remainingCalendar,
    items: state.homeReducer._items,
    provider: state.homeReducer._provider,
    location: state.homeReducer._location,
  }
};

export default connect(mapStateToProps)(Home);
