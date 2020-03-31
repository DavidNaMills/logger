const dataFactory = require('../src/Logger/DataFactory');



describe('dataFactory test suite', () => {
        const testData = {
            which: 'ERROR',
            date: '20/20/20  10:10 am',
            location: 'Home Office',
            debug: {
                lineNumber: '20:20',
                functionName: 'superTest'
            },
        }

        const results = {
            which: 'ERROR',
            date: '20/20/20  10:10 am',
            location: 'Home Office',
            lineNumber: '20:20',
            functionName: 'superTest'
        };

        it('builds the object with all fields present', () => {

            const res = dataFactory(testData);
            expect(res).toEqual(results);
        });

        it('flattens the data if data type is Object', () => {
            const tempData = {
                key1: 'hello',
                key2: 'goodbye'
            };
            const res = dataFactory({ ...testData, data: tempData });
            expect(res).toHaveProperty('key1', 'hello');
            expect(res).toHaveProperty('key2', 'goodbye');
        });

        it('assigns the data key if data is a string', () => {
            const dataStr = 'this is a data string';
            const res = dataFactory({ ...testData, data: dataStr });
            expect(res).toEqual({ ...results, data: dataStr });
        });

        it('assigns the data key if data is of type Array', () => {
            const dataStr = [1, 2, 3, 4, 5];
            const res = dataFactory({ ...testData, data: dataStr });
            expect(res).toEqual({ ...results, data: dataStr });
        });

        it('should stringify the results if specified in the config', () => {
            const dataStr = [1, 2, 3, 4, 5];
            const config = { isRaw: false };

            const res = dataFactory({ ...testData, data: dataStr }, config);
            expect(res).toEqual(JSON.stringify({ ...results, data: dataStr }));
        });

        it('should revert to defaultConfig fields if none are present in user config', ()=>{
            const config = { isRaw: false };

            const res = dataFactory({ ...testData }, config);
            expect(res).toEqual(JSON.stringify({ 
                which: 'ERROR',
                date: '20/20/20  10:10 am',
                location: 'Home Office',
                lineNumber: '20:20',
                functionName: 'superTest' 
            }));
        });
        
        it('returns an object with specified fields', ()=>{
            const config = { displayFields: ['which', 'date']};
    
            const res = dataFactory({ ...testData }, config);
            expect(res).toEqual({ which: testData.which, date: testData.date });
        });
        
        it('returns stringifies the results using specified fields', ()=>{
            const config = { isRaw: false, displayFields: ['date', 'which']};
    
            const res = dataFactory({ ...testData }, config);
            expect(res).toEqual(JSON.stringify({date: testData.date, which: testData.which }));
        });

        it('doesnt add the property if the value is not present in dataToAdd object', ()=>{
            const config = { displayFields: ['which', 'date', 'vitamins', 'IP']};
    
            const res = dataFactory({ ...testData }, config);
            expect(res).toEqual({date: testData.date, which: testData.which });
        });

});