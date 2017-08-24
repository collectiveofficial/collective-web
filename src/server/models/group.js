const models = require('../../database/models/index');
const moment = require('moment-timezone');

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

module.exports.updateCurrentDropoffID = async (currentDropoffID, groupID) => {
  await models.Group.update({
    currentDropoffID,
  }, {
    where: {
      id: groupID,
    },
  });
  // const dateNowInEST = moment.tz(new Date(), 'America/New_York');
  // const intendedPickupTimeEnd = await dropoffUtil.findIntendedPickupTimeEnd(currentDropoffID, groupID);
  // if (dateNowInEST > intendedPickupTimeEnd) {
  //   await models.Group.update({
  //     currentDropoffID,
  //   }, {
  //     where: {
  //       id: groupID,
  //     },
  //   });
  // }
};

module.exports.updateCurrentVotingDropoffID = async (currentVotingDropoffID, groupID) => {
  await models.Group.update({
    currentVotingDropoffID,
  }, {
    where: {
      id: groupID,
    },
  });
};
