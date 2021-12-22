/// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />

(function () {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    var cmsKeys = utils.localStorage().get('CMSKey');
    var ajaxObj = {
        url: utils.Urls.GetBeneficiaryDtls,
        type: 'GET'
    };
    function errorCB(err) {
        
        //alert("Error fetching Data: " + err.message);
    }
    var getCmsKeyVal = function (cmsKeys, key) {
        var keyVal = '';
        $.each(cmsKeys, function (i, dat) {

            var cmsKey = 'Cms' + key;
            if (dat.KeyName == cmsKey) {

                keyVal = dat.KeyValue;
                if (keyVal != undefined && keyVal != '' && dat.KeyName != 'CmsSpecialGroup' && dat.KeyName != 'CmsDisability' && dat.KeyName!='CmsSickness')
                    keyVal = keyVal + '*';
            }
        });
        return keyVal;
    }
    var filterByLang = function (data) {
        var lang = utils.localStorage().get('LangID');
        var k = 0;
        var obj = new Object();
        $.each(data, function (i, dat) {
            if (dat.LangID == lang || dat.LangId == lang) {
                obj[k] = dat;
                k += 1;
            }

        });
        return obj;
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
                else if (type == 'text' || type == 'number') {
                    if (id != undefined && id != 'percentageDisability' && id != 'FamilyIncome') {
                        dat.KeyValue = dat.KeyValue + ' *';
                    }
                    $('#' + id).attr("placeholder", dat.KeyValue);
                    
                }
                else {
                    $('#' + id).html(dat.KeyValue);
                }

                switch (dat.KeyName) {
                    case 'CmsMobileNumber':
                        $('#Phone').attr("placeholder", dat.KeyValue);
                        break;
                    case 'CmsIdDetails':
                        $('#IdDetails').attr("placeholder", dat.KeyValue);
                        break;
                }
            });
            
           
        }
    }
    var primaryBeneficiary = utils.localStorage().get('primaryBeneficiary');
    var AllData = new Array();
    var callBack = function (data) {
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
        
        utils.bindDropDown(filterByLang(data. Relationships), getCmsKeyVal(cmsKeys, 'Relationship'), 'Relationship');
        bState(filterByLang(data.States), getCmsKeyVal(cmsKeys, 'State'), 'State'); //
        bDistrict(filterByLang(data.Districts), getCmsKeyVal(cmsKeys, 'District'), 'District');
        AllData = JSON.parse(JSON.stringify(filterByLang(data.Districts)));

    };
    $(function () {
        db.transaction(queryCMS, errorCB);
        var masterData = utils.localStorage().get('masterDataBeneficiary');
        
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
        callBack(masterData);
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
    bState = function (itemList, obj, dropDown) {
        var stateID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        stateID = user.StateID;
        if (LangId == 2) {
            stateID = utils.getState(user.StateID);
        }
        bindStates(itemList, obj, stateID);
    }
    bindStates = function (itemList, obj, dropDown) {


        $.each(itemList, function (i, data) {

            if (data.StateID == dropDown) {


                $('#bindState').html(data.StateName);
                $('#State').html(data.StateID);
                return false;
            }
        });

    };
    bDistrict = function (itemList, obj, dropDown) {
        var districtID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        districtID = user.DistrictID;

        if (LangId == 2) {
          
            districtID = utils.getDistrict(user.DistrictID);

            
        }
        bindDistricts(itemList, obj, districtID)
    }
    bindDistricts = function (itemList, obj, dropDown) {

        //var listItems = "";
        //listItems += "<option value='-1' selected='true' disabled='disabled'>" + obj + "</option>";
        //$.each(itemList, function (i, dat) {
        //    listItems += "<option value='" + dat.DistrictID + "'>" + dat.DistrictName + "</option>";
        //});
        ////for (var i = 0; i < itemList.length; i++) {
        ////    listItems += "<option value='" + itemList[i].DistrictID + "'>" + itemList[i].DistrictName + "</option>";
        ////}
        //$('#' + dropDown).html(listItems);
        //var user = utils.localStorage().get('user');

        $.each(itemList, function (i, data) {

            if (data.DistrictID == dropDown) {

                // alert(data.StateName);
                $('#bindDistrict').html(data.DistrictName);
                $('#District').html(data.DistrictID);
                return false;
            }
        });
    };
    $('#AddBeneficiaryFamily').click(function () {
       
        var objStats = true;
        var user = utils.localStorage().get('user');
        var image = document.getElementById('imgProfilePic');
        var dataImage = utils.pureBase64(image.src);
        var ajaxObj = {
            url: utils.Urls.AddBeneficiary,
            type: 'POST',
            obj: {
                'Id': utils.randomNum(),
                'ParentId': primaryBeneficiary.Id,
                'FirstName': SetValue('FirstName', 'input', false, null),
                'LastName': SetValue('LastName', 'input', false, null),
                'FathersName': SetValue('FathersName', 'input', false, null),
                'HusbandsName': SetValue('HusbandsName', 'input', false, null),
                'DOB': SetValue('DOB', 'date', false, null),
                'IDDetails': SetValue('IdDetails', 'input', false, null),
                'IDProof': SetValue('IDProof', 'dropDown', false, null),
                'Sex': SetValue('Gender', 'dropDown', false, null),
                'Age': SetValue('Age', 'dropDown', false, null),
                'Religion': SetValue('Religion', 'dropDown', false, null),
                //'Caste': SetValue('Caste', 'dropDown', false, null),
                'Socio': SetValue('EconomicSocial', 'dropDown', false, null),
                'Occupation': SetValue('Occupation', 'dropDown', false, null),
                'MaritalStatus': SetValue('MaritalStatus', 'dropDown', false, null),
                'Category': SetValue('Category', 'dropDown', false, null),
                'Department': SetValue('Department', 'dropDown', false, null),
                'EmploymentStatus': SetValue('EmpStatus', 'dropDown', false, null),
                'VulGroup': SetValue('SpecialGroup', 'dropDown', false, null),
                'AnnualIncome': SetValue('FamilyIncome', 'input', false, null),
                'Disabilty': SetValue('TypeofDisability', 'dropDown', false, null),
                'SoochnaPreneur': user.userName,
                'State': user.StateID, //SetValue('State', 'state', false, null),
                'District': user.DistrictID, //SetValue('District', 'district', false, null),
                'Photo': dataImage,
                'Relationship': SetValue('Relationship', 'dropDown', false, null),
                'Sickness': SetValue('Sickness', 'dropDown', false, null),
                'PercentageDisablity': SetValue('percentageDisability', 'input'),
                'Address': SetValue('Address', 'input'),
                'EMail': SetValue('EMail', 'input'),
                'Phone': SetValue('Phone', 'input'),
                'Qualification': SetValue('Qualification', 'dropDown'),

            }
        };
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
        if (LangId == 1) {
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.FirstName, 'First Name is mandatory', 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.LastName, 'Surname is mandatory', 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Relationship, 'Relationship is mandatory', 'dropDown', 'returnMessage');

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
                if (val1 == false && val2 == false)
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
                var aadhar = utils.validate.empty(ajaxObj.obj.Phone);
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
                objStats = ValidateObject(ajaxObj.obj.Occupation, 'Occupation is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Qualification, 'Qualifications is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.MaritalStatus, 'Marital Status is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Category, 'Category is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.EmploymentStatus, 'Employment Status is mandatory', 'dropDown', 'returnMessage');
        }
        else if (LangId == 2) {
         
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.FirstName, 'पहला नाम अनिवार्य है', 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.LastName, 'अंतिम नाम अनिवार्य है', 'input', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Relationship, 'संबंध अनिवार्य है', 'dropDown', 'returnMessage');
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
                //objStats = ValidateObject(ajaxObj.obj.EMail, 'ईमेल आईडी अनिवार्य है', 'input', 'returnMessage');
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
                objStats = ValidateObject(ajaxObj.obj.Occupation, 'व्यवसाय अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Qualification, 'योग्यता अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.MaritalStatus, 'वैवाहिक स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Category, 'श्रेणी अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.EmploymentStatus, 'रोजगार की स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
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
            $('#myModal').modal('toggle');
            $(this).hide();
            //utils.ajaxCall(ajaxObj.url, ajaxObj.type, ajaxObj.obj, postBack);
            var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
            db.transaction(function (tx) {
                if (ajaxObj.obj.PercentageDisablity == '') ajaxObj.obj.PercentageDisablity = null;
                if (ajaxObj.obj.DOB == 'Invalid Date') ajaxObj.obj.DOB = '';
                else
                {
                    ajaxObj.obj.DOB = ajaxObj.obj.DOB.toJSON().slice(0, 10).replace(/-/g, '/')
                }
               
                var today = new Date();
                var stmt = "INSERT INTO SubBeneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, DateOfRegistration, Qualification ) VALUES (";
                stmt += ajaxObj.obj.Id + "," + ajaxObj.obj.ParentId + ",'" + ajaxObj.obj.FirstName + "','" + ajaxObj.obj.LastName + "','" + ajaxObj.obj.FathersName + "','" + ajaxObj.obj.HusbandsName + "','" + ajaxObj.obj.DOB + "'," + ajaxObj.obj.IDProof + ",'" + ajaxObj.obj.IDDetails + "'," + ajaxObj.obj.State + "," + ajaxObj.obj.District + "," + ajaxObj.obj.Sex + "," + ajaxObj.obj.Age + "," + ajaxObj.obj.Religion + "," + ajaxObj.obj.Socio + "," + ajaxObj.obj.Occupation + "," + ajaxObj.obj.MaritalStatus + "," + ajaxObj.obj.Category + "," + ajaxObj.obj.Department + "," + ajaxObj.obj.EmploymentStatus + "," + ajaxObj.obj.VulGroup + ",'" + ajaxObj.obj.AnnualIncome + "'," + ajaxObj.obj.Disabilty + ",'" + ajaxObj.obj.SoochnaPreneur + "','" + ajaxObj.obj.Photo + "'," + ajaxObj.obj.Relationship + ",'" + ajaxObj.obj.Sickness + "','" + ajaxObj.obj.PercentageDisablity + "','" + ajaxObj.obj.Address + "','" + ajaxObj.obj.EMail + "','" + ajaxObj.obj.Phone + "','true','" + today.toJSON().slice(0, 10).replace(/-/g, '/') +"'," + ajaxObj.obj.Qualification+ ")";
                tx.executeSql(stmt);
                postBack(true);
            }, errorCB);
        }
       
    });
    var ValidateObject = function (data, message, type, idToDisplay) {
        var val = true;
        if (type == 'input') {
            val = utils.validate.empty(data);

            if (val == false) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
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
            var val1 = utils.validate.empty(data);
            var val2 = utils.validate.isZero(data);
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
            if (data == null || data == '') {
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
           
            var LangId = utils.localStorage().get('LangID');
            if (LangId == 2)
                $('#returnMessage').append('परिवार के सदस्य को सफलता पूर्वक शामिल किया');
            else
                $('#returnMessage').append('Family Member Added Successfully');


            
            setTimeout(function () { window.location = 'primarybeneficiary.html'; }, 2000);
        }
    };
})();