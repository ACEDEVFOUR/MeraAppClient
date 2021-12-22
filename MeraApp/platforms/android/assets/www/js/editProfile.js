/// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />
var mobileReq = 'Please enter either Mobile number or Aadhar number.';
var photoReq = 'Photo is required';
var firstNameReq = 'First Name is required';
var surNameReq = 'Last Name is required';
var relationReq = 'Relationship is required';
var phoneLength = 'Phone Number must be of 10 digits';
var addressReq = 'Address is required';
var motherNameReq = 'Mother name is required';
var fatherNameReq = 'Father or Husband Name is required';
var dobReq = 'Date of Birth required';
var genderReq = 'Gender is required';
var ageRangeReq = 'Age Range required';
var religionReq = 'Religion is required';
var ecoStatusReq = 'Economic Status is required';
var occupationReq = 'Occupation is required';
var qualificationReq = 'Qualification is required';
var maritalStatusReq = 'Marital Status is required';
var categoryReq = 'Category is required';
var empStatusReq = 'Emp Status is required';
var engNameReq = 'English Name required';
var alreadyRegistered = 'Aadhar already registered';
var familySuccess = "Added successfully";
var aadharLength = '';
var loadingProfile = '';
(function () {
    var pictureSource;   // picture source
    var destinationType; // sets the format of returned value
    // Wait for device API libraries to load
    //

    document.addEventListener("deviceready", onDeviceReady, false);
    var onDeviceReady = function () {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
    }
    var AllData = new Array();
    var DistrictID = 0;
    //Load State and City First
    $(function () {
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(queryCMS, errorCB);
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        $('#ModalText').html(loadingProfile);
        //$('#myModal').modal('show');
        LoadStateCity();
        var LangId = utils.localStorage().get('LangID');
        var image = document.getElementById('imgProfilePic');
        if (image != null) {
            switch (LangId) {
                case 1:
                    image.src = 'images/uploadPhoto.png';
                    break;
                case 2:
                    image.src = 'images/uploadPhotoHindi.png';
                    break;
                default:
                    image.src = 'images/uploadPhoto.png';
            }

            utils.imageToBase64(image.src, image);

        }
        $('#RemovePhoto').click(function () {
            var LangId = utils.localStorage().get('LangID');
            var image = document.getElementById('imgProfilePic');
            if (image != null) {
                switch (LangId) {
                    case 1:
                        image.src = 'images/uploadPhoto.png';
                        break;
                    case 2:
                        image.src = 'images/uploadPhotoHindi.png';
                        break;
                    default:
                        image.src = 'images/uploadPhoto.png';
                }

                utils.imageToBase64(image.src, image);
            }
        });
    });
    

    //Populate District on change of State
    $("#State").change(function () {
        var StateID = $('#State').val();
        var StateData = JSON.parse(JSON.stringify(AllData));

        var UniqDist = UniqueDistrict(StateData, StateID);
        $('#District').html('');
        $.each(UniqDist, function (i) {
            var optionhtml = '<option value="' +
        UniqDist[i].DistrictID + '">' + UniqDist[i].DistrictName + '</option>';
            $("#District").append(optionhtml);
        });

    });

   
    var LoadStateCity = function () {
        $('#returnMessage').val('');
        var ajaxObj = {
            url: utils.Urls.GetStateDistrict,
            type: 'GET',

        };
        $('#returnMessage').hide();
        utils.ajaxCallUrl(ajaxObj.url, ajaxObj.type, StateCityCallBack);
    }
    var StateCityCallBack = function (data) {
        if (data != undefined || data != null || data.length > 0) {
            var StateData = JSON.parse(JSON.stringify(data));
            AllData = JSON.parse(JSON.stringify(data));

            //Bind State drop down
            var uniq = UniqueState(StateData);


            //var optionhtml1 = '<option value="' +
            //  0 + '">' + "--Select State--" + '</option>';
            //$("#State").append(optionhtml1);

            $.each(uniq, function (i) {
                var optionhtml = '<option value="' +
            uniq[i].StateID + '">' + uniq[i].StateName + '</option>';
                $("#State").append(optionhtml);
            });

            //Load the user profile details if already exists.
            LoadUserProfile();

            
        }


    };
    var UniqueState = function(list) {
        var results = [];
        var State = 0;
        for (var i = list.length; i--;) {
            //
            if (State == list[i].StateID) {
                list.splice(i, 1);
            }
            else {
                State = list[i].StateID
            }
        }
        return list;
    }
    var UniqueDistrict = function(list, StateID) {
        
        var State = 0;
        for (var i = list.length; i--;) {
            //
            if (StateID != list[i].StateID) {
                list.splice(i, 1);
            }

        }

        return list;
    }
    var LoadUserProfile = function() {
        $('#returnMessage').val('');
        var user = utils.localStorage().get('user');
        var ajaxObj = {
            url: utils.Urls.GetSoochnaPreneurDetails + user.userName + '&roleid=7',
            type: 'GET',
            obj: { UserName: user.userName, RoleId: 7 }

        };
        if (ajaxObj.obj.UserName.length <= 0) {
            $('#returnMessage').append('UserName cannot be blank');
            $('#returnMessage').show();
            return false;
        }

        else if (user == null) {
            $('#returnMessage').append('User Details could not be located,<br/> contact administrator');
            $('#returnMessage').show();

        }
        else {
            //
            $('#returnMessage').hide();
            utils.ajaxCallUrl(ajaxObj.url, ajaxObj.type, callBack);
        }
    }
    var callBack = function (data) {
        if (data != undefined || data != null || data.UserDetails != undefined || data.UserDetails != null && data.UserDetails.length > 0) {
            if (data.UserDetails[0].Status == true) {
                BindData(data.UserDetails[0]);
            }
            else {
                $('#returnMessage').append(data.errorMsg);
                $('#returnMessage').show();
            }

        }
         }
    var BindData = function(data) {

        $('#txtFirstName').val(data.FirstName);
        $('#txtLastName').val(data.LastName);
        
        $('#State').val(data.StateID);
        DistrictID = data.DistrictID;
        $('#State').change();
        $('#District').val(data.DistrictID);

        $('#txtEMail').val(data.EMail);
      
        if (utils.validate.empty(data.Photo) == true) {
            var image = document.getElementById('imgProfilePic');
            image.src = "data:image/jpeg;base64," + data.Photo;
        }
        $('#myModal').modal('hide');
    }
    var checkValidDate = function (d) {
        
        var date = d.split('/');
        if (date[2] >= 1902)
            return d;
        else
            return '';
    };
    
    $('#SaveProfile').click(function () {
        $.ajax({
            url: utils.Urls.IsOnline,
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            crossdomain: true,
            async: false,
            success: function (data) {
                $('#ModalText').html('Saving profile. Please wait.....');
                $('#myModal').modal('show');
                $('#returnMessage').val('');
                $('#returnMessage').hide();
                if (utils.comparison.strings($('#Password').val(), $('#NewPassword').val()) == false) {
                    $('#returnMessage').append('Passwords entered does not match');
                    $('#returnMessage').show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    return false;
                }
                if (utils.validate.empty($('#txtFirstName').val()) == false) {
                    $('#returnMessage').append('First Name is mandatory');
                    $('#returnMessage').show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    return false;
                }
                if (utils.validate.empty($('#txtLastName').val()) == false) {
                    $('#returnMessage').append('Surname is mandatory');
                    $('#returnMessage').show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    return false;
                }
                var image = document.getElementById('imgProfilePic');
                var dataImage = utils.pureBase64(image.src);
                var user = utils.localStorage().get('user');
                var ajaxObj = {
                    url: utils.Urls.SaveSoochnaPreneurDetails,
                    type: 'POST',
                    obj: {
                        "UserName": user.userName,
                        "EMail": $('#txtEMail').val(),
                        "RoleID": user.RoleID,
                        "FirstName": $('#txtFirstName').val(),
                        "LastName": $('#txtLastName').val(),
                        "StateID": $('#State').val(),
                        "DistrictID": $('#District').val(),
                        "Password": $('#Password').val(),
                        "Photo": dataImage

                    }

                };

                utils.ajaxCall(ajaxObj.url, ajaxObj.type, ajaxObj.obj, callback);
            },
            error: function (error) {
                var LangId = 1;
                LangId = utils.localStorage().get('LangID');
                if (LangId == 1) {
                   alert('Profile can not be edited in Offline mode.')
                }
                else {
                    alert('प्रोफ़ाइल ऑफलाइन मोड में संपादित नहीं किया जा सकता है।')
                }
            }
        });

        
        
    });
    var callback = function (data) {
        if (data == true) {
            //
            $('#myModal').modal('hide');
            window.location.href = 'myaccount.html';
        }
        else {

            var LangId = 1;
            LangId = utils.localStorage().get('LangID');
            if (LangId == 1) {
                alert('Profile could not be edited. Please try after some time.')
            }
            else {
                alert('प्रोफ़ाइल संपादित नहीं किया जा सकता है। कृपया कुछ देर बाद प्रयास करें।')
            }
        }
    };
})();

