
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    default: '',
    font: {
        '1': '\x1b[31m',
        '2': '\x1b[33m',
        '3': '\x1b[35m',
        '4': '\x1b[34m'
    },
    debug: "\x1b[36m"
}

const msg = {
    '1': 'ERROR',
    '2': 'WARNING',
    '3': 'INFO',
    '4': 'DEV'
}


/**
 * StringClass
 * @private
 * @classdesc Class to build the string and add styling if needed
 * @param {Function} injectDate A function to generate a date
 */

class StringClass {

    constructor(injectDate){
        this.createDateString = injectDate;
    }

    /**
     * buildString
     * @param {String | Object} data The data that will evetually be logged
     * @param {Array} displayConfig An array containing specific fields to be displayed
     * @description 
     * Either accepts a string or an object. 
     * An array of specific fields to log. If the property is in the array then it will be added to the string.
     * If the property in the array is not valid in the data object then "VALUE MISSING" will be used as a place holder.
     * The order of the string depends on the array.
     * 
     * @returns {String | Object} Returns the full string, a stringified object, or a stringified object with specified fields
     * 
     */

    buildString(data, displayConfig=null){
        const typ = typeof (data);
        if (typ === 'object' && (!displayConfig || displayConfig.length === 0)) {
            return JSON.stringify(data);
        } else if (typ === 'object' && displayConfig) {
            let newStr = {};
            displayConfig.forEach(x => {
                if (data[x]) {
                    newStr[x] = data[x];
                } else {
                    newStr[x] = `VALUE MISSING`
                }
            })
            return JSON.stringify(newStr);
        } else {
            return `${data}`;
        }
    }


    /**
     * stringFormatter
     * @param {Object} tempConfig Object that specifies the formatting conditions: @see {@link loggerMethodConfig}
     * @param {Integer} which The logging level (1-4)
     * @param {Object} debug Object containing the debugging information: @see {@link debugInfo}
     * @param {String} The actual data to be logged
     * 
     * @description Adds addition data to the string and adds styling if needed.
     * @returns String
     * @example 
     * Assuming all options are true 
     * <type> <Date -MM/DD/YYYY, HH:mm:ss AM|PM> <debug- \folder\filename line:pos> <string to be logged>
     * (WARNING 3/31/2020, 2:10:01 PM  \Logger\index.js: 27:23        unauthorised access attempt)
     * Colors are not shown in example:
     * Colours are on type, date, debug
     */

    stringFormatter(tempConfig, which, debug, fullStr){
        const str = [];
        if (tempConfig.colors) {
            str.push(colors.bright);
            str.push(colors.font[`${which}`]);
        }
    
        str.push(msg[`${which}`]);
    
        if (tempConfig.name) {
            str.push(`<${tempConfig.name}>`);
        }
    
        if (tempConfig.showDate) {
            str.push(`${this.createDateString()}`);
        }
    
        if (tempConfig.colors) {
            str.push(colors.reset);
        }
    
        if (tempConfig.isDebug && tempConfig.isDebug.on) {
            if (tempConfig.isDebug.onlyLevel && tempConfig.isDebug.onlyLevel === which) {
                str.push(tempConfig.colors ? `${colors.debug}${debug.functionName}: ${debug.lineNumber}${colors.reset}` :  `${debug.functionName}: ${debug.lineNumber}`);
    
            } else if (tempConfig.isDebug.level && tempConfig.isDebug.level >= which) {
                str.push(tempConfig.colors ? `${colors.debug}${debug.functionName}: ${debug.lineNumber}${colors.reset}` : `${debug.functionName}: ${debug.lineNumber}`);
            }
        }
    
        str.push('\t');
        str.push(fullStr);
        const strComp = str.join(' ');
        return strComp;
    }


}

module.exports = StringClass;