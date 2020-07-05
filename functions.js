module.exports.upperFirst = string => string.charAt(0).toUpperCase() + string.slice(1);

module.exports.timeConversion = millisec => {
    const seconds = (millisec / 1000).toFixed(1);
    const minutes = (millisec / (1000 * 60)).toFixed(1);
    const hours = (millisec / (1000 * 60 * 60)).toFixed(1);
    const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) return parseInt(seconds) + ' second(s)';
    else if (minutes < 60) return parseInt(minutes) + ' minute(s)';
    else if (hours < 24) return parseInt(hours) + ' hour(s)';
    else return parseInt(days) + ' day(s)'
};