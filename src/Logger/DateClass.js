
/**
 * DateClass
 * @private
 * @classdesc
 * Class to create and format a date string
 */

class DateClass {
    constructor(){}

    /**
     * createDateString
     * @description
     * creates a date string based on the locale "en-GB"
     * @returns String a date string in the format of mm/dd/YYYY, hh-mm-s AM|PM (3/31/2020, 2:09:59 PM)
     */
    createDateString(){
        return new Date().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        });
    }
}

module.exports = DateClass;