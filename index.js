const { getWeekStartEndDateString } = require('./src/date');
const { Command } = require('commander');
const { spawn } = require('./src/spawn');
const chalk = require('chalk');
const program = new Command();
program.version('0.0.1');

const { weekStartDate, weekEndDate } = getWeekStartEndDateString();
program
  .requiredOption('-u, --users [users...]', 'filter by usernames')
  .requiredOption('-p, --path <path>', 'git repository in local system path')
  .requiredOption('-d, --dist <dist>', 'the directory output weekly excel')
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
const { from, to, users, path, dist } = options;
console.log('checking git log ...🚀');
// console.log(options);
console.log(chalk.yellow(`between (${from},${to}), user [${users.join(',')}]`));

(async function () {
  await spawn('git', ['log'], { cwd: path });
})();