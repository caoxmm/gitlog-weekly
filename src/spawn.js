const spawn = async (...args) => {
  const { spawn } = require('child_process');
  return new Promise((resolve) => {
    const proc = spawn(...args);
    let std = '';
    proc.stdout.on('data', function (data) {
      std += data.toString();
    });
    proc.stderr.pipe(process.stderr);
    proc.on('close', () => {
      resolve(std);
    });
  });
};
module.exports = { spawn };
