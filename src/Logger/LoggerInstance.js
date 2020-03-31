
const ERROR = 1;
const WARNING = 2;
const INFO = 3;
const DEV = 4;

const regex = /\((.*):(\d+):(\d+)\)$/


/**
 * Logger Class
 * @classdesc
 * Contains the main logging fuctions that are exposed
 */


class Logger {
    /**
     * Constructor
     * @param {Class} dateClass    class for handling the date and date formatting
     * @param {Class} stringClass  class for handling all string manipulation and styling
     * @param {Class} dataFactory  class for building the data string
     */
    constructor(dateClass, stringClass, dataFactory){
        this.dateClass = dateClass;
        this.stringClass = stringClass;
        this.dataFactory = dataFactory;
        this.config = [];
        this.level = 3;
        this.location = null;
        this.debug = {
            functionName: null,
            lineNumber: null
        }
    }

    
    /**
     * _log
     * @private
     * @param {String | Object} data The data object or string to be logged
     * @param {Integer} which The level of the log

     * @todo
     * Remove this function and add to its own class or separate function
     */

    _log(data, which) {     // remove from class?   pass this.config into here
        if (this.level >= which) {
            this.config.forEach(conf => {
                const tempLevel = conf.onlyLevel ? conf.onlyLevel : which;

                if (tempLevel == which) {
                    switch (conf.type.toLowerCase()) {
                        case 'console':     // write to console
                            this._console(data, which, conf);
                            break;
                        case 'function':    // other method
                            const compiledData = this.dataFactory({
                                which, 
                                date: this.dateClass.createDateString(),
                                debug: this.debug,
                                data,
                                location: this.location
                            }, conf.fieldConfig);
                            this._function(compiledData, conf.func, conf.options);
                            break;
                        default:
                            console.error('Invalid method type: [console, function]');
                            break;
                    }
                } // end of if
            })  // end of forEach
        }
    }


    /**
     * _console
     * @private
     * @param {String | Object} data Data to be logged
     * @param {Integer} which Level of logging required
     * @param {Object} [tempConfig=[]] Object with array of fields to display. 
     */
    _console(data, which, tempConfig) { 
        const fullStr = this.stringClass.buildString(data, tempConfig.displaySchema);
        const strComp = this.stringClass.stringFormatter(tempConfig, which, this.debug, fullStr);
        
        switch (which) {
            case ERROR:
                console.error(strComp);
                break;
            case WARNING:
                console.warn(strComp);
                break;
            case INFO:
                console.info(strComp);
                break;
            case DEV:
                console.log(strComp);
                break;
            default:
                break
        }
    }

    /**
     * configLogger
     * @description
     * Function that must be invoked to configure the logger
     * 
     * @param {loggerConfig} config Channel configuration object
     * @param {String} location An ID for the logger, if using multiple logging channels
     */
    configLogger(config, location=null) {
        this.config = config.methods;
        this.level = config.level ? config.level : 3;
        this.location = location;
    }


    /**
     * error
     * @description Used to log errors: level 1
     * @param {String | Object} message data to log to channel(s)
     * @example
     * logger.error('This is a error message');
     * logger.error({
     *      msg: 'this is a error',
     *      why: 'something broke'
     * });
     */
    error(message) {
        const e = new Error();
        const match = regex.exec(e.stack.split("\n")[2]);
        this.debug.functionName = match[1].split('\\').pop();
        this.debug.lineNumber = match[2];
        this._log(message, ERROR);
    }

    /**
     * warning
     * @description Used to log warnings: level 2
     * @param {String | Object} message data to log to channel(s)
     * @example
     * logger.warning('This is a warning message');
     * logger.warning({
     *      msg: 'this is a warning',
     *      why: 'something broke'
     * });
     */
    warning(message) {
        this.debug = {
            functionName: null,
            lineNumber: null
        };

        if (this.level >= WARNING) {
            const e = new Error();
            const match = regex.exec(e.stack.split("\n")[2]);
            this.debug.functionName = match[1].split('\\').pop();
            this.debug.lineNumber = match[2];
            this._log(message, WARNING);
        }
    }

