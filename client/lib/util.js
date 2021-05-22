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

// https://stackoverflow.com/a/7261048
export function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});


}
