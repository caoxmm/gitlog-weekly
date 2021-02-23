#!/usr/bin/env node
const Excel = require('exceljs');
const { getWeekStartEndDateString, parseDateToMd } = require('./src/date');
const { Command } = require('commander');
const { prompt } = require('enquirer');
const { spawn } = require('./src/spawn');
const { filterResolveLogsToRecords } = require('./src/resolveGitLog');
const sysPath = require('path');
const getDirName = sysPath.dirname;
const mkdirp = require('mkdirp');
const chalk = require('chalk');

const program = new Command();
program.version('0.0.1');

const { weekStartDate, weekEndDate } = getWeekStartEndDateString();
program
  .option('-u, --users [users...]', 'filter by usernames')
  .option('-p, --path <path>', 'git repository in local system path')
  .option('-d, --dist <dist>', 'the directory output weekly excel')
  .option('-ucn, --username <userName>', 'reporter user name chinese version')
  .option(
    '-from, --from <startDate>',
    'filter commits after start date, yyyy-mm-dd',
    weekStartDate
  )
  .option(
    '-to, --to <endDate>',
    'filter commits before end date, yyyy-mm-dd',
    weekEndDate
  );

program.parse(process.argv);

const options = program.opts();
(async function () {
  let { from, to, users, path, dist, username } = options;
  ({ username, users, path, dist } = await checkInput(
    username,
    users,
    path,
    dist
  ));
  console.log('start generate 🚀🚀🚀');
  console.log(
    chalk.blue(`
   user chinese name: ${username}
       git base path: ${path}
    commit usernames: ${users.join(',')}
     git log between: ${from} - ${to}
      dist directory: ${dist}
`)
  );

  // read git log
  const logs = await spawn(
    'git',
    [
      'log',
      '--pretty=[[%an|%ad|%s]]',
      '--date=iso-local',
      `--since=${from}T00:00:00`,
      `--until=${to}T24:00:00`,
      '--no-merges',
      '--reverse',
    ],
    { cwd: path }
  );
  // filter data
  const result = resolveLogs(users, logs);
  if (!result || !result.length) {
    console.log(chalk.red('no commits in this week.'));
    return;
  }
  console.log(chalk.yellow('get commit log success 🐶'));
  const distXlsxPath = await generateXlsx(username, result, dist);
  console.log(chalk.green(`weekly xlsx generate at ${distXlsxPath}`));
})();

async function checkInput(username, users, path, dist) {
  if (!username) {
    const response = await prompt({
      type: 'input',
      name: 'username',
      message: 'reporter chinese name?',
    });
    username = response.username;
  }
  if (!path) {
    const response = await prompt({
      type: 'input',
      name: 'path',
      message: 'where is our git repository path? (in filesystem)',
    });
    path = response.path;
  }
  if (!users || !users.length) {
    const response = await prompt({
      type: 'input',
      name: 'users',
      message: 'reporter git commit usernames? (use space to split)',
    });
    users = response.users.split(' ');
  }
  if (!dist) {
    const response = await prompt({
      type: 'input',
      name: 'dist',
      message: 'where to put our generated xlsx?',
    });
    dist = response.dist;
  }
  return { username, users, path, dist };
}

async function generateXlsx(username, result, dist) {
  const templatePath = `.${sysPath.sep}template${sysPath.sep}weekly.xlsx`;
  const workbook = new Excel.Workbook();
  await workbook.xlsx.readFile(sysPath.resolve(__dirname, templatePath));
  var worksheet = workbook.getWorksheet(1);
  var row2 = worksheet.getRow(2);
  row2.getCell(1).value = `填报人：${username}`;

  let rowIndex = 4;
  for (let i = 0; i < result.length; i++) {
    const res = result[i];
    const row = worksheet.getRow(rowIndex);
    row.getCell(1).value = i + 1;
    row.getCell(2).value = res.task;
    row.getCell(3).value = res.description;
    row.getCell(4).value = '已完成';
    row.getCell(5).value = res.cost;
    row.getCell(6).value = res.effect;
    row.commit();
    rowIndex++;
    if (rowIndex > 9) {
      worksheet.duplicateRow(rowIndex, 1, rowIndex);
    }
  }

  const sheetName = `${parseDateToMd(weekStartDate)}-${parseDateToMd(
    weekEndDate
  )}`;

  const distXlsxPath = `${dist}${sysPath.sep}周报任务进度${sheetName}.xlsx`;
  const dir = getDirName(distXlsxPath);
  mkdirp.sync(dir);
  await workbook.xlsx.writeFile(distXlsxPath);
  return distXlsxPath;
}

function resolveLogs(users, logs) {
  const records = filterResolveLogsToRecords(logs, users);
  const result = records.map((record) => {
    const r = { ...record };
    let costTime = 0;
    const recordTime = new Date(record.time).getTime();
    if (!record.lastTime) {
      const weekStartTime = new Date(weekStartDate).getTime();
      costTime = recordTime - weekStartTime;
    } else {
      const lastRecordTime = new Date(record.lastTime).getTime();
      costTime = recordTime - lastRecordTime;
    }
    r.cost = (costTime / 86400000).toFixed(2);
    return r;
  });
  return result;
}
