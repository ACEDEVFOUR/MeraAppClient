/// <reference path="jquery.js" />


var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
var callBack = function (selectFn, callThis) {
    $.ajax({
        url: 'somefile.txt',
        type: 'GET',
        //data: JSON.stringify(objData),
        cache: false,
        contentType: 'application/json',
        //crossdomain: true,
        async: true,
        success: function (data) {

            callThis(data);
        },
        error: function (error) {

            errorDB(error);
        }
    });
}
var execute = function (sql) {
    db.transaction(function (tx) {
        tx.executeSql(sql);
    }, errorDB);
}
var errorDB = function (error) {
    alert(error);
}
var select = function (sql, callback) {
    setTimeout(function () {
        db.transaction(function (tx) {
            tx.executeSql(sql, [], function (tx, data) {
                //alert(JSON.stringify(data.rows));
                callback(data.rows);
            });
        }, errorDB);
    }, 100);

}
webSQL = {
    createTable: function (tableName, columns) {
        var columnNames = '';
        var query1 = 'DROP TABLE IF EXISTS ' + tableName;
        //tx.executeSql('DROP TABLE IF EXISTS ' + tableName);
        execute(query1);
        $.each(columns, function (i, dat) {
            if (i < columns.length - 1)
                columnNames += dat + ',';
            else
                columnNames += dat;
        });
        var query2 = 'CREATE TABLE IF NOT EXISTS ' + tableName + '(' + columnNames + ')';
        execute(query2);
    },
    insertData: function (tableName, columns, data) {

        var columnNames = '';
        var dataValues = '';
        $.each(columns, function (i, dat) {
            if (i < columns.length - 1)
                columnNames += dat + ',';
            else
                columnNames += dat;
        });
        $.each(data, function (i, dat) {
            if (i < data.length - 1)
                dataValues += '"' + dat + '",';
            else
                dataValues += '"' + dat + '"';
        });

        var query = 'INSERT INTO ' + tableName + '(' + columnNames + ') VALUES (' + dataValues + ')';
        execute(query);
    },
    updateData: function (tableName, columns, data, whereColumn, whereData) {
        var updateString = '';
        var whereString = '';
        $.each(columns, function (i, dat) {
            if (i < columns.length - 1)
                updateString += dat + ' ="' + data[i] + '", '
            else
                updateString += dat + ' ="' + data[i] + '" ';
        });
        $.each(whereColumn, function (i, dat) {
            if (i < columns.length - 1)
                whereString += dat + ' ="' + whereData[i] + '" AND , '
            else
                whereString += dat + ' ="' + whereData[i] + '" ';
        });
        var query = 'UPDATE ' + tableName + ' SET ' + updateString + 'WHERE ' + whereString;
        execute(query);
    },
    deleteData: function (tableName, whereColumn, whereData) {
        var deleteString = '';
        $.each(whereColumn, function (i, data) {
            if (i < whereColumn.length - 1)
                deleteString += data + ' ="' + whereData[i] + '" AND '
            else
                deleteString += data + ' ="' + whereData[i] + '" ';
        });
        var query = 'DELETE FROM ' + tableName + ' WHERE ' + deleteString;
        execute(query);
    },
    deleteWithWhere: function (tableName, whereQuery) {

        var query = 'DELETE FROM ' + tableName + ' WHERE ' + whereQuery;
        execute(query);
    },

    updateWithWhere: function (tableName, columns, data, whereQuery) {
        var updateString = '';
        var whereString = '';
        $.each(columns, function (i, dat) {
            if (i < columns.length - 1)
                updateString += dat + ' ="' + data[i] + '", '
            else
                updateString += dat + ' ="' + data[i] + '" ';
        });
        var query = 'UPDATE ' + tableName + ' SET ' + updateString + 'WHERE ' + whereQuery;
        execute(query);
    },
    selectData: function (tableName, columnName, whereColumn, whereData) {
        var selectString = '';
        var whereString = '';
        $.each(columnName, function (i, dat) {
            if (i < columnName.length - 1)
                selectString += dat + ',';
            else
                selectString += dat;
        });
        $.each(whereColumn, function (i, dat) {
            if (i < columns.length - 1)
                whereString += dat + ' ="' + whereData[i] + '" AND , '
            else
                whereString += dat + ' ="' + whereData[i] + '" ';
        });
        var query = 'SELECT ' + selectString + ' FROM ' + tableName + 'WHERE ' + whereString;
        execute(query);
    }, justSelect: function (tableName, columnName, callBackFn) {
        var selectString = '';

        $.each(columnName, function (i, dat) {
            if (i < columnName.length - 1)
                selectString += dat + ',';
            else
                selectString += dat;
        });
        var query = 'SELECT ' + selectString + ' FROM ' + tableName;

        select(query, callBackFn);


    }
}