    /**
     * dev
     * @description Used to log development messages: level 4
     * @param {String | Object} message data to log to channel(s)
     * @example
     * logger.dev('Variable X content: ${x}');
     * logger.dev({
     *      issue: 'variable not 789',
     *      msg: 'Variable X content: ${x}'
     * });
     */
    dev(message) {
        this.debug = {
            functionName: null,
            lineNumber: null
        };

        if (this.level === DEV) {
            const e = new Error();
            const match = regex.exec(e.stack.split("\n")[2]);
            this.debug.functionName = match[1].split('\\').pop();
            this.debug.lineNumber = match[2];
            this._log(message, DEV);
        }
    }

    /**
     * info
     * @description Used to log info: level 3
     * @param {String | Object} message data to log to channel(s)
     * @example
     * logger.info('Function XYZ has been called');
     * logger.info({
     *      issue: 'Function XYZ called with {test1}',
     *      msg: 'Function call successful'
     * });
     */
    info(message) {
        this.debug = {
            functionName: null,
            lineNumber: null
        };

        if (this.level >= INFO) {
            const e = new Error();
            const match = regex.exec(e.stack.split("\n")[2]);
            this.debug.functionName = match[1].split('\\').pop();
            this.debug.lineNumber = match[2];
            this._log(message, INFO);
        }
    }

    _function(data, func, options = null) { //remove from class?
        try {
            func(data, options);
        } catch (err) {
            console.log(err);
            this._console(err, ERROR, true)
        }
    }

}


module.exports = Logger;

    /**
     * @description
     * Configuration for a single logging channel.
     * @typedef {Object} loggerMethodConfig configuration for a logging channel
     * @property {String} type Either "console" or "function"
     * @property {Boolean} [colors=false] (Console Channel Only) Add styling to console output
     * @property {String} [name] Name of the configuration if using multiple logging channels
     * @property {Boolean} [showDate=false] Display the date on output
     * @property {Integer} level Only use this logging method up to this custom level
     * @property {Integer} [onlyLevel] Log only at that level on this method of logging. overrides level property
     * @property {isDebug} [isDebug] set the debug configuration
     * @property {Function} func (Custom Channel Only) Function to be invoked if using a custom plugin. ie: log to database
     * @property {Boolean} [isRaw=true] (Custom Channel Only) If true then an object will be returned. if false then the object will be stringified
     * @property {Array} [displayFields=null] Fields that should be logged. Only fields specified in the displayFields array will be logged. if empty all fields are logged.
     * 
     * @example
     *  {
     *      type: 'console',
     *      name: 'Console 1',
     *      colors: true,
     *      showDate: true,
     *      isDebug: {
     *         on: true,
     *         onlyLevel: 2
     *      }
     *  }
     * 
     * @example
     * {    // Custom logging channel
     *      type: 'function',
     *      level: 3,
     *      func: customFunction        // customFunction = plugin
     *      isRaw: true,
     *      displayFields: ['which', 'date', 'location', 'name', 'debug', 'data'],
     *      isDebug: {
     *         on: true,
     *         onlyLevel: 2
     *      }
     * }
     */

    /**
     * @description 
     * Property object used with the loggerMethodConfig
     * @typedef isDebug debug configuration, displays filename and line number of logging call
     * @property {Boolean} on Turn on debugger
     * @property {Integer} level Must define the level of the logging that will use the debugger
     * @property {Integer} [onlyLevel=null] only display debug information at this level. must be same or lower than logger config level
     * 
     * 
     * @example
     * isDebug {
     *     on: true,
     *     onlyLevel: 1
     * }
     */

    /**
     *  @description
     *  The configuration object for the Logger as a whole
     *  @typedef {Object} loggerConfig Logger configuration object
     *  @property {Array} loggerMethodConfig Type of logger required
     *  @property {Integer} [level=3] the highest level of logging
     * 
     * @example
     *  {
     *      methods: [
     *          consoleConfig,          // Channel 1
     *          {                       // Channel 2
     *              type: 'function',
     *              level: 3,
     *              func: customFunction
     *          }
     *      ],
     *      level: 3        // Log Errors, Warnings and Info
     *  }
     */

     /**
      * @description
      * Debug information that is auto generated by the following functions:
      * @see {@link Logger#error}
      * @see {@link Logger#warning}
      * @see {@link Logger#info}
      * @see {@link Logger#dev}
      * 
      * @typedef debugInfo generated debug information
      * @property {String} functionName The name of the function that made the call
      * @property {String} lineNumber The line number of the function that made the call
      * 
      * @todo
      * FIX: prints the entire path if the project has been put through webpack
      * @todo
      * FIX: only prints the line numbers if running on a Linux system
      */