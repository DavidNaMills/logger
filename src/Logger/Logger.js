const Logger = require('./LoggerInstance');
const DateClass = require('./DateClass');
const StringClass = require('./StringClass');
const dataFactory = require('./DataFactory');

const dateClass = new DateClass();
const stringClass = new StringClass(dateClass.createDateString);

module.exports = new Logger(dateClass, stringClass, dataFactory);