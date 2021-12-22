/// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />

(function () {
    $('#forgotPassword').click(function () {
        $('#returnMessage').val('');
        var user = utils.localStorage().get('user');
        var ajaxObj = {
            url: utils.Urls.ForgotPassword,
            type: 'POST',
            obj: { EMail: $('#emailId').val(), Phone: user.userName }

        };
        if (ajaxObj.obj.EMail.length <= 0) {
            $('#returnMessage').append('E-Mail cannot be blank');
            $('#returnMessage').show();
            return false;
        }
        else if (utils.validate.email(ajaxObj.obj.EMail) == false) {
            $('#returnMessage').append('E-Mail entered is not Valid');
            $('#returnMessage').show();
            return false;
        }
        else if (user == null) {
            $('#returnMessage').append('User Details could not be located,<br/> contact administrator');
            $('#returnMessage').show();

        }
        else {
            
            $('#returnMessage').hide();
            utils.ajaxCall(ajaxObj.url, ajaxObj.type, ajaxObj.obj, callBack);
        }
        });
    var callBack = function (data) {
        if (data.status == true) {
            window.location.href = 'sentmsg.html';
        }
        else {
            $('#returnMessage').append(data.errorMsg);
            $('#returnMessage').show();
        }
        
    };
      
})();