var db = require('../models/index');

const string2DataType = {
  INTEGER: db.Sequelize.INTEGER,
  STRING: db.Sequelize.STRING,
  TEXT: db.Sequelize.TEXT,
  BIGINT: db.Sequelize.BIGINT,
  FLOAT: db.Sequelize.FLOAT,
  REAL: db.Sequelize.REAL,
  'DOUBLE PRECISION': db.Sequelize.DOUBLE,
  DECIMAL: db.Sequelize.DECIMAL,
  DATE: db.Sequelize.DATE,
  DATEONLY: db.Sequelize.DATEONLY,
  BOOLEAN: db.Sequelize.BOOLEAN,
  ENUM: db.Sequelize.ENUM,
  ARRAY: db.Sequelize.ARRAY,
  JSON: db.Sequelize.JSON,
  JSONB: db.Sequelize.JSONB,
  BLOB: db.Sequelize.BLOB,
  UUID: db.Sequelize.UUID,
  RANGE: db.Sequelize.RANGE,
  GEOMETRY: db.Sequelize.GEOMETRY,
};
const getColumnDiffsFromModel = (queryInterface, liveTableName, sequelizeModelName) => {
  // use describeTable to get live postgres attributes
  return queryInterface.describeTable(liveTableName).then((attributes) => {
    // parse attributes for keys (column names)
    const liveTableCols = Object.keys(attributes);
    // get model columns
    const modelCols = Object.keys(db.sequelize.model(sequelizeModelName).tableAttributes); // GET MODEL COLUMN NAMES
    // get array diffs into array
    const colDifferences = modelCols.filter(idx => liveTableCols.indexOf(idx) === -1);
    return colDifferences;
  });
};

const getColumnDiffsFromDatabase = (queryInterface, liveTableName, sequelizeModelName) => {
  // use describeTable to get live postgres attributes
  return queryInterface.describeTable(liveTableName).then((attributes) => {
    // parse attributes for keys (column names)
    const liveTableCols = Object.keys(attributes);
    // get model columns
    const modelCols = Object.keys(db.sequelize.model(sequelizeModelName).tableAttributes);
    // get array diffs into array
    const colDifferences = liveTableCols.filter(idx => modelCols.indexOf(idx) === -1);
    return colDifferences;
  });
};
module.exports = {
  getColumnDiffsFromModel,
  getColumnDiffsFromDatabase,
  addModelDiffsToDatabase: async (queryInterface, liveTableName, sequelizeModelName) => {
    // get col diffs
    const colDifferences = await getColumnDiffsFromModel(queryInterface, liveTableName, sequelizeModelName);
    // get modelObj
    const modelObjAttrs = db.sequelize.model(sequelizeModelName).tableAttributes;
    let dataType;
    colDifferences.forEach((colName) => {
      // get datatype from attribute string
      dataType = string2DataType[modelObjAttrs[colName].type.constructor.key]; // GET MODEL DATATYPES
      queryInterface.addColumn(liveTableName, colName, dataType);
    });
  },
  removeModelDiffsFromDatabase: async (queryInterface, liveTableName, sequelizeModelName) => {
    // get col diffs
    const colDifferences = await getColumnDiffsFromDatabase(queryInterface, liveTableName, sequelizeModelName);
    colDifferences.forEach((colName) => {
      // get datatype from attribute string
      queryInterface.removeColumn(liveTableName, colName);
    });
  },
  createUpdatedModelMigrations: function (queryInterface, sequelizeModelName, liveTableName, Sequelize) { // has to be ES5 function for 'this' binding
    const newModelMigrationObj = {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
    };
    const modelObjAttrs = db.sequelize.model(sequelizeModelName).tableAttributes;
    let dataType;
    for (let modelObjAttr in modelObjAttrs) {
        if (modelObjAttr !== 'id') {
              dataType = string2DataType[modelObjAttrs[modelObjAttr].type.constructor.key]; // GET MODEL DATATYPES
              // NOTE TO SELF: if we ever want more than just type in the object, look above ^^
              newModelMigrationObj[modelObjAttr] = {
                type: dataType,
              };
        }
      // console.log('--------> modelObjAttrs: ', modelObjAttr);
      // console.log('--------> modelObjAttrs[modelObjAttr].type.constructor.key: ', modelObjAttrs[modelObjAttr].type.constructor.key);
    }
    // const modelCols = Object.keys(modelObjAttrs); // GET MODEL COLUMN NAMES
    // let dataType;
    // modelCols.forEach((modelCol) => {
    //   if (modelCol !== 'id' && modelCol !== 'createdAt' && modelCol !== 'updatedAt') {
    //     dataType = string2DataType[modelObjAttrs[modelCol].type.constructor.key]; // GET MODEL DATATYPES
    //     // NOTE TO SELF: if we ever want more than just type in the object, look above ^^
    //     newModelMigrationObj[modelCol] = {
    //       type: dataType,
    //     };
    //   }
    // });
    newModelMigrationObj.createdAt = {
      allowNull: false,
      type: Sequelize.DATE,
    };
    newModelMigrationObj.updatedAt = {
      allowNull: false,
      type: Sequelize.DATE,
    };
    console.log('--------> newModelMigrationObj: ', newModelMigrationObj);
    queryInterface.showAllTables().then((tableNames) => {
      if (tableNames.indexOf(liveTableName) < 0) {
        return queryInterface.createTable(liveTableName, newModelMigrationObj);
      } else {
        this.addModelDiffsToDatabase(queryInterface, liveTableName, sequelizeModelName);
      }
    });
  },
};
