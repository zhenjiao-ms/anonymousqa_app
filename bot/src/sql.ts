import * as tedious from "tedious";

//require('dotenv').config();

export function getSQLConnection(): Promise<tedious.Connection> {
    let config;
    console.log(`Start to connect to database ${process.env.AZURE_SQL_SERVER}/${process.env.AZURE_SQL_DATABASE}, with username = ${process.env.AZURE_SQL_USERNAME}`);
    if(process.env.AZURE_SQL_USERNAME != undefined){
        config = {
            server: process.env.AZURE_SQL_SERVER,
            authentication: {
              type: 'default',
              options: {
                userName: process.env.AZURE_SQL_USERNAME,
                password: process.env.AZURE_SQL_PASSWORD
              }
            },
            options: {
              database: process.env.AZURE_SQL_DATABASE,
              port: parseInt(process.env.AZURE_SQL_PORT)
            }
          };
    }else{
        config = {
            server: process.env.AZURE_SQL_SERVER,
            authentication: {
                type:'azure-active-directory-msi-app-service',
                options: {
                    clientId: 'f1d92991-0647-41f0-851f-3e5c83ba310c',
                    msiEndpoint: process.env.IDENTITY_ENDPOINT,
                    msiSecret: ''
                }
              },
              options: {
                database: process.env.AZURE_SQL_DATABASE,
                port: parseInt(process.env.AZURE_SQL_PORT)
              }
                };
    }
    const connection = new tedious.Connection(config);
    return new Promise((resolve, reject) => {
        connection.on('connect', err => {
            if (err) {
                if (err.errors == undefined || err.errors.length == 0){
                    console.log('Error: ', err);
                }else{
                    err.errors.map(error=>console.log('\nError: ', error))
                }
                reject(err);
            }
            resolve(connection);
        });
        connection.on('debug', function (err) {
            console.log('debug:', err);
        });
        console.log(`Connecting to database ${config.options.database}`);
        connection.connect();
    });
}

export async function executeQuery(query, connection): Promise<any[]> {
    console.log(`Start to run query '${query}'`);
    return new Promise((resolve, reject) => {
        var res = [];
        const request = new tedious.Request(query, (err) => {
            if (err) {
                console.log(err);
                reject(err)
            }
        });
        request.on("row", function(columns) {
            var row = {};
            columns.forEach((column) => {
                row[column.metadata.colName] = column.value;
            });
            res.push(row);
        });
        request.on("requestCompleted", () => {
            resolve(res);
        });
        request.on("error", (error: any) => {
            console.log(error);
            reject(error);
        });
        connection.execSql(request);
    });
}

