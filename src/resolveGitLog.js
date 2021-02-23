const LOG_RE = new RegExp(`\\[\\[(.*?)\\|(.*?)\\|(.*?)\\]\\]`, 'g');
const DESC_RE = new RegExp(`^(.*?)\\/(.*?)\\/(.*?)$`);

function filterResolveLogsToRecords(logs, filterUsers) {
  const allRecord = [];
  if (logs && filterUsers && filterUsers.length) {
    let match, lastTime;
    while ((match = LOG_RE.exec(logs))) {
      const user = match[1].trim();
      const time = match[2].trim();
      const desc = match[3].trim();
      let task = desc;
      let description = desc;
      let effect = desc;
      if (DESC_RE.test(desc)) {
        const match = DESC_RE.exec(desc);
        task = match[1];
        description = match[2];
        effect = match[3];
      }
      if (filterUsers.indexOf(user) > -1) {
        allRecord.push({
          user,
          time,
          lastTime,
          task,
          description,
          effect,
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