function queryCMS(tx) {
    var user = utils.localStorage().get('user');
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    var queryText = "SELECT ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId FROM CMS  WHERE LanguageId =" + LangId;
    tx.executeSql(queryText, [], queryCMSSuccess, errorCB);
}

// Query the success callback
function queryCMSSuccess(tx, data) {
    var len = data.rows.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            switch (data.rows.item(i).KeyName) {
                case 'CmsEditProfile':
                    $('#DivEditProfileText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsRemovePhoto':
                    $('#RemovePhoto').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsbackgroundInfo':
                    $('#DivBackInfo').html(data.rows.item(i).KeyValue);
                    break;

                case 'CmsFirstName':
                    $('#txtFirstName').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsLastName':
                    $('#txtLastName').attr("placeholder", data.rows.item(i).KeyValue);
                    break;

                case 'CmsEmail':
                    $('#txtEMail').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                case 'CmsPassword':
                    $('#Password').attr("placeholder", data.rows.item(i).KeyValue);
                    $('#NewPassword').attr("placeholder", data.rows.item(i).KeyValue);
                    break;
                
                case 'CmsUpdateAndProceed':
                    $('#SaveProfile').html(data.rows.item(i).KeyValue);
                    break;
               
                case 'CmsState':
                    $('#DivStateText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsDistrict':
                    $('#DivDistrictText').html(data.rows.item(i).KeyValue);
                    break;
                case 'CmsMobileNumber':
                    $('#Phone').attr("placeholder", dat.KeyValue);
                    break;
                case 'CmsIdDetails':
                    $('#IdDetails').attr("placeholder", dat.KeyValue);
                    break;
                case 'CmsMobileRequired':
                    mobileReq = dat.KeyValue;
                    break;
                //
                case 'CmsPhotoRequired':
                    photoReq = dat.KeyValue;
                    break;
                case 'CmsFirstNameRequired':
                    firstNameReq = dat.KeyValue;
                    break;
                case 'CmsSurNameRequired':
                    surNameReq = dat.KeyValue;
                    break;
                case 'CmsRelationshipRequired':
                    relationReq = dat.KeyValue;
                    break;
                case 'CmsPhoneLength':
                    phoneLength = dat.KeyValue;
                    break;
                case 'CmsAddressRequired':
                    addressReq = dat.KeyValue;
                    break;
                case 'CmsMotherNameRequired':
                    motherNameReq = dat.KeyValue;
                    break;
                case 'CmsFatherNameRequired':
                    fatherNameReq = dat.KeyValue;
                    break;
                case 'CmsDoBRequired':
                    dobReq = dat.KeyValue;
                    break;
                case 'CmsGenderRequired':
                    genderReq = dat.KeyValue;
                    break;

                case 'CmsAgeRangeRequired':
                    ageRangeReq = dat.KeyValue;
                    break;
                case 'CmsReligionRequired':
                    religionReq = dat.KeyValue;
                    break;
                case 'CmsEcoStatusRequired':
                    ecoStatusReq = dat.KeyValue;
                    break;
                case 'CmsOccupationRequired':
                    occupationReq = dat.KeyValue;
                    break;
                case 'CmsQualificationRequired':
                    qualificationReq = dat.KeyValue;
                    break;
                case 'CmsMaritalStatusRequired':
                    maritalStatusReq = dat.KeyValue;
                    break;
                case 'CmsCategoryRequired':
                    categoryReq = dat.KeyValue;
                    break;

                //
                case 'CmsEmpStatusRequired':
                    empStatusReq = dat.KeyValue;
                    break;
                case 'CmsEnglishNameRequired':
                    engNameReq = dat.KeyValue;
                    break;
                case 'CmsAadharAlreadyRegistered':
                    alreadyRegistered = dat.KeyValue;
                    break;
                case 'CmsProfileSuccess':
                    familySuccess = dat.KeyValue;
                    break;
                case 'CmsAadharLength':
                    aadharLength = dat.KeyValue;
                    break;
                case 'CmsLoadingProfile':
                    loadingProfile = dat.KeyValue;
                    break;
            }

        }
    }
}