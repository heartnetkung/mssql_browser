const { printColumns, printTables, execute, printRows } = require(
	'../src/logic');
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


test.skip('printTables(config)', async() => {
	var ans = await printTables(config);
	console.log(ans);
});


test.skip('execute(config, sql, true)', async() => {
	var ans = await execute(config, 'SELECT TOP 2 * FROM DT_Branch', true);
	console.log(ans);
});


test.skip('printRows(config, table, max, wheres)', async() => {
	var ans = await printRows(config, 'DT_Branch', 2, ['City', "'เชียงใหม่'"]);
	console.log(ans);
});


test.skip('printRows(config, table, null, [])', async() => {
	var ans = await printRows(config, 'DT_Branch', null, []);
	console.log(ans);
});