/// <reference path="jquery-2.2.4.js" />
/// <reference path="utils.js" />


(function () {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    var cmsKeys = utils.localStorage().get('CMSKey');
    var primaryBeneficiary = utils.localStorage().get('primaryBeneficiary');
    var masterData = utils.localStorage().get('masterDataBeneficiary');
    var AllData = JSON.parse(JSON.stringify(masterData.Districts));
    function errorCB(err) {
        
        //alert("Error fetching Data: " + err.message);
    }
    var ChangeLanguageForLabels = function (data) {
        $.each(data, function (i, dat) {
            
            $('#' + dat.KeyName).html(dat.KeyValue);
            switch (dat.KeyName) {
                case 'CmsDOB':
                    $('#DOB').attr("placeholder", dat.KeyValue);

            }
        });
    };
    var getCmsKeyVal = function (key) {
        var keyVal = '';
        $.each(cmsKeys, function (i, dat) {
            
            var cmsKey = 'Cms' + key;
            if (dat.KeyName == cmsKey) {

                keyVal = dat.KeyValue;

            }
        });
        return keyVal;
    };

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

    $(function () {
        LoadBeneficiaryDetails(primaryBeneficiary, masterData);
       // $("#DOB").datepicker();
        $("#BenStateName").change(function () {
            
            var StateID = $(this).val();
            var StateData = JSON.parse(JSON.stringify(AllData));

            var UniqDist = UniqueDistrict(StateData, StateID);
            $('#BenDistrictName').html('');
            $.each(UniqDist, function (i) {
                var optionhtml = '<option value="' +
            UniqDist[i].DistrictID + '">' + UniqDist[i].DistrictName + '</option>';
                $("#BenDistrictName").append(optionhtml);
            });

        });
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
        ChangeLanguageForLabels(cmsKeys);
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
    };
    var LoadBeneficiaryDetails = function (primaryBeneficiary, data) {
        setData('BenIDProof', filterByLang(data.IDProofs), primaryBeneficiary.IDProof, getCmsKeyVal('Identity Proof'));
        setData('BenAge', filterByLang(data.Ages), primaryBeneficiary.Age, getCmsKeyVal('Age'));
        setData('BenGender', filterByLang(data.Sex), primaryBeneficiary.Sex, getCmsKeyVal('Gender'));
        setData('BenReligion', filterByLang(data.Religions), primaryBeneficiary.Religion, getCmsKeyVal('Religion'));
        
        setData('BenEcoStatus', filterByLang(data.SocioStatuses),primaryBeneficiary.Socio, getCmsKeyVal('Economic Status'));
        setData('BenOccupation', filterByLang(data.Occupations), primaryBeneficiary.Occupation, getCmsKeyVal('Occupation'));
       
        setData('BenQualification', filterByLang(data.Qualifications), primaryBeneficiary.Qualification, getCmsKeyVal('Qualification'));
        setData('BenMaritalStatus', filterByLang(data.MaritalStatuses), primaryBeneficiary.MaritalStatus, getCmsKeyVal('Marital Status'));
        setData('BenCategory', filterByLang(data.Categories), primaryBeneficiary.Category, getCmsKeyVal('Category'));
        setData('BenDepartment', filterByLang(data.Departments), primaryBeneficiary.Department, getCmsKeyVal('Department'));
        setData('BenEmpStatus', filterByLang(data.EmpStatuses), primaryBeneficiary.EmploymentStatus, getCmsKeyVal('Employment Status'));
        setData('BenVulGroup', filterByLang(data.VulnerableGroups), primaryBeneficiary.VulGroup, getCmsKeyVal('Special Group'));
        
        setData('BenDisability', filterByLang(data.Disabilities), primaryBeneficiary.Disabilty, getCmsKeyVal('Disability'));
        setData('BenSickness', filterByLang(data.Sicknesses), primaryBeneficiary.Sickness, getCmsKeyVal('Sickness'));
       
        sState('BenStateName', filterByLang(data.States), primaryBeneficiary.State, getCmsKeyVal('State'));

        var LangId = utils.localStorage().get('LangID');

        if (LangId != 1) {
            sDistrict('BenDistrictName', filterByLang(data.Districts), primaryBeneficiary.hDistrict, getCmsKeyVal('District'));
        }
        else {
            sDistrict('BenDistrictName', filterByLang(data.Districts), primaryBeneficiary.District, getCmsKeyVal('District'));
        }
        
       // setItem('name-primaryBeneficiary', data.FirstName + ' ' + data.LastName);
        setItem('firstName', primaryBeneficiary.FirstName);
        setItem('lastName', primaryBeneficiary.LastName);
        setItem('fathersName', primaryBeneficiary.FathersName);
        setItem('husbandsName', primaryBeneficiary.HusbandsName);
        setItem('DOB', (primaryBeneficiary.DOB == null ? '' : checkValidDate(utils.toDate(primaryBeneficiary.DOB))));
        setItem('AnnualIncome', utils.zeroToEmpty(primaryBeneficiary.AnnualIncome));
        
        setItem('PercentageDisablity', utils.zeroToEmpty(primaryBeneficiary.PercentageDisablity));
        setItem('IDProofDetails', primaryBeneficiary.IDDetails);
        setItem('Address', primaryBeneficiary.Address);
        setItem('EMail', primaryBeneficiary.EMail);
        setItem('Mobile', primaryBeneficiary.Phone);
        setImage('img-Beneficiary', primaryBeneficiary.Photo);
    };
    var checkValidDate = function (d) {
        
        var date = d.split('/');
        if (date[2] >= 1902)
            return d;
        else
            return '';
    };
    $('#updateBeneficiary').click(function () {
       
        var objStats = true;
        var user = utils.localStorage().get('user');
        var image = document.getElementById('img-Beneficiary');
        var dataImage = '';
     
        if (image != null) {
           dataImage = utils.pureBase64(image.src);
        }
        var ajaxObj = {
            url: utils.Urls.UpdateBeneficiary,
            type: 'POST',
            obj: {
                'Id': primaryBeneficiary.Id,
                'ParentId': '0',
                'FirstName': SetValue('firstName', 'input'),
                'LastName': SetValue('lastName', 'input'),
                'FathersName': SetValue('fathersName', 'input'),
                'HusbandsName': SetValue('husbandsName', 'input'),
                'DOB': SetValue('DOB', 'date'),
                'IDDetails': SetValue('IDProofDetails', 'input'),
                'IDProof': SetValue('BenIDProof', 'dropDown'),
                'Sex': SetValue('BenGender', 'dropDown'),
                'Age': SetValue('BenAge', 'dropDown'),
                'Religion': SetValue('BenReligion', 'dropDown'),
                'Socio': SetValue('BenEcoStatus', 'dropDown'),
                'Occupation': SetValue('BenOccupation', 'dropDown'),
                'MaritalStatus': SetValue('BenMaritalStatus', 'dropDown'),
                'Category': SetValue('BenCategory', 'dropDown'),
                'Department': SetValue('BenDepartment', 'dropDown'),
                'EmploymentStatus': SetValue('BenEmpStatus', 'dropDown'),
                'VulGroup': SetValue('BenVulGroup', 'dropDown'),
                'AnnualIncome': SetValue('AnnualIncome', 'input'),
                'Disabilty': SetValue('BenDisability', 'dropDown'),
                'SoochnaPreneur': user.userName,
                'State': SetValue('BenStateName', 'state'),
                'District': SetValue('BenDistrictName', 'district'),
                'Photo': dataImage,
                'Relationship': '0',
                'Sickness': SetValue('BenSickness', 'dropDown'),
                'PercentageDisablity': SetValue('PercentageDisablity', 'input'),
                'Address': SetValue('Address', 'input'),
                'EMail': SetValue('EMail', 'input'),
                'Phone': SetValue('Mobile', 'input'),
                'Qualification' : SetValue('BenQualification', 'dropDown')

            }
        };
        
        var LangId = 1;
        LangId = utils.localStorage().get('LangID');
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
               // objStats = ValidateObject(ajaxObj.obj.EMail, 'EMail Id is mandatory', 'input', 'returnMessage');
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
                objStats = ValidateObject(ajaxObj.obj.EmploymentStatus, 'Employment status is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Occupation, 'Occupation is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Qualification, 'Qualifications is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.MaritalStatus, 'Marital Status is mandatory', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Category, 'Category is mandatory', 'dropDown', 'returnMessage');

            //    objStats = ValidateObject(ajaxObj.obj.State, 'Select the State of Beneficiary', 'dropDown', 'returnMessage');
            //if (objStats)
            //    objStats = ValidateObject(ajaxObj.obj.District, 'Select the District of Beneficiary', 'dropDown', 'returnMessage');
        }
        else if (LangId == 2) {
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
                    if(objStats)
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
                objStats = ValidateObject(ajaxObj.obj.EmploymentStatus, 'रोजगार की स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Occupation, 'व्यवसाय अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.Qualification, 'योग्यता अनिवार्य है', 'dropDown', 'returnMessage');
            if (objStats)
                objStats = ValidateObject(ajaxObj.obj.MaritalStatus, 'वैवाहिक स्थिति अनिवार्य है', 'dropDown', 'returnMessage');
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
            $('#myModal').modal('show');
            utils.localStorage().set('primaryBeneficiary', ajaxObj.obj);
            // utils.ajaxCall(ajaxObj.url, ajaxObj.type, ajaxObj.obj, postBack);
            var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
            db.transaction(function (tx) {
                var stmt = "UPDATE Beneficiary";
                stmt += " SET Beneficiary = " + ajaxObj.obj.ParentId + ",";
                stmt += " FirstName = '" + ajaxObj.obj.FirstName + "',";
                stmt += " LastName = '" + ajaxObj.obj.LastName + "',";
                stmt += " FathersName = '" + ajaxObj.obj.FathersName + "',";
                stmt += " HusbandsName = '" + ajaxObj.obj.HusbandsName + "',";
                stmt += " DOB = '" + ajaxObj.obj.DOB + "',";
                stmt += " IDProof = " + ajaxObj.obj.IDProof + ",";
                stmt += " IDDetails = '" + ajaxObj.obj.IDDetails + "',";
                stmt += " State = " + ajaxObj.obj.State + ",";
                stmt += " District = " + ajaxObj.obj.District + ",";
                stmt += " Sex = " + ajaxObj.obj.Sex + ",";
                stmt += " Age = " + ajaxObj.obj.Age + ",";
                stmt += " Religion = " + ajaxObj.obj.Religion + ",";
                stmt += " Socio = " + ajaxObj.obj.Socio + ",";
                stmt += " Occupation = " + ajaxObj.obj.Occupation + ",";
                stmt += " MaritalStatus = " + ajaxObj.obj.MaritalStatus + ",";
                stmt += " Category = " + ajaxObj.obj.Category + ",";
                stmt += " Department = " + ajaxObj.obj.Department + ",";
                stmt += " EmploymentStatus = " + ajaxObj.obj.EmploymentStatus + ",";
                stmt += " VulGroup = " + ajaxObj.obj.VulGroup + ",";
                stmt += " AnnualIncome = '" + ajaxObj.obj.AnnualIncome + "',";
                stmt += " Disabilty = '" + ajaxObj.obj.Disabilty + "',";
                stmt += " SoochnaPreneur = '" + ajaxObj.obj.SoochnaPreneur + "',";
                stmt += " Photo = '" + ajaxObj.obj.Photo + "',";
                stmt += " Relationship = " + 0 + ",";
                stmt += " Sickness = " + ajaxObj.obj.Sickness + ",";
                stmt += " Address = '" + ajaxObj.obj.Address + "',";
                stmt += " EMail = '" + ajaxObj.obj.EMail + "',";
                stmt += " Phone = '" + ajaxObj.obj.Phone + "',";
                stmt += " PercentageDisablity  = '" + ajaxObj.obj.PercentageDisablity + "',";
                stmt += " Qualification = " + ajaxObj.obj.Qualification + ",";
                stmt += " IsUpdated  = 'true' ";
                stmt += " WHERE Id = " + primaryBeneficiary.Id;
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
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 75 }, 'slow');
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
           
            if (typeof data == 'undefined' || data == null) {
                $('#' + idToDisplay).html(message);
                $('#' + idToDisplay).show();
                $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 55 }, 'slow');
                return false;
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
            return $('#' + id).val();
        }
        else if (type == 'date') {
            var txt = $('#' + id).val();
            var date = new Date(txt);
            return date;
        }
        else if (type == 'dropDown') {
            return $('#' + id).val();
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
            $('#myModal').modal('hide');
            var LangId = utils.localStorage().get('LangID');
            if (LangId == 2)
                $('#returnMessage').append('प्रोफ़ाइल को सफलतापूर्वक अपडेट किया');
            else
                $('#returnMessage').append('Profile successfully updated');

            $('#returnMessage').show();
           
            $('html, body').animate({ scrollTop: $('#returnMessage').offset().top - 100 }, 'slow');
            
            setTimeout(function () { window.location = 'primarybeneficiary.html'; }, 3000);
        }
    };
    var setItem = function (id, item) {
        $('#' + id).val(item);
    };
    
    var setImage = function (id, data) {
        
        var img = document.getElementById(id);
        img.src = utils.getImage(data);
    };
    var setData = function (id, to, from, obj) {
        
        utils.bindDropDown(to, obj, id);
        $('#' + id).val(from).change();
        $('#' + id).change();
        
        

    };
    var sState = function (id, to, from, obj) {
        var stateID = 0;
        var LangId = utils.localStorage().get('LangID');

        
        var user = utils.localStorage().get('user');
        stateID = user.StateID;
        if (LangId == 2) {
            stateID = utils.getState(user.StateID);
        }
        setState(id, to, stateID, obj)
    }
    var setState = function (id, to, from, obj) {
        setDropDownState(to, obj, id);
        $('#' + id).val(from).change();
        $('#' + id).change();

    };
    var sDistrict = function (id, to, from, obj) {
        var districtID = 0;
        var LangId = utils.localStorage().get('LangID');

        var user = utils.localStorage().get('user');
        districtID = user.DistrictID;
        

        if (LangId == 2) {
            districtID = utils.getDistrict(user.DistrictID);
        }
        setDistrict(id, to, districtID, obj);
    }
    var setDistrict = function (id, to, from, obj) {
        
        setDropDownDistrict(to, obj, id);
        $('#' + id).val(from).change();
        $('#' + id).change();

    };
    var setDropDownDistrict = function (itemList, obj, dropDown) {
           
        var listItems = "";
        listItems += "<option value='-1' selected='true' disabled='disabled'>" + obj+ "</option>";
        //for (var i = 0; i < itemList.length; i++) {
        //    listItems += "<option value='" + itemList[i].DistrictID + "'>" + itemList[i].DistrictName + "</option>";
        //}
        $.each(itemList, function (i, dat) {
            listItems += "<option value='" + dat.DistrictID + "'>" + dat.DistrictName + "</option>";
        });
        $('#' + dropDown).html(listItems);
    };
    var setDropDownState = function(itemList, obj, dropDown) {
        
        var listItems = "";
        listItems += "<option value='-1' selected='true' disabled='disabled'>" + obj + "</option>";
        $.each(itemList, function (i, dat) {
            listItems += "<option value='" + dat.StateID + "'>" + dat.StateName + "</option>";
        });
        //for (var i = 0; i < itemList.length; i++) {
            
        //}
        $('#' + dropDown).html(listItems);
    };
})();