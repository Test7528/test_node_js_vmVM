const vm = require('./vm_for_file');
vm('test.js', (result) => { console.log(result); });