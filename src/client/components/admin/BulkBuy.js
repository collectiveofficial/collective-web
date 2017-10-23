// @flow
import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import ArrowForwardIcon from 'material-ui/svg-icons/navigation/arrow-forward';
import { Icon, Header } from 'semantic-ui-react';
import InputMoment from 'input-moment';
import momentTZ from 'moment-timezone';
import SelectLocationContainer from './containers/SelectLocationContainer.js';
import SelectFoodItemsPageContainer from './containers/SelectFoodItemsPageContainer.js';
import AddBulkBuyConfirmationContainer from './containers/AddBulkBuyConfirmationContainer.js';
import './less/input-moment.less';
import './less/app.less';
import 'input-moment/dist/input-moment.css';

type Props = {
  adminReducers: {
    intendedPickupTimeStart: string,
    intendedPickupTimeEnd: string,
    voteDateTimeBeg: string,
    voteDateTimeEnd: string,
    stepIndex: number,
    formattedAddress: string,
    locationStreetNumber: string,
    locationStreetName: string,
    locationCity: string,
    locationState: string,
    locationZipCode: string,
    selectedFoodItems: Array<{
      name: string,
      imageUrl: string,
    }>,
  },
  setPickupTimeStart: (string) => void,
  setPickupTimeEnd: (string) => void,
  setVoteTimeBeg: (string) => void,
  setVoteTimeEnd: (string) => void,
  handlePrev: (number) => void,
  handleNext: (number,
    Array<{
      step: string,
      state?: string,
      action?: (string) => void
    }>,
    object?: {
      locationObj: {
        formattedAddress: string,
        streetNumber: string,
        streetName: string,
        city: string,
        state: string,
        zipCode: string,
      },
      intendedPickupTimeStart: string,
      intendedPickupTimeEnd: string,
      voteDateTimeBeg: string,
      voteDateTimeEnd: string,
      shipDate: any,
      selectedFoodItems: Array<{
        name: string,
        imageUrl: string,
      }>,
      pricePerDormPackage: number,
      pricePerCookingPackage: number,
      totalDormPackagesOrdered: number,
      totalCookingPackagesOrdered: number,
      totalDollarAmount: number,
      pctFeePerPackage: number,
      totalRevenueBeforeStripe: number,
      totalRevenueAftereStripe: number,
    }) => void,
};

const BulkBuy = (props: Props) => {
  props.clearBulkBuy();
  const styles = {
    confirmation: {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'center',
      'align-items': 'center',
    },
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
      step: 'Select Location',
    },
    {
      step: 'Select Food Items',
    },
  ];

  return (
    <div>
      {props.adminReducers.bulkBuySaved ?
        <AddBulkBuyConfirmationContainer />
        :
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
              {stepProps.map((stepProp, index) => {
                console.log('---> stepProp.state: ', stepProp.state);
                return (
                  <div>
                    {index === props.adminReducers.stepIndex && props.adminReducers.stepIndex < 4 ?
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
                      <div></div>
                    }
                  </div>
              )})}
            </div>
            <div>
              {props.adminReducers.stepIndex === stepProps.length - 2 ?
                <SelectLocationContainer />
                :
                <div></div>
              }
              {props.adminReducers.stepIndex === stepProps.length - 1 ?
                <SelectFoodItemsPageContainer />
                :
                <div></div>
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
                      userWantsEditDropoff: props.adminReducers.userWantsEditDropoff,
                      editDropoffID: props.adminReducers.editDropoffID,
                      locationObj: {
                        formattedAddress: props.adminReducers.formattedAddress,
                        streetNumber: props.adminReducers.locationStreetNumber,
                        streetName: props.adminReducers.locationStreetName,
                        city: props.adminReducers.locationCity,
                        state: props.adminReducers.locationState,
                        zipCode: props.adminReducers.locationZipCode,
                      },
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
    }
    </div>
  );
};

export default BulkBuy;
