import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const formatDate = (date, format) => dayjs(date).format(format);

export function deepClone(obj) {
    if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
        return obj;

    if (obj instanceof Date)
        var temp = new obj.constructor(); //or new Date(obj);
    else
        var temp = obj.constructor();

    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            obj['isActiveClone'] = null;
            temp[key] = deepClone(obj[key]);
            delete obj['isActiveClone'];
        }
    }
    return temp;
}


