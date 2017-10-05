import React, { Component } from 'react';
import {
  Route,
  Link
} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import AutoComplete from 'material-ui/AutoComplete';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import { Sidebar, Segment, Button, Menu, Image, Icon, Header, Transition } from 'semantic-ui-react';
import InputMoment from 'input-moment';
import momentTZ from 'moment-timezone';
import injectTapEventPlugin from 'react-tap-event-plugin';
import SelectFoodItemsPageContainer from './SelectFoodItemsPageContainer.js';
import './less/input-moment.less';
import './less/app.less';
import 'input-moment/dist/input-moment.css';

injectTapEventPlugin();

const BulkBuy = (props) => {
  const styles = {
    field: {
      textAlign: 'left',
    },
    bulkBuys: {
      marginBottom: '1.5%',
    },
    topHeader: {
      marginLeft: '35%',
    },
    form: {
      marginLeft: '35%',
      // marginLeft: '1%',
    },
    timeControl: {
      margin: '3% 0 1% 35%',
    },
  };

  const stepProps = [
    {
      step: 'Select Pickup Start Time',
      state: props.adminReducers.intendedPickupTimeStart,
      action: props.setPickupTimeStart,
    },
    {
      step: 'Select Pickup End Time',
      state: props.adminReducers.intendedPickupTimeEnd,
      action: props.setPickupTimeEnd,
    },
    {
      step: 'Select Voting Start Time',
      state: props.adminReducers.voteDateTimeBeg,
      action: props.setVoteTimeBeg,
    },
    {
      step: 'Select Voting End Time',
      state: props.adminReducers.voteDateTimeEnd,
      action: props.setVoteTimeEnd,
    },
    {
      step: 'Select Food Items',
      // state: props.adminReducers.voteDateTimeEnd,
      // action: props.setVoteTimeEnd,
    },
  ];

  return (
    <div>
      <div style={styles.bulkBuys}>
        <div style={styles.topHeader}>
          <Header as="h2" icon>
            <Icon name="truck" />
            Add Bulk Buys
            <Header.Subheader>
              Create new bulk buys for your members
            </Header.Subheader>
          </Header><br />
        </div>
      </div>
      <Stepper activeStep={props.adminReducers.stepIndex} connector={<ArrowForwardIcon />}>
        {stepProps.map(stepProp => (
          <Step>
            <StepLabel>{stepProp.step}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div style={styles.bulkBuys}>
        <div style={styles.form}>
          {stepProps.map((stepProp, index) => (
            <div>
              {index === props.adminReducers.stepIndex && props.adminReducers.stepIndex !== stepProps.length - 1 ?
                <div>
                  <div className="input">
                    <TextField
                      type="text"
                      value={stepProp.state.format('llll')}
                      readOnly
                      floatingLabelText={stepProp.step}
                      floatingLabelFixed={true}
                    />
                  </div>
                  <br />
                  <InputMoment
                    moment={stepProp.state}
                    onChange={async (dateTime) => {
                      const tzLessDateTime = await momentTZ(dateTime).clone();
                      const newDateTime = await tzLessDateTime.tz('America/New_York').add(dateTime.utcOffset() - tzLessDateTime.utcOffset(), 'minutes');
                      stepProp.action(newDateTime);
                    }}
                  />
                </div>
                :
                <div />
              }
            </div>
            ))}
        </div>
        <div>
          {props.adminReducers.stepIndex === stepProps.length - 1 ?
            <SelectFoodItemsPageContainer />
            :
            <div />
          }
          <div style={styles.timeControl}>
            <FlatButton
              label="Back"
              disabled={props.adminReducers.stepIndex === 0}
              onTouchTap={() => { props.handlePrev(props.adminReducers.stepIndex); }}
              style={{ marginRight: '1%' }}
            />
            <RaisedButton
              label={props.adminReducers.stepIndex === stepProps.length - 1 ? 'Finish' : 'Next'}
              primary={true}
              onTouchTap={() => {
                const newBulkBuyInfo = {
                  intendedPickupTimeStart: props.adminReducers.intendedPickupTimeStart,
                  intendedPickupTimeEnd: props.adminReducers.intendedPickupTimeEnd,
                  voteDateTimeBeg: props.adminReducers.voteDateTimeBeg,
                  voteDateTimeEnd: props.adminReducers.voteDateTimeEnd,
                  shipDate: null,
                  selectedFoodItems: props.adminReducers.selectedFoodItems,
                  pricePerDormPackage: 6,
                  pricePerCookingPackage: 6,
                  totalDormPackagesOrdered: 0,
                  totalCookingPackagesOrdered: 0,
                  totalDollarAmount: 0,
                  pctFeePerPackage: 0,
                  totalRevenueBeforeStripe: 0,
                  totalRevenueAftereStripe: 0,
                };
                if (props.adminReducers.stepIndex === stepProps.length - 1) {
                  props.handleNext(props.adminReducers.stepIndex, stepProps, newBulkBuyInfo);
                } else {
                  props.handleNext(props.adminReducers.stepIndex, stepProps);
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkBuy;
