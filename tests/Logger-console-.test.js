
jest.mock('../src/Logger/DateClass', () => ({
    createDateString: jest.fn(() => '20\\20\\20 10:10 am'),
    setDate: jest.fn(() => '20\\20\\20 10:10 am'),
}));

const DateClass = require('../src/Logger/DateClass');

jest.mock('../src/Logger/StringClass', () => ({
    stringFormatter: jest.fn(),
    buildString: jest.fn(),
    createDate: jest.fn(() => '20\\20\\20 10:10 am'),
}));
const StringClass = require('../src/Logger/StringClass');

const mockCompiledData = jest.fn(() => 'some data');

const theLogger = require('../src/Logger/LoggerInstance');
const Logger = new theLogger(DateClass, StringClass, mockCompiledData);


const ERROR = 1;
const WARNING = 2;
const INFO = 3;
const DEV = 4;

const testMsg = 'this is my test message';

const consoleConfig = {
    type: 'console',
    name: 'Console 1',
    colors: true,
    // onlyLevel: 1,
    showDate: true,
    isDebug: {
        on: true,
        level: 3,
    },
    displaySchema: []
}

const invalidConfig = {
    type: 'this is invalid',
    name: 'Console 1',
    colors: true,
    showDate: true,
    isDebug: {
        on: true,
        level: 3,
    },
    displaySchema: []
}

const consoleConfigOnlyLevel = {
    type: 'console',
    onlyLevel: 1,
    isDebug: {
        on: true,
        level: 3,
    },
    displaySchema: []
}

const functionConfig = {
    type: 'function',
    levelOnly: 1
}


const _logSpy = jest.spyOn(Logger, '_log');
const _consoleSpy = jest.spyOn(Logger, '_console');
const _functionSpy = jest.spyOn(Logger, '_function');

const consoleErrorMock = jest.spyOn(console, 'error');
// const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation();
const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();
const consoleInfoMock = jest.spyOn(console, 'info').mockImplementation();
const consoleDevMock = jest.spyOn(console, 'log').mockImplementation();




afterEach(() => {
    jest.clearAllMocks()
});



