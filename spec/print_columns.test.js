const { printColumns } = require('../src/logic');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname,
	'../test_config.json'), 'utf8'));


test.skip('printColumns(config)', async() => {
	var ans = await printColumns(config);
	console.log(ans);
});


test.skip('printColumns(config, table)', async() => {
	var ans = await printColumns(config, 'x_MemberUse');
	console.log(ans);
});