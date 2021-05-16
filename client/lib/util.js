import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

export const roundDate = (date) => date.hour(0).minute(0).second(0).millisecond(0);
export const formatDate = (date, format) => dayjs(date).format(format);

export const formatMultilineText = (text) => {
  return text.split('\n').map(function(item, key) {
    return (
      <span key={key}>
        {item}
        <br/>
      </span>
    )
  })
}

export function formatAge(birthdayString){
  var now = dayjs();
  const birthday = dayjs(birthdayString);

  const yearsOld = now.diff(birthday, "year");
  now = now.subtract(yearsOld, "year")

  const monthsOld = now.diff(birthday, "month");
  now = now.subtract(monthsOld, "month")

  const daysOld = now.diff(birthday, "day");

  const yearString = yearsOld > 0 ?`${yearsOld} ${yearsOld > 1 ? " years," : " year"}` : "";
  const monthString = monthsOld > 0 ?`${monthsOld} ${monthsOld > 1 ? " months," : " month"}` : "";
  const dayString = daysOld > 0 ?`${daysOld} ${daysOld > 1 ? " days" : " day,"}` : "";
  return `${yearString} ${monthString} ${dayString} old`
}

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

export function capitalize(s){
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
