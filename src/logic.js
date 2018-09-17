const { sqlBoilerPlate } = require('./db');
const _ = require('lodash');


exports.printColumns = async(config, table) => {
	const sortKeys = (a) => {
		var ans = {};
		for (var x of _.keys(a).sort())
			ans[x] = a[x];
		return ans;
	};

	return await sqlBoilerPlate(config, async(pool) => {
		const SQL =
			`
			SELECT	TABLE_NAME, DATA_TYPE, COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, CHARACTER_MAXIMUM_LENGTH
			FROM	INFORMATION_SCHEMA.COLUMNS`;

		var req = pool.request();
		var ans = [];
		var result = await req.query(SQL);
		result = sortKeys(_.groupBy(result.recordset, 'TABLE_NAME'));

		for (var x in result) {
			if (table && x !== table)
				continue;

			ans.push(x);
			for (var y of _.sortBy(result[x], 'COLUMN_NAME')) {
				var newLine = [
					'  ',
					y['COLUMN_NAME'],
					' ',
					y['DATA_TYPE']
				];

				if (y['IS_NULLABLE'] === 'YES')
					newLine.push('nullable');
				if (y['COLUMN_DEFAULT'] !== null)
					newLine.push('default:' + y['COLUMN_DEFAULT']);
				if (y['CHARACTER_MAXIMUM_LENGTH'] !== null)
					newLine.push('max:' + y['CHARACTER_MAXIMUM_LENGTH']);

				ans.push(newLine.join(' '));
			}
		}
		return ans.join('\n');
	});
};