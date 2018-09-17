const sql = require('mssql');


exports.sqlBoilerPlate = async(config, handler) => {
	var pool = null;
	var ans = null;
	try {
		pool = await sql.connect(config);
		ans = await handler(pool.request());
		pool.close();
	} catch (e) {
		if (pool)
			pool.close();
		throw e;
	}
	return ans;
};