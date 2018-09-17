const { sqlBoilerPlate } = require('./db');
const _ = require('lodash');


exports.printColumns = async(config, table) => {
	const sortKeys = (a) => {
		var ans = {};
		for (var x of _.keys(a).sort())
			ans[x] = a[x];
		return ans;
	};

	return await sqlBoilerPlate(config, async(req) => {
		const SQL =
			`
			SELECT	TABLE_NAME, DATA_TYPE, COLUMN_NAME, IS_NULLABLE, COLUMN_DEFAULT, CHARACTER_MAXIMUM_LENGTH
			FROM	INFORMATION_SCHEMA.COLUMNS`;

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
					y['DATA_TYPE']+(y['CHARACTER_MAXIMUM_LENGTH']?`(${y['CHARACTER_MAXIMUM_LENGTH']})`:'')
				];

				if (y['IS_NULLABLE'] === 'YES')
					newLine.push('nullable');
				if (y['COLUMN_DEFAULT'] !== null)
					newLine.push('default:' + y['COLUMN_DEFAULT']);

				ans.push(newLine.join(' '));
			}
		}
		return ans.join('\n');
	});
};


exports.printTables = async(config) => {
	return await sqlBoilerPlate(config, async(req) => {
		const SQL =
			`
			SELECT	TABLE_NAME
			FROM	INFORMATION_SCHEMA.TABLES
			WHERE	TABLE_TYPE='BASE TABLE'`;

		var ans = await req.query(SQL);
		ans = ans.recordset.map((a) => a['TABLE_NAME']);
		return ans.join('\n');
	});
};


exports.execute = async(config, sql, isSelect) => {
	return await sqlBoilerPlate(config, async(req) => {
		var ans = await req.query(sql);
		if (isSelect)
			ans = ans.recordset;
		return JSON.stringify(ans, null, 2);
	});
};


exports.printRows = async(config, table, max, wheres) => {
	if (wheres.length % 2 !== 0)
		throw new Error('wheres must have even number of parameters');

	var sql = `
		SELECT	TOP ${max||3} *
		FROM	${table}
	`;
	var whereLine = [];
	for (var i = 0, ii = wheres.length; i < ii; i += 2)
		whereLine.push(`"${wheres[i]}"=${wheres[i+1]}`);

	if (whereLine.length)
		sql += 'WHERE ' + whereLine.join(' AND ');
	return await exports.execute(config, sql, true);
};