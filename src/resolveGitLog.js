const LOG_RE = new RegExp(`\\[\\[(.*?)\\|(.*?)\\|(.*?)\\]\\]`, 'g');

function filterResolveLogsToRecords(logs, filterUsers) {
  const allRecord = [];
  if (logs && filterUsers && filterUsers.length) {
    let match, lastTime;
    while ((match = LOG_RE.exec(logs))) {
      const user = match[1].trim();
      const time = match[2].trim();
      const desc = match[3].trim();
      if (filterUsers.indexOf(user) > -1) {
        allRecord.push({
          user,
          time,
          lastTime,
          desc,
        });
        lastTime = time;
      }
    }
  }
  return allRecord;
}

module.exports = {
  filterResolveLogsToRecords,
};
