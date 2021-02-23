function getWeekStartDate(date) {
  if (!date) date = new Date();
  const currentWeekDay = date.getDay();
  const lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
  return new Date(new Date(date).setDate(date.getDate() - lessDays));
}

function getWeekStartEndDateString(date) {
  const weekStartDate = getWeekStartDate(date);
  const weekEndDate = new Date(
    new Date(weekStartDate).setDate(weekStartDate.getDate() + 6)
  );

  return {
    weekStartDate: formatDate(weekStartDate),
    weekEndDate: formatDate(weekEndDate),
  };
}

//format date：yyyy-MM-dd
function formatDate(date) {
  const myYear = date.getFullYear();
  const myMonth = date.getMonth() + 1;
  const myDay = date.getDate();
  return `${myYear}-${myMonth < 10 ? `0${myMonth}` : myMonth}-${
    myDay < 10 ? `0${myDay}` : myDay
  }`;
}

function parseDate(dateString) {
  return new Date(dateString);
}

module.exports = { getWeekStartEndDateString, formatDate, parseDate };
