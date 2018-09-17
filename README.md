## mssql_browser

### Description
Quickly browse mssql database through terminal. Cross-platform.

### Installation
```
npm install -g heartnetkung/mssql_browser
```

### Usage
```
Usage: mssql_browser [options] [command]

Options:

  -V, --version                                         output the version number
  -h, --help                                            output usage information

Commands:

  tables <config_path>                                  print all table names
  columns <config_path> [table_names...]                print all columns from all tables or given tables
  rows [options] <config_path> <table_name> [where...]  print top rows of a given table, optionally filter with "WHERE arg1=arg2 AND arg3=arg4 AND..."
                                                        --nrow <n>  number of rows to print (default to 3)
  exec [options] <config_path> <sql>                    execute given SQL and return the result
                                                        --all       print the result along with full transactional output from the database
```
`config_path` is a path to a json file describing mssql connection. The detail can be found [here.](https://github.com/tediousjs/node-mssql#config)
