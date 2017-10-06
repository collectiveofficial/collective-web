const models = require('../../database/models/index');
const momentTZ = require('moment-timezone');
const dropoffUtil = require('./dropoff');
const cron = require('cron');

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

module.exports.updateCurrentDropoffID = async () => {
  try {
    const dropoffs = await dropoffUtil.getAllDropoffs();
    for (let i = 0; i < dropoffs.length; i++) {
      const voteDateTimeBeg = dropoffs[i].dataValues.voteDateTimeBeg;
      const intendedPickupTimeEnd = dropoffs[i].dataValues.intendedPickupTimeEnd;
      const dropoffID = dropoffs[i].dataValues.id;
      const groupID = dropoffs[i].dataValues.groupID;

      const changeCurrentVotingDropoffJob = new cron.CronJob(new Date(voteDateTimeBeg), async () => {
        /* runs once at the specified date. */
        console.log('changeCurrentVotingDropoffJob ticked');
        await models.Group.update({
          currentVotingDropoffID: dropoffID,
        }, {
          where: {
            id: groupID,
          },
        });

      }, () => {
        /* This function is executed when the job stops */
        console.log('mission accomplished');
      },
      true, /* Start the job right now */
      'America/New_York'); /* Time zone of this job. */

      console.log(`changeCurrentVotingDropoffJob status at dropoffID ${dropoffID} and voteDateTimeBeg of ${voteDateTimeBeg}: ${changeCurrentVotingDropoffJob.running}`); // changeCurrentVotingDropoffJob status undefined

      if (i < dropoffs.length - 1) {
        const nextDropoffID = dropoffs[i+1].dataValues.id;
        const changeCurrentDropoffJob = new cron.CronJob(new Date(intendedPickupTimeEnd), async () => {
          /* runs once at the specified date. */
          console.log('changeCurrentDropoffJob ticked');
          await models.Group.update({
            currentVotingDropoffID: nextDropoffID,
          }, {
            where: {
              id: groupID,
            },
          });

        }, () => {
          /* This function is executed when the job stops */
          console.log('mission accomplished');
        },
        true, /* Start the job right now */
        'America/New_York'); /* Time zone of this job. */

        console.log(`changeCurrentDropoffJob status at dropoffID ${dropoffID} and intendedPickupTimeEnd of ${intendedPickupTimeEnd}: ${changeCurrentDropoffJob.running}`); // changeCurrentDropoffJob status undefined
      }
    }

  } catch (err) {
    console.log(err);
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
