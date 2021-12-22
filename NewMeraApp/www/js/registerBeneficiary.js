/// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />
(function () {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    $(function () {
        utils.Analytics.trackPage('RegisterBeneficiary');
        document.addEventListener("deviceready", onDeviceReady, false);


        function onDeviceReady() {
            var user = utils.localStorage().get('user');
            var pageVal = null;
            if (user != null) {
                pageVal = 'Register Beneficiary Page || ' + 'User:' + user.userName + ' || StateID: ' + user.StateID;
            }
            else {
                pageVal = 'Register Beneficiary Page';
            }
            utils.Analytics.trackPage(pageVal);

        }
    });
    function errorCB(err) {
        
     //   alert("Error fetching Data: " + err.message);
    }
    var checkValidDate = function (d) {
        
        var date = d.split('/');
        if (date[2] >= 1902)
            return d;
        else
            return '';
    };
    var getCmsKeyVal = function (cmsKeys, key) {
        var keyVal = '';
        $.each(cmsKeys, function (i, dat) {
            
            var cmsKey = 'Cms' + key;
            if (dat.KeyName == cmsKey) {
                
                keyVal = dat.KeyValue;
                if (keyVal != undefined && keyVal != '' && dat.KeyName != 'CmsSpecialGroup' && dat.KeyName != 'CmsDisability' && dat.KeyName != 'CmsSickness')
                keyVal = keyVal + '*';
            }

            switch (dat.KeyName) {
                case 'CmsMobileNumber':
                    $('#Phone').attr("placeholder", dat.KeyValue + ' *');
                    break;
                case 'CmsIdDetails':
                    $('#IdDetails').attr("placeholder", dat.KeyValue);
                    break;
            }
        });
        return keyVal;
    }
    var filterByLang = function (data) {
        var lang = utils.localStorage().get('LangID');
        var k = 0;
        var obj = new Object();
        $.each(data, function (i, dat) {
            if (dat.LangID == lang || dat.LangId == lang)
            {
                obj[k] = dat;
                k += 1;
            }
                
        });
        return obj;
    };
    var AllData = new Array();
    var callBack = function (data) {
        
        var cmsKeys = utils.localStorage().get('CMSKey');
        utils.bindDropDown(filterByLang(data.Ages), getCmsKeyVal(cmsKeys, 'Age'), 'Age'); //
        utils.bindDropDown(filterByLang(data.Categories), getCmsKeyVal(cmsKeys, 'Category'), 'Category'); //
        utils.bindDropDown(filterByLang(data.Departments), getCmsKeyVal(cmsKeys, 'Department'), 'Department'); //
        utils.bindDropDown(filterByLang(data.EmpStatuses), getCmsKeyVal(cmsKeys, 'EmpStatus'), 'EmpStatus');
        utils.bindDropDown(filterByLang(data.VulnerableGroups), getCmsKeyVal(cmsKeys, 'SpecialGroup'), 'SpecialGroup');
        utils.bindDropDown(filterByLang(data.MaritalStatuses), getCmsKeyVal(cmsKeys, 'Marital'), 'MaritalStatus');
        utils.bindDropDownById(filterByLang(data.IDProofs), getCmsKeyVal(cmsKeys, 'IDProof'), 'IDProof'); //
        utils.bindDropDown(filterByLang(data.Sex), getCmsKeyVal(cmsKeys, 'Sex'), 'Gender');
        utils.bindDropDown(filterByLang(data.Religions), getCmsKeyVal(cmsKeys, 'Religion'), 'Religion');
        utils.bindDropDown(filterByLang(data.Disabilities), getCmsKeyVal(cmsKeys, 'Disability'), 'TypeofDisability');
        utils.bindDropDown(filterByLang(data.Sicknesses), getCmsKeyVal(cmsKeys, 'Sickness'), 'Sickness');
        utils.bindDropDown(filterByLang(data.SocioStatuses), getCmsKeyVal(cmsKeys, 'SocialStatus'), 'EconomicSocial');
        utils.bindDropDown(filterByLang(data.Occupations), getCmsKeyVal(cmsKeys, 'Occupation'), 'Occupation');
        utils.bindDropDown(filterByLang(data.Qualifications), getCmsKeyVal(cmsKeys, 'Qualification'), 'Qualification');
        
        bindStates(filterByLang(data.States), getCmsKeyVal(cmsKeys, 'State'), 'State'); //

        bindDistricts(filterByLang(data.Districts), getCmsKeyVal(cmsKeys, 'District'), 'District');
        AllData = JSON.parse(JSON.stringify(filterByLang(data.Districts)));
        
    };
    function queryCMS(tx) {
        var user = utils.localStorage().get('user');
        var LangId = utils.localStorage().get('LangID');
        if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
            LangId = user.LangId;
        }
        var queryText = "SELECT ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId FROM CMS  WHERE LanguageId =" + LangId;
        tx.executeSql(queryText, [], queryCMSSuccess, errorCB);
    }
    function queryCMSSuccess(tx, data) {
        //utils.localStorage().set('CMSKey', data);
        var len = data.rows.length;
        if (len > 0) {
            $.each(data.rows, function (i, dat) {
               
                var element = dat.KeyName;
                var id = element.replace("Cms", "");
                var type = $('#' + id).attr('type');
                if ($('#' + id).hasClass("select1")) {
                }
                else if (type == 'text' || type == 'number' || type == 'tel') {
                    if (id != undefined && id != 'percentageDisability' && id != 'FamilyIncome' && id!='Phone' && id != 'EMail' && id!='TypeofDisability')
                    {
                        dat.KeyValue= dat.KeyValue + ' *';
                    }
                        $('#' + id).attr("placeholder", dat.KeyValue);

                }
                else
                {
                    if (id != undefined && id != 'basicInfo' && id != 'newReistrationHeader' && id != 'registerBeneficiary' && id != 'backgroundInfo') {
                        
                        dat.KeyValue = dat.KeyValue + ' *';
                    }
                    $('#' + id).html(dat.KeyValue);
                }
               

            });
        }
    }
    $(function () {
       
        db.transaction(queryCMS, errorCB);
        var masterData = utils.localStorage().get('masterDataBeneficiary');
       
        callBack(masterData);
        
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
                }

                utils.imageToBase64(image.src, image);
            }
        });
        
    });
    var UniqueDistrict = function (list, StateID) {

        var State = 0;
        for (var i = list.length; i--;) {
            //
            if (StateID != list[i].StateID) {
                list.splice(i, 1);
            }

        }

        return list;
    }
    bindStates = function (itemList, obj, dropDown) {
        var stateID = 0;
        var LangId = utils.localStorage().get('LangID');
        
        var user = utils.localStorage().get('user');
        stateID = user.StateID;

        if (LangId == 2) {
            stateID = utils.getState(user.StateID);
        }
        $.each(itemList, function (i, data) {
           
            if (data.StateID == stateID) {
                
                
                $('#bindState').html(data.StateName);
                $('#State').html(data.StateID);
                return false;
            }
        });
        
    };
    bindDistricts = function (itemList, obj, dropDown) {
        
        
        var districtID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        districtID = user.DistrictID;

        if (LangId == 2) {
            districtID = utils.getDistrict(user.DistrictID);
        }
        $.each(itemList, function (i, data) {
             
            if (data.DistrictID == districtID) {
                
               // alert(data.StateName);
                $('#bindDistrict').html(data.DistrictName);
                $('#District').html(data.DistrictID);
                return false;
            }
        });
    };
    $('#registerBeneficiary').click(function () {
        var objStats = true;
        var user = utils.localStorage().get('user');
        var image = document.getElementById('imgProfilePic');
        var dataImage = utils.pureBase64(image.src);
        var ajaxObj = {
            url: utils.Urls.AddBeneficiary,
            type: 'POST',
            obj: {
                'Id': utils.randomNum(),
                'ParentId': '0',
                'FirstName': SetValue('FirstName', 'input'),
                'LastName': SetValue('LastName', 'input'),
                'FathersName': SetValue('FathersName', 'input'),
                'HusbandsName': SetValue('HusbandsName', 'input'),
                'DOB': SetValue('DOB', 'date'),
                'IDDetails': SetValue('IdDetails', 'input'),
                'IDProof': SetValue('IDProof', 'dropDown'),
                'Sex': SetValue('Gender', 'dropDown'),
                'Age': SetValue('Age', 'dropDown'),
                'Religion' : SetValue('Religion', 'dropDown'),
                'Socio': SetValue('EconomicSocial', 'dropDown'),
                'Occupation': SetValue('Occupation', 'dropDown'),
                'MaritulStatus': SetValue('MaritalStatus', 'dropDown'),
                'Category': SetValue('Category', 'dropDown'),
                'Department': SetValue('Department', 'dropDown'),
                'EmpStatus': SetValue('EmpStatus', 'dropDown'),
                'VulGroup': SetValue('SpecialGroup', 'dropDown'),
                'AnnualIncome': SetValue('FamilyIncome', 'input'),
                'Disablity' : SetValue('TypeofDisability', 'dropDown'),
                'SoochnaPreneur' : user.userName,
                'State': user.StateID, //SetValue('State', 'input'),
                'District': user.DistrictID, //SetValue('District', 'input'),
                'Photo': dataImage,
                'Relationship': '0',
                'Sickness': SetValue('Sickness', 'dropDown'),
                'PercentageDisability': SetValue('percentageDisability', 'input'),
                'Address': SetValue('Address', 'input'),
                'EMail': SetValue('EMail', 'input'),
                'Phone': SetValue('Phone', 'input'),
                'Qualifications': SetValue('Qualification', 'dropDown')
            }
        };
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        
        switch (LangId) {
            case 1:
                message = 'To register a beneficiary, it is mandatory to add their photo.';
                break;
            case 2:
                message = 'लाभार्थी को पंजीकृत करने के लिए, उनकी तस्वीर जोड़ने के लिए अनिवार्य है।';
                break;
        }
        if (objStats) {
            objStats = utils.localStorage().get('setImage');
            if (!objStats) {
                $('#returnMessage').html(message);
                $('#returnMessage').show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
            }
            else {
                $('#returnMessage').html('');
                $('#returnMessage').hide();
            }
        }
        if (LangId == 1) {
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.FirstName, 'First Name is mandatory', 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.LastName, 'Surname is mandatory', 'input', 'returnMessage');
            if (objStats) {
                //objStats = ValidateObject(ajaxObj.obj.Phone, 'Mobile Number is mandatory', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.Phone)) {
                    objStats = utils.matchLength(10, ajaxObj.obj.Phone);
                    if (objStats)
                        objStats = utils.isPureNum(ajaxObj.obj.Phone);

                    var message = 'Invalid Phone Number, should be 10 digits.';
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            }
               
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Address, 'Address is mandatory', 'input', 'returnMessage');
            if (objStats) {
                //objStats = ValidateObject(ajaxObj.obj.EMail, 'EMail Id is mandatory', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.EMail)) {
                    objStats = utils.validate.email(ajaxObj.obj.EMail);
                    var message = 'Invalid E-Mail Id.';
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            }
            if (objStats) {
                var val1 = ValidateObject(ajaxObj.obj.FathersName, 'Father\'s Name or Husband\'s Name is mandatory', 'input', 'returnMessage');
                var val2 = ValidateObject(ajaxObj.obj.HusbandsName, 'Father\'s Name or Husband\'s Name is mandatory', 'input', 'returnMessage');
                if(val1 == false && val2 == false)
                    objStats = false;
            }
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.DOB, 'Date of Birth is mandatory', 'dob', 'returnMessage');
            if (objStats) {
                //objStats = ValidateObject(ajaxObj.obj.IDDetails, 'Aadhar Number is mandatory', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.IDDetails)) {
                    objStats = utils.matchLength(12, ajaxObj.obj.IDDetails);
                    if (objStats)
                        objStats = utils.isPureNum(ajaxObj.obj.IDDetails);

                    var message = 'Invalid Aadhar Number, should be 12 digits.';
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            }
            if (objStats) {
                var phone = utils.validate.empty(ajaxObj.obj.Phone);
                var aadhar = utils.validate.empty(ajaxObj.obj.IDDetails);
                var message = 'For registeration either Mobile number or Aadhar number has to be entered';
                var idToDisplay = 'returnMessage';
                if ((phone == false) && (aadhar == false)) {
                    objStats = false;
                    $('#' + idToDisplay).html(message);
                    $('#' + idToDisplay).show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                }
                else {
                    $('#' + idToDisplay).html('');
                    $('#' + idToDisplay).hide();

                }
               
            }    
         
            
           
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Sex, 'Gender is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Age, 'Range of Age is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Religion, 'Religion is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Socio, 'Economic status is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.EmpStatus, 'Employment status is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Occupation, 'Occupation is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Qualifications, 'Qualifications is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.MaritulStatus, 'Marital Status is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Category, 'Category is mandatory', 'dropDown', 'returnMessage');
            
            //    objStats = ValidateObject(ajaxObj.obj.State, 'Select the State of Beneficiary', 'dropDown', 'returnMessage');
            //if (objStats)
            //    objStats = ValidateObject(ajaxObj.obj.District, 'Select the District of Beneficiary', 'dropDown', 'returnMessage');
        }
        else if (LangId==2) {
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.FirstName, 'पहला नाम अनिवार्य है', 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.LastName, 'अंतिम नाम अनिवार्य है', 'input', 'returnMessage');
            if (objStats) {
                //objStats = ValidateObject(ajaxObj.obj.Phone, 'मोबाइल नंबर अनिवार्य है', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.Phone)) {
                    objStats = utils.matchLength(10, ajaxObj.obj.Phone);
                    if (objStats)
                        objStats = utils.isPureNum(ajaxObj.obj.Phone);

                    var message = 'अमान्य फोन नंबर, 10 अंक होना चाहिए';
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            }
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Address, 'पता अनिवार्य है', 'input', 'returnMessage');
            if (objStats) {
               // objStats = ValidateObject(ajaxObj.obj.EMail, 'ईमेल आईडी अनिवार्य है', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.EMail)) {
                    objStats = utils.validate.email(ajaxObj.obj.EMail);
                    var message = 'अमान्य ई-मेल आईडी';
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            }
            if (objStats) {
                var val1 = ValidateObject(ajaxObj.obj.FathersName, 'पिता का नाम या पति का नाम अनिवार्य है', 'input', 'returnMessage');
                var val2 = ValidateObject(ajaxObj.obj.HusbandsName, 'पिता का नाम या पति का नाम अनिवार्य है', 'input', 'returnMessage');
                if (val1 == false && val2 == false)
                    objStats = false;
            }
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.DOB, 'जन्म तिथि अनिवार्य है', 'dob', 'returnMessage');
            if (objStats) {
               // objStats = ValidateObject(ajaxObj.obj.IDDetails, 'आधार संख्या अनिवार्य है', 'input', 'returnMessage');
                if (utils.validate.empty(ajaxObj.obj.IDDetails)) {
                    objStats = utils.matchLength(12, ajaxObj.obj.IDDetails);
                    if (objStats)
                        objStats = utils.isPureNum(ajaxObj.obj.IDDetails);

                    var message = 'अमान्य आधार संख्या, 12 अंक होना चाहिए';
                    if (!objStats) {

                        $('#returnMessage').html(message);
                        $('#returnMessage').show();
                        $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                    }
                    else {
                        $('#returnMessage').html('');
                        $('#returnMessage').hide();

                    }

                }
            } 
            if (objStats) {
                var phone = utils.validate.empty(ajaxObj.obj.Phone);
                var aadhar = utils.validate.empty(ajaxObj.obj.IDDetails);
                var message = 'पंजीकरण के लिए या तो मोबाइल नंबर या आधार संख्या अनिवार्य है';
                var idToDisplay = 'returnMessage';
                if ((phone == false) && (aadhar == false)) {
                    objStats = false;
                    $('#' + idToDisplay).html(message);
                    $('#' + idToDisplay).show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                }
                else {
                    $('#' + idToDisplay).html('');
                    $('#' + idToDisplay).hide();

                }

            }    
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Sex, 'लिंग अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Age, 'आयु की रेंज अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Religion, 'धर्म अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Socio, 'आर्थिक स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.EmpStatus, 'रोजगार की स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Occupation, 'व्यवसाय अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Qualifications, 'योग्यता अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.MaritulStatus, 'वैवाहिक स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Category, 'श्रेणी अनिवार्य है', 'dropDown', 'returnMessage');

        }
        if (objStats) {
            objStats = utils.isPureEnglish(ajaxObj.obj.FirstName);
            objStats = utils.isPureEnglish(ajaxObj.obj.LastName);
            objStats = utils.isPureEnglish(ajaxObj.obj.FathersName);
            if (!objStats && LangId == 1) {
                var message = 'Name should only be entered in English';
                $('#returnMessage').html(message);
                $('#returnMessage').show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
            }
            else if (!objStats && LangId == 2) {
                var message = 'नाम केवल अंग्रेजी में दर्ज किया जाना चाहिए';
                $('#returnMessage').html(message);
                $('#returnMessage').show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
            }
            else {
                $('#returnMessage').html('');
                $('#returnMessage').hide();
            }
        }
        if (objStats) {
            CheckBeneficiaryAadhar(ajaxObj);
           
        }
           
        
        
    });

    var ValidateObject = function (data, message, type, idToDisplay) {
        var val = true;
        if (type == 'input') {
            val = utils.validate.empty(data);
            theOffset = $(this).offset();
            if (val == false) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55}, 'slow');
            }
            else {
                $('#' + idToDisplay).html('');
                $('#' + idToDisplay).hide();
                
            }
            return val;
        }
        else if (type == 'dob') {
            val = utils.validate.date(data);

            if (val == false) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
            }
            else {
                $('#' + idToDisplay).html('');
                $('#' + idToDisplay).hide();

            }
            return val;
            
        }
        else if (type == 'dropDown') {
            if (typeof data == 'undefined') {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                val = false;
            }
            var val1 = utils.validate.empty(data) ;
            var val2 = utils.validate.isZero(data) ;
            if (val1 == false || val2 == false) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                val = false;
            }
            else {
                $('#' + idToDisplay).html('');
                $('#' + idToDisplay).hide();
                val = true;

            }
            return val;
        }
    };
    
    var SetValue = function (id, type) {
        if (type == 'input') {
            var data = $('#' + id).val();
            if (data == null) {
                return '';
            }
            else {
                return $('#' + id).val();
            }
           
        }
        else if (type == 'date') {
            var txt = $('#' + id).val();
            var date = new Date(txt);
            return date;
        }
        else if (type == 'dropDown') {
            var data = $('#' + id).val();
            if (data == null) {
                return '0';
            }
            else {
                return $('#' + id).val();
            }
        }
        else if (type == 'state') {
            return $('#' + id).val();
        }
        else if (type == 'district') {
           return $('#' + id).val();
        }
      
    };
    var postBack = function (data) {
        if (data == true) {
            $('#returnMessage').show();
            var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);

            db.transaction(AddBeneficiaryAnalytics, errorCB);

            var LangId = utils.localStorage().get('LangID');
            if (LangId == 2)
                $('#returnMessage').append('लाभार्थी सफलतापूर्वक पंजीकृत किया');
            else
                $('#returnMessage').append('Beneficiary registered successfully');

             
             setTimeout(function () { window.location = 'myaccount.html'; }, 2000);
        }
    };
    function CheckBeneficiaryAadhar(ajaxObj) {
       
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
        db.transaction(function (tx) {
            var aadhar = SetValue('IdDetails', 'input');
            var queryText = "SELECT * FROM Beneficiary WHERE IDDetails = '" + aadhar + "'";
            
            var message = '';
            var LangId = utils.localStorage().get('LangID');
            switch (LangId) {
                case 1:
                    message = 'This aadhar is already register with another beneficiary';
                    break;
                case 2:
                    message = 'यह आधार पहले से ही एक अन्य लाभार्थी के साथ पंजीकृत है';
                    break;
            }
            tx.executeSql(queryText, [], function (tx, data) {
                if (data.rows.length > 0) {
                    $('#returnMessage').html(message);
                    $('#returnMessage').show();
                    $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                }
                else {
                    $('#returnMessage').html('');
                    $('#returnMessage').hide();
                    $('#myModal').modal('toggle');
                    $(this).hide();
                    var today = new Date();
                    var CurrentDate = '';
                    //utils.ajaxCall(ajaxObj.url, ajaxObj.type, ajaxObj.obj, postBack);
                    db.transaction(function (tx) {
                        if (ajaxObj.obj.PercentageDisability == '') ajaxObj.obj.PercentageDisability = null;
                        if (ajaxObj.obj.DOB == 'Invalid Date')
                            ajaxObj.obj.DOB = '';
                        else {
                            var d = ajaxObj.obj.DOB.getDate();
                            var m = ajaxObj.obj.DOB.getMonth() + 1;
                            var y = ajaxObj.obj.DOB.getFullYear();
                            CurrentDate = y + '/' + m + '/' + d;
                        }
                        var stmt = "INSERT INTO Beneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, Qualification, DateOfRegistration) VALUES (";
                        stmt += ajaxObj.obj.Id + "," + ajaxObj.obj.ParentId + ",'" + ajaxObj.obj.FirstName + "','" + ajaxObj.obj.LastName + "','" + ajaxObj.obj.FathersName + "','" + ajaxObj.obj.HusbandsName + "','" + CurrentDate + "'," + ajaxObj.obj.IDProof + ",'" + ajaxObj.obj.IDDetails + "'," + ajaxObj.obj.State + "," + ajaxObj.obj.District + "," + ajaxObj.obj.Sex + "," + ajaxObj.obj.Age + "," + ajaxObj.obj.Religion + "," + ajaxObj.obj.Socio + "," + ajaxObj.obj.Occupation + "," + ajaxObj.obj.MaritulStatus + "," + ajaxObj.obj.Category + "," + ajaxObj.obj.Department + "," + ajaxObj.obj.EmpStatus + "," + ajaxObj.obj.VulGroup + ",'" + ajaxObj.obj.AnnualIncome + "'," + ajaxObj.obj.Disablity + ",'" + ajaxObj.obj.SoochnaPreneur + "','" + ajaxObj.obj.Photo + "'," + ajaxObj.obj.Relationship + ",'" + ajaxObj.obj.Sickness + "','" + ajaxObj.obj.PercentageDisability + "','" + ajaxObj.obj.Address + "','" + ajaxObj.obj.EMail + "','" + ajaxObj.obj.Phone + "','true'," + ajaxObj.obj.Qualifications + ",'" + today.toJSON().slice(0, 10).replace(/-/g, '/') + "')";
                        console.log(stmt);
                        tx.executeSql(stmt);
                        try {
                            var track = {
                                Category: 'RegisterBeneficiary', Action: 'AddBeneficiaryClick', Label: 'Beneficiary', Value: { 'Beneficiary': ajaxObj.obj.FirstName + ajaxObj.obj.LastName, 'SoochnaPreneur': ajaxObj.obj.SoochnaPreneur }
                            };
                            utils.Analytics.trackEvent(track);
                        }
                        catch (e) {
                            console.log(JSON.stringify(e));
                        }
                        postBack(true);
                    }, errorCB);

                }

            }, errorCB);
        }, errorCB);
     

    }
    function AddBeneficiaryAnalytics(tx) {
        var user = utils.localStorage().get('user');
        var LangId = utils.localStorage().get('LangID');
        var SchemeId = utils.localStorage().get('SchemeId');

        var param1 = new Date();
        var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();

        var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
        sqlStmt += "  ('B0001','Beneficiary','" + user.userName + "'," + user.StateID + "," + LangId + ",'ObjectId','ObjectType','Add Beneficiary','" + today + "')";

        if (sqlStmt != undefined && sqlStmt != null) {
            tx.executeSql(sqlStmt);
        }
    }
})();

function onDeviceReady() {
    window.analytics.startTrackerWithId('UA-98636842-1', 7200);
    try {
        window.analytics.trackView('Register Beneficiary');
    } catch (e) {
        console.log(JSON.stringify(e));
    }
   
    };


