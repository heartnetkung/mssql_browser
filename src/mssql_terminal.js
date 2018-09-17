#!/usr/bin/env node

const program = require('commander');
const fs = require('fs');
const { version } = require('../package.json');
const logic = require('./logic');


const boilerPlate = function(handler) {
	return function() {
		var args = Array.prototype.slice.call(arguments, 0);
		try {
			args[0] = JSON.parse(fs.readFileSync(args[0], 'utf8'));
			handler.apply(null, args)
				.then(ans => console.log(ans))
				.catch(err => {
					console.error(err);
					process.exit(1);
				});
		} catch (e) {
			console.error(e);
			process.exit(1);
		}
	};
};


//setup
program.version(version);

//columns [--table]
program
	.command('columns <config_path> [table_name]')
	.description('print all columns from all tables or a given table')
	.action(boilerPlate(logic.printColumns));

//tables
program
	.command('tables <config_path>')
	.description('print all table names')
	.action(boilerPlate(logic.printTables));

//rows {table} [--max] [where...]
program
	.command('rows <config_path> <table_name> [where...]')
	.option('--nrow <n>', 'number of rows to print (default to 3)')
	.description(
		'print top rows of a given table, optionally filter with "WHERE arg1=arg2 AND arg3=arg4 AND..."'
	)
	.action(boilerPlate(async(config, table, where, options) => {
		return await logic.printRows(config, table, options.nrow, where);
	}));

//exec {SQL}
program
	.command('exec <config_path> <sql>')
	.option('--all',
		'print the result along with full transactional output from the database')
	.description('execute given SQL and return the result')
	.action(boilerPlate(async(config, sql, options) => {
		return await logic.execute(config, sql, options.all);
	}));

//display help
program.on('command:*', () => program.outputHelp());

program.parse(process.argv);