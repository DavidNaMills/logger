const StringClass = require('../src/Logger/StringClass');

const testMsg = 'this is a StringClass test message';

const tempDateFn = jest.fn().mockImplementation(()=>'2020/15/123 12:20pm');;
const stringClass = new StringClass(tempDateFn);

const msg = {
    '1': 'ERROR',
    '2': 'WARNING',
    '3': 'INFO',
    '4': 'DEV'
}




afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});


describe('StringClass test suite', () => {
    describe('stringClass.buildString test suite', () => {
        const tempObj = { keyA: 'this is keyA', keyB: 123 };
        const displayConfig = ['keyB']
        const displayConfig2 = ['keyB', 'test'];

        it('returns the string. no displayConfig', ()=>{
            const res = stringClass.buildString(testMsg);
            expect(res).toEqual(testMsg);
        });

        it('returns a stringified object. no displayConfig', ()=>{
            const res = stringClass.buildString(tempObj);
            expect(res).toEqual(JSON.stringify(tempObj));
        });
        
        it('returns a stringified object. empty displayConfig', ()=>{
            const res = stringClass.buildString(tempObj, []);
            expect(res).toEqual(JSON.stringify(tempObj));
        });

        it('returns a stringifed object containing only properties included in the displayConfig array', ()=>{
            const res = stringClass.buildString(tempObj, displayConfig);
            expect(res).toEqual(JSON.stringify({keyB: 123}));
        });

        it('returns a stringified object with missing fields replaced with VALUE MISSING', ()=>{
            const res = stringClass.buildString(tempObj, displayConfig2);
            expect(res).toEqual(JSON.stringify({keyB: 123, test: 'VALUE MISSING'}));
        });

        it('returns a stringified array when data is of Array type', ()=>{
            const res = stringClass.buildString([1, 2, 3]);
            expect(res).toEqual(JSON.stringify([1, 2, 3]));
        });
        
        it('returns the string when data is of type nunber', ()=>{
            const res = stringClass.buildString(123);
            expect(res).toEqual('123');
        });
    });

    describe('stringFormatter', ()=>{
        it('returns a string with the type and data string', ()=>{
            const res = stringClass.stringFormatter({}, 1, {}, testMsg);
            expect(res.match(/ERROR/).length).toBe(1);
            expect(res.match(/StringClass/).length).toBe(1);
        });

        // it.skip('appends Error color and bright to the string at beginning and after type', ()=>{
        //     const res = stringClass.stringFormatter({colors: true}, 1, {}, testMsg);
        //     // no idea how to test correctly
        // });

        it('contains the type, name of method (supplied) and string', ()=>{
            const res = stringClass.stringFormatter({name: 'Cola'}, 2, {}, testMsg);
            expect(res.match(/WARNING/).length).toBe(1);
            expect(res.match(/Cola/).length).toBe(1);
        });

        it('adds the type (INFO) and date to the string', ()=>{
            
            const reg = new RegExp('2020/15/123 12:20pm');
            const res = stringClass.stringFormatter({showDate: true}, 3, {}, testMsg);
            expect(res.match(/INFO/).length).toBe(1);
            expect(res.match(reg).length).toBe(1);
        });

        // adds debug if specified
        it('appends debug information to the string', ()=>{
            const debug = {
                functionName: 'test\\test\\test.js',
                lineNumber: '15:56'
            };

            const isDebug = {
                on: true,
                level: 3
            }
            const funcReg = new RegExp('test.js');
            const lineReg = new RegExp(debug.lineNumber);
            const res = stringClass.stringFormatter({isDebug}, 2, debug, testMsg);
            expect(res.match(funcReg).length).toBe(1);
            expect(res.match(lineReg).length).toBe(1);
        });

        it('appends debug info to string ONLY if onlyLevel matches which level', ()=>{
            const debug = {
                functionName: 'test\\test\\warning.js',
                lineNumber: '15:56'
            };

            const isDebug = {
                on: true,
                onlyLevel: 3
            }
            const funcReg = new RegExp('warning.js');
            const lineReg = new RegExp(debug.lineNumber);
            const res = stringClass.stringFormatter({isDebug}, 3, debug, testMsg);
            expect(res.match(funcReg).length).toBe(1);
            expect(res.match(lineReg).length).toBe(1);
        });
        
        it('does NOT append debug info when onlyLevel does not match which level', ()=>{
            const debug = {
                functionName: 'test\\test\\warning.js',
                lineNumber: '15:56'
            };

            const isDebug = {
                on: true,
                onlyLevel: 2
            }
            const funcReg = new RegExp('warning.js');
            const lineReg = new RegExp(debug.lineNumber);
            const res = stringClass.stringFormatter({isDebug}, 3, debug, testMsg);
            expect(res.match(funcReg)).toBeNull();
            expect(res.match(lineReg)).toBeNull();
        });

        it('does NOT append debug info when debug level is less than which level', ()=>{
            const debug = {
                functionName: 'test\\test\\dev.js',
                lineNumber: '15:56'
            };

            const isDebug = {
                on: true,
                level: 2
            }
            const funcReg = new RegExp('devjs');
            const lineReg = new RegExp(debug.lineNumber);
            const res = stringClass.stringFormatter({isDebug}, 3, debug, testMsg);
            expect(res.match(funcReg)).toBeNull();
            expect(res.match(lineReg)).toBeNull();
        });


    });

});