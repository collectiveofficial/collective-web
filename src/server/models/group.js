const cron = require('cron');
const momentTZ = require('moment-timezone');
const models = require('../../database/models/index');
const restrictedAddressUtils = require('./restricted-address');

module.exports.doesFirstGroupExist = async () => {
  let findGroupResult;
  try {
    findGroupResult = await models.Group.findOne({
      where: {
        id: 1,
      }
    });
    if (findGroupResult !== null) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.populateGroup = async (group) => {
  try {
    await models.Group.create({
      name: group.name,
      type: group.type,
      streetAddress: group.streetAddress,
      aptSuite: group.aptSuite,
      city: group.city,
      state: group.state,
      zipCode: group.zipCode,
      fullAddress: group.aptSuite.length > 0 ? `${group.streetAddress}, ${group.aptSuite}, ${group.city}, ${group.state} ${group.zipCode}` : `${group.streetAddress}, ${group.city}, ${group.state} ${group.zipCode}`,
      descriptor: group.descriptor,
      currentDropoffID: group.currentDropoffID,
      deliveryStreetAddress: group.deliveryStreetAddress,
      deliveryAptSuite: group.deliveryAptSuite,
      deliveryCity: group.deliveryCity,
      deliveryState: group.deliveryState,
      deliveryZipCode: group.deliveryZipCode,
      deliveryFullAddress: group.deliveryAptSuite.length > 0 ? `${group.deliveryStreetAddress}, ${group.deliveryAptSuite}, ${group.deliveryCity}, ${group.deliveryState} ${group.deliveryZipCode}` : `${group.deliveryStreetAddress}, ${group.deliveryCity}, ${group.deliveryState} ${group.deliveryZipCode}`,
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports.findGroupIDbyName = async (name) => {
  let findGroupResult;
  try {
    findGroupResult = await models.Group.findOne({
      where: {
        name,
      },
    });
  } catch (err) {
    console.log(err);
  }
  return findGroupResult.dataValues.id;
};

module.exports.getCurrentVotingDropoffID = async (groupID) => {
  let currentVotingDropoffID;
  try {
    const group = await models.Group.findOne({
      where: {
        id: groupID,
      },
    });
    currentVotingDropoffID = group.dataValues.currentVotingDropoffID;
  } catch (err) {
    console.log(err);
  }
  return currentVotingDropoffID;
};

module.exports.scheduleVotingDropoffSwitch = async (newBulkBuyData) => {
  const voteDateTimeBeg = newBulkBuyData.voteDateTimeBeg;
  const voteDateTimeEnd = newBulkBuyData.voteDateTimeEnd;
  const dropoffID = newBulkBuyData.dropoffID;
  const groupID = newBulkBuyData.groupID;
  const currentDateTime = await momentTZ.tz(new Date(), 'America/New_York');
  const changeCurrentVotingDropoffID = async () => {
    await models.Group.update({
      currentVotingDropoffID: dropoffID,
    }, {
      where: {
        id: groupID,
      },
    });
    await restrictedAddressUtils.updateDropoffID(dropoffID, groupID);
  };
  if (await currentDateTime.isBetween(voteDateTimeBeg, voteDateTimeEnd)) {
    await changeCurrentVotingDropoffID();
  } else if (await currentDateTime.isBefore(voteDateTimeBeg)) {
    const changeCurrentVotingDropoffJob = new cron.CronJob(new Date(voteDateTimeBeg), async () => {
      /* runs once at the specified date. */
      console.log('changeCurrentVotingDropoffJob ticked');
      await changeCurrentVotingDropoffID();
    }, () => {
      /* This function is executed when the job stops */
      console.log('mission accomplished');
    },
    true, /* Start the job right now */
    'America/New_York'); /* Time zone of this job. */

    console.log(`changeCurrentVotingDropoffJob status at dropoffID ${dropoffID} and voteDateTimeBeg of ${voteDateTimeBeg}: ${changeCurrentVotingDropoffJob.running}`); // changeCurrentVotingDropoffJob status undefined
  }
};

module.exports.findDeliveryAddressFromGroupID = async (id) => {
  try {
    const group = await models.Group.findOne({
      where: {
        id,
      },
    });
    return group.dataValues.deliveryFullAddress;
  } catch(err) {
    console.log(err);
  }
};
