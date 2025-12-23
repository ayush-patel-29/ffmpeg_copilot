const { spawn } = require("child_process");

const executeFFmpeg = ({ exe, args, onLog }) => {
  return new Promise((resolve, reject) => {
    const child = spawn(exe, args);
    let output = '';
    let errorOutput = '';

    child.stdout?.on('data', (data) => {
      const str = data.toString();
      output += str;
      if (onLog) onLog(str);
    });

    child.stderr?.on('data', (data) => {
      const str = data.toString();
      errorOutput += str;
      if (onLog) onLog(str);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ ok: true, output });
      } else {
        reject({ ok: false, error: errorOutput, code });
      }
    });

    child.on('error', (err) => {
      reject({ ok: false, error: err.message });
    });
  });
};

module.exports = { executeFFmpeg };
