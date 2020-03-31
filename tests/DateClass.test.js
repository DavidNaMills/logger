const DateClass = require('../src/Logger/DateClass');

const myDate = new DateClass();
const testMsg = 'this is a dateClass test message';
const testDate = '20\\20\\20 10:10 am';

afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
});


describe('DateClass test suite', () => {
    describe('_setDate test suite', () => {
        // it('appends the data with the date string', () => {
        //     const createDateSpy = jest.spyOn(myDate, 'createDateString').mockImplementation(() => testDate);
        //     const res = myDate.setDate(testMsg);

        //     expect(createDateSpy).toHaveBeenCalledTimes(1);
        //     expect(res).toEqual(`${testDate}:  ${testMsg}`);
        // });

        // it('appends the data object with the date string', () => {
        //     const createDateSpy = jest.spyOn(myDate, 'createDateString').mockImplementation(() => testDate);
        //     const tempObj = { keyA: 'this is keyA', keyB: 123 };

        //     const res = myDate.setDate(tempObj);
        //     expect(createDateSpy).toHaveBeenCalledTimes(1);
        //     expect(typeof (res)).toBe('object');
        //     expect(Object.keys(res).length).toBe(3);
        //     expect(res).toEqual({ date: testDate, ...tempObj });
        //     jest.restoreAllMocks();
        // });

        describe('_createDateString test suite', () => {
            it('should return a formatted date and time string', () => {
                const t = new Date().toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric'
                });

                const res = myDate.createDateString();
                expect(res).toEqual(t);
            });
        });
    });
});