describe('Logger test suite', () => {
    describe('setup tests', () => {
        it('should set the configuration options and logging level', () => {
            Logger.configLogger({
                methods: [consoleConfig],
                level: 4
            }, 'Kitchen Table');

            expect(Logger.level).toBe(4);
            expect(Logger.config.length).toBe(1);
            expect(Logger.config[0]).toEqual(consoleConfig);
            expect(Logger.location).toEqual('Kitchen Table');
        });
    });

    describe('log to console tests', () => {
        it('debug is null', () => {
            expect(Logger.debug).toEqual({
                functionName: null,
                lineNumber: null
            })
        });

        it('calls _log and sets debug from Logger.ERROR', () => {
            Logger.error(testMsg);
            expect(_logSpy).toHaveBeenCalledTimes(1);
            expect(_logSpy).toHaveBeenCalledWith(testMsg, ERROR);
            expect(Logger.debug).toEqual({
                functionName: 'Logger-console-.test.js',
                lineNumber: '113'
            });
        });

        it('calls _log and sets debug from Logger.WARNING', () => {
            Logger.warning(testMsg);
            expect(_logSpy).toHaveBeenCalledTimes(1);
            expect(_logSpy).toHaveBeenCalledWith(testMsg, WARNING);
            expect(Logger.debug).toEqual({
                functionName: 'Logger-console-.test.js',
                lineNumber: '123'
            });
        });

        it('calls _log and sets debug from Logger.DEV', () => {
            Logger.dev(testMsg);
            expect(_logSpy).toHaveBeenCalledTimes(1);
            expect(_logSpy).toHaveBeenCalledWith(testMsg, DEV);
            expect(Logger.debug).toEqual({
                functionName: 'Logger-console-.test.js',
                lineNumber: '133'
            });
        });

        it('calls _log and sets debug from Logger.INFO', () => {
            Logger.info(testMsg);
            expect(_logSpy).toHaveBeenCalledTimes(1);
            expect(_logSpy).toHaveBeenCalledWith(testMsg, INFO);
            expect(Logger.debug).toEqual({
                functionName: 'Logger-console-.test.js',
                lineNumber: '143'
            });
        });

        it('should NOT call _log from Logger.DEV if using default level (3) ', () => {
            Logger.configLogger({
                methods: [consoleConfig]
            });

            expect(Logger.level).toBe(3);

            Logger.dev(testMsg);
            expect(_logSpy).not.toHaveBeenCalled();
            expect(Logger.debug).toEqual({
                functionName: null,
                lineNumber: null
            });
        });
        
        it('should NOT call _log from Logger.warning if using level 1 ', () => {
            Logger.configLogger({
                methods: [consoleConfig],
                level: 1
            });

            expect(Logger.level).toBe(1);

            Logger.dev(testMsg);
            expect(_logSpy).not.toHaveBeenCalled();
            expect(Logger.debug).toEqual({
                functionName: null,
                lineNumber: null
            });
        });
    });


    describe('_log test suite', () => {
        it('doesnt call _console if below required level', () => {
            Logger.configLogger({
                methods: [consoleConfig]
            });
            expect(Logger.level).toBe(3);

            Logger._log(testMsg, DEV);
            expect(_consoleSpy).toHaveBeenCalledTimes(0);
        });

        it('calls _console if action is below required level', () => {
            Logger.configLogger({
                methods: [consoleConfig],
                level: INFO
            });
            expect(Logger.level).toBe(3);

            Logger._log(testMsg, INFO);
            expect(_consoleSpy).toHaveBeenCalledTimes(1);
        });

        it('only calls _console if only Level has been set and matches', () => {
            Logger.configLogger({
                methods: [consoleConfigOnlyLevel],
                level: INFO
            });
            expect(Logger.level).toBe(3);

            Logger._log(testMsg, ERROR);
            expect(_consoleSpy).toHaveBeenCalledTimes(1);
        });

        it('doesnt call _console if onlyLevel has been set and does not match', () => {
            Logger.configLogger({
                methods: [consoleConfigOnlyLevel],
                level: INFO
            });
            expect(Logger.level).toBe(3);

            Logger._log(testMsg, WARNING);
            expect(_consoleSpy).toHaveBeenCalledTimes(0);
        });

        it('calls the compiledData and _function if logging method is "function"', () => {
            Logger.configLogger({
                methods: [functionConfig],
                level: ERROR
            });
            expect(Logger.level).toBe(1);
            
            Logger._log(testMsg, ERROR);
            expect(_functionSpy).toHaveBeenCalledTimes(1);
            expect(DateClass.createDateString).toHaveBeenCalledTimes(1);
        });
        
        it('should display an error as the method type is neither "console" or "function"', ()=>{
            Logger.configLogger({
                methods: [invalidConfig],
                level: DEV
            });

            Logger._log(testMsg, ERROR);
            expect(_functionSpy).toHaveBeenCalledTimes(0);
            expect(_consoleSpy).toHaveBeenCalledTimes(0);
            expect(consoleErrorMock).toHaveBeenCalledTimes(1);
            expect(consoleErrorMock).toHaveBeenCalledWith('Invalid channel type: [console, function]');
        });

    });


    describe('_console test suite', () => {

        it('calls _buildString and stringFormatter functions', () => {
            Logger._console(testMsg, ERROR, consoleConfig);
            
            expect(StringClass.buildString).toHaveBeenCalledTimes(1);
            expect(StringClass.stringFormatter).toHaveBeenCalledTimes(1);
        });
        
        it('calls console.ERROR when which=error', () => {
            Logger._console(testMsg, ERROR, consoleConfig);
            expect(consoleErrorMock).toHaveBeenCalledTimes(1);
        });

        it('calls console.WARN when which=warning', () => {
            Logger._console(testMsg, WARNING, consoleConfig);
            expect(consoleWarnMock).toHaveBeenCalledTimes(1);
        });

        it('calls console.INFO when which=info', () => {
            Logger._console(testMsg, INFO, consoleConfig);
            expect(consoleInfoMock).toHaveBeenCalledTimes(1);

        });

        it('calls console.DEV when which=dev', () => {
            Logger._console(testMsg, DEV, consoleConfig);
            expect(consoleDevMock).toHaveBeenCalledTimes(1);
        });
     
        it('calls console.DEV when which=dev', () => {
            Logger._console(testMsg, 'BROKEN', consoleConfig);
            expect(consoleErrorMock).toHaveBeenCalledTimes(1);
            expect(consoleErrorMock).toHaveBeenCalledWith('Invalid logging type: [ERROR,WARNING, INFO, DEV]');
        });
    });


    describe('external logging method tests', () => {
        it('should call the func method passed in with config', () => {
            Logger.configLogger({
                methods: [consoleConfig],
                level: 1
            });
            expect(Logger.level).toBe(1);

            const func = jest.fn();
            Logger._function(testMsg, func, null);
            expect(func).toHaveBeenCalledTimes(1);
            expect(func).toHaveBeenCalledWith(testMsg, null);
        });

        it('should catch the error, call _console, and display a console.LOG if there is an error with func', () => {
            Logger.configLogger({
                methods: [consoleConfig],
                level: 1
            });
            expect(Logger.level).toBe(1);

            const func = jest.fn(() => {
                throw 'testError';
            });

            Logger._function(testMsg, func, null);
            expect(_consoleSpy).toHaveBeenCalledTimes(1);
            expect(consoleErrorMock).toHaveBeenCalledTimes(1);
        })
    });
});
