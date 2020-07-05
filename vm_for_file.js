'use strict';
const vm = require('vm');
const fs = require('fs');


module.exports = (nameFile, callback) =>{
    function testQuery(callback) {
        return new Promise((resolve => {
            setTimeout(function () {
                    callback(100500);
                    resolve(100500);
                }, 2000
            );
        }));
    }

    function testResult(result) {
        callback(result);
    }


    // Read file
    new Promise(resolve => {
        fs.readFile(nameFile, 'utf8', (err, fileContent) => {
            if (err) throw err;

            // Add await to call a function "testQuery"
            fileContent = fileContent.replace(/testQuery/g, 'await testQuery');

            // Add async wrapper
            fileContent = `
                async function wrapFunction(){
                      ${fileContent}
                 };
                 
                 wrapFunction();
            `;

            resolve(fileContent);
        });
    })
        .then(fileCode => {
            try{
                const sandbox = new vm.createContext({
                    testQuery: () => testQuery(callback),
                    testResult: testResult,
                    console
                });

                const script = new vm.Script(fileCode);

                script.runInContext(sandbox);

            }catch(errorVM){
                console.log(errorVM);
            }
        })
        .catch(err => console.log(err));
};