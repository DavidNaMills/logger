
/**
 * dataFactory configuration
 * @typedef dataFactoryConfig default configuration for the data factory. These options are specific only to custom channels ie files, database, etc
 * @see {@link loggerMethodConfig}
 * @property {Boolean} [isRaw=true] (Custom Channel Only) If true then an object will be returned. if false then the object will be stringified
 * @property {Array} [displayFields=['which', 'date', 'location', 'name', 'debug', 'data']] The fields to be added to the logged object.
 */

const defaultConfig = {
    isRaw: true,
    displayFields: ['which', 'date', 'location', 'name', 'debug', 'data']
}

/**
 * @module dataFactory
 * @private
 * @description
 * Responsible for compiling data to be logged into an object or a string for custom logging channels.
 * @param {String | Object} dataToAdd The string or object to be logged
 * @param {Object} config Configuration for custom channels. @see {@link loggerMethodConfig} for full configuration options @see {@link dataFactoryConfig} for default configuration
 */

module.exports = (dataToAdd, config = defaultConfig) =>{
    const tempObj = {};
    const tempFields = config.displayFields ? config.displayFields : defaultConfig.displayFields;   // select the field array to use
    const tempIsRaw = config.hasOwnProperty('isRaw') ? config.isRaw : defaultConfig.isRaw;
    tempFields.forEach(y=>{
        if (y === 'data' && dataToAdd.data) {       // add data to the object
            if (Object.prototype.toString.call(dataToAdd.data) === '[object Object]') {
                for (let x in dataToAdd.data) {         // if data is an object, loop over and add the field to the object
                    if(dataToAdd.data[x]){
                        tempObj[x] = dataToAdd.data[x];
                    }
                }
            } else {
                tempObj.data = dataToAdd.data;
            }
        }
        if (y === 'debug' && dataToAdd.debug) {     // add debug info
            for (let x in dataToAdd.debug) {
                tempObj[x] = dataToAdd.debug[x];
            }
        }else if(dataToAdd[y]){
            tempObj[y] = dataToAdd[y]
        }
    })
    return (config && tempIsRaw)
        ? tempObj                       // return object
        : JSON.stringify(tempObj);      // return stringified object
}