$(function () {
    function queryCMS(tx) {
        
    }

    var queryCMS = function (tx) {
        var user = utils.localStorage().get('user');
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        var queryText = "SELECT ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId FROM CMS  WHERE LanguageId =" + LangId;
        console.log(queryText);
        tx.executeSql(queryText, [], queryCMSSuccess, errorCB);
    }
    var queryCMSSuccess = function (tx, data) {
        debugger;
        $.each(data.rows, function (i, dat) {
            debugger;
            var keyId = dat.KeyName;
            $('#' + keyId + '\'').html(dat.KeyValue);

        });
    }
    var errorCB = function (err) {
        console.log(err.message);
    }
})