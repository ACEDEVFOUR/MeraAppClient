/// <reference path="jquery-2.2.4.js" />
var utils = {};

(function ($) {


    $('.analytics').click(function () {
        var id = $(this).attr('id');
        utils.localStorage().set('AnalyticsId', id);
        var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);

        db.transaction(InsertAnalytics, errorCB);
    });

    var validation = {
        isEmailAddress: function (str) {
            var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return pattern.test(str);  // returns a boolean
        },
        isNotEmpty: function (str) {
            var pattern = /\S+/;
            return pattern.test(str);  // returns a boolean
        },
        isNumber: function (str) {
            var pattern = /^\d+$/;
            return pattern.test(str);  // returns a boolean
        },
        isNumeric: function (str) {
            var pattern = /^\d+$/;
            var test1 = pattern.test(str);  // returns a boolean
            if (test1 == true) {
                var test2 = (str.indexOf(".") < 1);
                if (test2 == true)
                    return true
            }
            else {
                return false;
            }

        },
        isSame: function (str1, str2) {
            return str1 === str2;
        },
        isLengthMatch(len, str) {
            var strLen = str.length;
            if (strLen == len)
                return true;
            else
                return false;
        }

    };

    function InsertAnalytics(tx) {
        var id = utils.localStorage().get('AnalyticsId');
        var user = utils.localStorage().get('user');
        var LangId = utils.localStorage().get('LangID');
        var NewsId = utils.localStorage().get('NewsId');

        var param1 = new Date();
        var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();
        switch (id) {
            case 'divRTI':
                var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
                sqlStmt += "  ('R0001','RTI','" + user.userName + "'," + user.StateID + "," + LangId + ",'null','null','RTI','" + today + "')";
                break;
            case 'divSync':
                var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
                sqlStmt += "  ('U0002','SyncData','" + user.userName + "'," + user.StateID + "," + LangId + ",'null','null','My Account','" + today + "')";
                break;
        }
        if (sqlStmt != undefined && sqlStmt != null) {
            tx.executeSql(sqlStmt);
        }
    }


    //var mainUrl = "http://localhost:18942/";
    var mainUrl = "http://api.meraapp.in/";
    var newBenUrl = "http://api.meraapp.defindia.org/";
    utils = {
        Urls: {
            SchemeDtlsUrl: mainUrl + 'api/app/GetSchemeDtlView?schemeID=',
            GetBeneficiary: newBenUrl + 'api/Beneficiary/GetBeneficiaries?SoochnaPreneur=',
            GetSubBeneficiary: newBenUrl + 'api/beneficiary/GetSubBeneficiaries?SoochnaPreneur=',
            AddBeneficiary: newBenUrl + 'api/Beneficiary/AddBeneficiary/',
            GetSoochnaPreneurDetails: mainUrl + 'api/users/GetSoochnaPreneurDetails?UserName=',
            GetBeneficiaryDtls: mainUrl + 'api/Beneficiary/GetBeneficiaryDetails',
            GetStateDistrict: mainUrl + 'api/users/StateDistrict?langid=1',
            SaveSoochnaPreneurDetails: mainUrl + 'api/users/SaveSoochnaPreneurDetails',
            ForgotPassword: mainUrl + 'api/users/ForgotPassword',
            //GetSoochnaPreneurDetails: mainUrl + 'api/users/GetSoochnaPreneurDetails?UserName=',
            news: mainUrl + 'api/news',
            AuthenticateWebLogin: mainUrl + 'api/Users/AuthenticateWebLogin?userName=', //AuthenticateWebLogin: mainUrl + 'api/Users/AuthenticateWebLogin',
            UpdateBeneficiary: newBenUrl + 'api/Beneficiary/UpdateBeneficiary/',
            SearchBeneficiary: mainUrl + 'api/Beneficiary/SearchBeneficiaries/',
            GetPopularSchemes: mainUrl + 'api/schemes/GetPopularSchemes',
            BeneficiaryApplied: mainUrl + 'api/Beneficiary/BeneficiaryApplied',
            SearchBeneficiaryUserProfile: mainUrl + 'api/Beneficiary/SearchBeneficiary?SoochnaPreneur=',
            SearchScheme: mainUrl + 'api/schemes/SearchScheme/',
            GetBeneficiaryById: mainUrl + 'api/beneficiary/GetBeneficiaryById?id=',
            SearhForBeneficiary: mainUrl + 'api/beneficiary/SearchForBeneficiaries',
            GetBeneficiarySchemes: mainUrl + "api/beneficiary/GetBeneficiarySchemes?id=",
            BeneficiarySchemes: mainUrl + "api/beneficiary/BeneficiarySchemes?userId=",
            DeleteSchemeFromBen: mainUrl + "api/beneficiary/DeleteSchemeFromBenficiary?id=",
            UpdateBenStatus: mainUrl + "api/beneficiary/UpdateBenStatus",
            GetAppUsers: mainUrl + "api/app/AppUsers",
            IsFavorite: mainUrl + "api/app/isfavorite?schemeid=",
            GetRecentSearch: mainUrl + "api/beneficiary/GetRecentSearch?username=",
            GetFavourite: mainUrl + "api/Schemes/GetFavourite?username=",
            AddFavourite: mainUrl + "api/Schemes/AddFavourite",
            GetLanguage: mainUrl + "api/app/GetLanguage",
            GetSchemes: mainUrl + "api/schemes/GetSchemes?",
            IsOnline: mainUrl + "api/app/connect",
            GetSchemeBenefits: mainUrl + "api/Schemes/GetSchemeBenefits",
            GetSchemeDetails: mainUrl + "api/Schemes/GetSchemeDetails",
            GetSchemeDocuments: mainUrl + "api/Schemes/GetSchemeDocuments",
            PopulateBeneficiaryApplied: mainUrl + "api/beneficiary/PopulateBeneficiaryApplied?userId=",
            SyncBeneficiary: newBenUrl + "api/Beneficiary/SyncBeneficiary",
            SyncBeneficiaryApplied: mainUrl + "api/Beneficiary/SyncBeneficiaryApplied",
            SearchMapping: mainUrl + "api/app/GetSearchMapping",
            AnalyticsMasterUrl: mainUrl + "api/app/GetAnalyticsMaster",
            AnalyticsPostUrl: mainUrl + "api/app/AddAppAnalytics",
            WalletPostUrl: mainUrl + "api/app/AddWallet",
            ServiceTypeUrl: mainUrl + "api/app/GetServiceType",
            ServicesUrl: mainUrl + "api/app/GetServices",
            AppUserWalletUrl: mainUrl + "api/app/GetAppUserWallet?username=",
            AppUserImage: mainUrl + "api/app/AppUsersImage?username=",
            EngHinDistrict: mainUrl + "api/schemes/GetEngHinDistrict?StateId=",
            GetAllSurveys: mainUrl + "api/Survey/GetAllSurveyMobile",
            GetAllSurveySections: newBenUrl + "api/Survey/GetAllSurveySections",
            GetAllSurveyDetails: newBenUrl + "api/Survey/GetAllSurveyDetails",
            GetAllSurveyData: newBenUrl + "api/Survey/GetAllSurveyData?username=",
            GetAllSurveyDataDetails: newBenUrl + "api/Survey/GetAllSurveyDataDetails?username=",
            PostSurveyData: newBenUrl + "api/Survey/InsertSurveyData",
            PostSurveyDataDetails: newBenUrl + "api/Survey/InsertSurveyDataDetails",
            GetSyncStatus: newBenUrl + "api/Sync/GetSyncStatus"
        },
        getState: function (stateID) {
            switch (stateID) {
                case 1:
                    stateID = 69;
                    break;

                case 69:
                    stateID = 1;
                    break;

                case 2:
                    stateID = 39;
                    break;
                case 39:
                    stateID = 2;
                    break;
                case 3:
                    stateID = 40;
                    break;
                case 40:
                    stateID = 3;
                    break;
                case 4:
                    stateID = 41;
                    break;
                case 41:
                    stateID = 4;
                    break;
                case 5:
                    stateID = 42;
                    break;
                case 42:
                    stateID = 5;
                    break;

                case 6:
                    stateID = 70;
                    break;

                case 70:
                    stateID = 6;
                    break;
                case 7:
                    stateID = 43;
                    break;

                case 43:
                    stateID = 7;
                    break;
                case 8:
                    stateID = 71;
                    break;
                case 9:
                    stateID = 72;
                    break;
                case 10:
                    stateID = 74;
                    break;
                case 11:
                    stateID = 44;
                    break;
                case 12:
                    stateID = 46;
                    break;
                case 13:
                    stateID = 47;
                    break;
                case 14:
                    stateID = 48;
                    break;
                case 15:
                    stateID = 49;
                    break;
                case 16:
                    stateID = 50;
                    break;
                case 17:
                    stateID = 51;
                    break;
                case 18:
                    stateID = 52;
                    break;
                case 19:
                    stateID = 73;
                    break;
                case 20:
                    stateID = 53;
                    break;
                case 21:
                    stateID = 54;
                    break;
                case 22:
                    stateID = 56;
                    break;
                case 23:
                    stateID = 57;
                    break;
                case 24:
                    stateID = 58;
                    break;
                case 25:
                    stateID = 59;
                    break;
                case 26:
                    stateID = 60;
                    break;
                case 27:
                    stateID = 75;
                    break;
                case 28:
                    stateID = 61;
                    break;
                case 29:
                    stateID = 62;
                    break;
                case 30:
                    stateID = 63;
                    break;
                case 31:
                    stateID = 64;
                    break;
                case 32:
                    stateID = 65;
                    break;
                case 33:
                    stateID = 66;
                    break;
                case 34:
                    stateID = 67;
                    break;
                case 35:
                    stateID = 55;
                    break;
                case 36:
                    stateID = 68;
                    break;

            }
            return stateID;
        },
        getDistrict: function (districtID) {
            switch (districtID) {
                case 481:
                    districtID = 682;
                    break;
                // MP Districts
                case 299: districtID = 782; break;
                case 300: districtID = 777; break;
                case 301: districtID = 776; break;
                case 302: districtID = 772; break;
                case 303: districtID = 747; break;
                case 304: districtID = 755; break;
                case 305: districtID = 748; break;
                case 306: districtID = 746; break;
                case 307: districtID = 735; break;
                case 308: districtID = 775; break;
                case 309: districtID = 744; break;
                case 310: districtID = 739; break;
                case 311: districtID = 762; break;
                case 312: districtID = 774; break;
                case 313: districtID = 749; break;
                case 314: districtID = 738; break;
                case 315: districtID = 778; break;
                case 316: districtID = 764; break;
                case 317: districtID = 740; break;
                case 318: districtID = 781; break;
                case 319: districtID = 763; break;
                case 320: districtID = 732; break;
                case 321: districtID = 733; break;
                case 322: districtID = 770; break;
                case 323: districtID = 761; break;
                case 324: districtID = 760; break;
                case 325: districtID = 743; break;
                case 326: districtID = 769; break;
                case 327: districtID = 757; break;
                case 328: districtID = 742; break;
                case 329: districtID = 767; break;
                case 330: districtID = 773; break;
                case 331: districtID = 771; break;
                case 332: districtID = 758; break;
                case 333: districtID = 750; break;
                case 334: districtID = 753; break;
                case 335: districtID = 736; break;
                case 336: districtID = 734; break;
                case 337: districtID = 737; break;
                case 338: districtID = 759; break;
                case 339: districtID = 756; break;
                case 340: districtID = 768; break;
                case 341: districtID = 751; break;
                case 342: districtID = 779; break;
                case 343: districtID = 745; break;
                case 344: districtID = 766; break;
                case 345: districtID = 765; break;
                case 346: districtID = 754; break;
                case 347: districtID = 741; break;
                case 348: districtID = 780; break;
                case 349: districtID = 752; break;
                //Jharkhand Districts
                case 231: districtID = 712; break;
                case 232: districtID = 722; break;
                case 233: districtID = 716; break;
                case 234: districtID = 709; break;
                case 235: districtID = 718; break;
                case 236: districtID = 711; break;
                case 237: districtID = 717; break;
                case 238: districtID = 710; break;
                case 239: districtID = 719; break;
                case 240: districtID = 723; break;
                case 241: districtID = 714; break;
                case 242: districtID = 726; break;
                case 243: districtID = 730; break;
                case 244: districtID = 728; break;
                case 245: districtID = 727; break;
                case 246: districtID = 731; break;
                case 247: districtID = 725; break;
                case 248: districtID = 713; break;
                case 249: districtID = 724; break;
                case 250: districtID = 708; break;
                case 251: districtID = 720; break;
                case 252: districtID = 721; break;
                case 253: districtID = 729; break;
                case 254: districtID = 715; break;


            }
            return districtID;
        },
        ajaxCallUrl: function (serviceUrl, serviceType, callback) {

            $.ajax({
                url: serviceUrl,
                type: serviceType,
                //data: JSON.stringify(objData),
                cache: false,
                contentType: 'application/json',
                crossdomain: true,
                async: false,
                success: function (data) {

                    callback(data);
                },
                error: function (error) {

                    callback(error);
                }
            });

        },
        ajaxCall: function (serviceUrl, serviceType, objData, callback) {

            $.ajax({
                url: serviceUrl,
                type: serviceType,
                data: JSON.stringify(objData),
                cache: false,
                contentType: 'application/json',
                crossdomain: true,
                async: true,
                success: function (data) {

                    callback(data);
                },
                error: function (error) {

                    callback(error);
                }
            });

        },
        validate: {
            email: function (data) {
                var result = false;
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                result = re.test(data);
                return result;
            },
            phone: function (data) {
                var result = false;
                var reg = /^\d+$/;
                result = reg.test(data);
                return result;
                var reg = /^\d+$/;

            },
            empty: function (field) {
                if (field.length > 0)
                    return true;
                else
                    return false;
            },
            date: function (data) {

                var value = Date.parse(data);
                if (isNaN(value) == true) {
                    return false;
                }
                else {
                    value = new Date(data);
                    return !isNaN(value.valueOf());
                }
            },
            isZero: function (data) {
                if (data <= 0)
                    return false;
                else
                    return true;
            },
            numbers: function (evt) {
                var charCode = (evt.which) ? evt.which : event.keyCode;
                if ((charCode < 48 || charCode > 57))
                    return false;

                return true;
            }

        },
        comparison: {
            strings: function (a, b) {
                return a === b;
            }
        },
        sessionStorage: function () {
            var _storage = window.sessionStorage;
            var _ds = {
                storageTye: {
                    localStorage: 0,
                    sessionStorage: 1
                },
                setStorageStrategy: function (strategy) {
                    _storage = strategy;
                },
                exists: function (key) {
                    return _storage[key] !== 'undefined';
                },
                get: function (key) {
                    var returnVal = null, value;
                    if (_ds.exists(key)) {
                        value = _storage[key];
                        try {
                            returnVal = JSON.parse(value);
                        } catch (e) {
                            if (e.constructor.name === 'SyntaxError') {
                                returnVal = value;
                            }
                            else {
                                returnVal = value;
                            }

                        }
                    }
                    return returnVal;
                },
                set: function (key, value) {
                    if (typeof value === 'object') {
                        _storage[key] = JSON.stringify(value);
                    }
                    else {
                        _storage[key] = value;
                    }

                }
            };
            return _ds;
        },
        localStorage: function () {
            var _storage = window.localStorage;
            var _ds = {
                storageTye: {
                    localStorage: 0,
                    sessionStorage: 1
                },
                setStorageStrategy: function (strategy) {
                    _storage = strategy;
                },
                exists: function (key) {
                    return _storage[key] !== 'undefined';
                },
                get: function (key) {
                    var returnVal = null, value;
                    if (_ds.exists(key)) {
                        value = _storage[key];
                        try {
                            returnVal = JSON.parse(value);
                        } catch (e) {
                            if (e.constructor.name === 'SyntaxError') {
                                returnVal = value;
                            }
                            else {
                                returnVal = value;
                            }

                        }
                    }
                    return returnVal;
                },
                set: function (key, value) {
                    if (typeof value === 'object') {
                        _storage[key] = JSON.stringify(value);
                    }
                    else {
                        _storage[key] = value;
                    }

                }
            };
            return _ds;
        },
        pureBase64: function (data) {
            return data.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        },
        getImage: function (data) {
            return "data:image/jpeg;base64," + data;
        },
        toDate: function (data) {
            var date = new Date(data);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var year = date.getFullYear();
            if (year == 0) {
                return '';
            }
            var shortDate = day + "/" + month + "/" + year;
            return shortDate;
        },
        toPaddedDate: function (data) {
            var date = new Date(data);
            var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1);
            var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
            var year = date.getFullYear();
            if (year == 0) {
                return '';
            }
            var shortDate = day + "/" + month + "/" + year;
            return shortDate;
        },
        zeroToEmpty: function (data) {
            if (data == '0') {
                return '';
            }
            else {
                return data;
            }
        },
        imageToBase64: function (url, image) {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function () {
                var reader = new FileReader();
                reader.onloadend = function () {
                    image.src = reader.result;
                }
                reader.readAsDataURL(xhr.response);
            };
            xhr.open('GET', url);
            xhr.send();
        },
        bindDropDownById: function (itemList, obj, dropDown) {

            var listItems = "";
            $.each(itemList, function (i, data) {
                if (data.ID == 1 || data.ID == 9)
                    listItems += "<option selected='true' disabled='disabled' value='" + data.ID + "'>" + data.Name + "</option>";
            });
            $('#' + dropDown).html(listItems);
        },
        bindDropDown: function (itemList, obj, dropDown) {

            var listItems = "";
            listItems += "<option value='-1' selected='true' disabled='disabled'>" + obj + "</option>";
            //for (var i = 0; i < itemList.length; i++) {
            //    listItems += "<option value='" + itemList[i].ID + "'>" + itemList[i].Name + "</option>";
            //}
            $.each(itemList, function (i, data) {
                listItems += "<option value='" + data.ID + "'>" + data.Name + "</option>";
            });
            $('#' + dropDown).html(listItems);
        },
        isMobile: function () {
            var isMobileDevice = function () {
                var check = false;
                (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
                return check;
            };
            return isMobileDevice();

        },
        IsOnline: function () {
            $.ajax({
                url: utils.Urls.IsOnline,
                type: 'GET',
                cache: false,
                contentType: 'application/json',
                crossdomain: true,
                async: false,
                success(data) {
                    // alert(data);
                    return data;
                }
            });
        },
        bindRadioButton: function (itemList, obj, divId) {
            var listItems = "";
            $.each(itemList, function (i, data) {
                var uniqueID = obj + "-" + data.ID;
                listItems += '<input type="radio" name="' + obj + '" id="' + uniqueID + '" value="' + data.Name + '"><label for="' + uniqueID + '" class="label-radio">' + data.Name + '</label><br/>';
            });

            $('#' + divId).append(listItems);
            $('#' + divId).append("<div class=\"clearboth25\"></div>");

        },
        getGUID: function () {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
                d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        },
        randomNum: function () {
            var min = 10000000;
            var max = 99999999;
            var num = Math.floor(Math.random() * (max - min + 1)) + min;
            return num;
        },
        smallRandomNum: function () {
            var min = 10;
            var max = 999;
            var num = Math.floor(Math.random() * (max - min + 1)) + min;
            return num;
        },
        matchLength: function (len, str) {
            return validation.isLengthMatch(len, str);
        },
        isPureNum: function (str) {
            return validation.isNumeric(str);
        },
        isPureEnglish: function (str) {
            if (str.length == 0) return true;
            var regex = new RegExp("^[a-zA-Z .]+$");

            if (!regex.test(str)) {
                event.preventDefault();
                return false;
            }
            return true;
        },
        getAge: function (date) {

            var years = new Date(new Date() - new Date(date)).getFullYear() - 1970;
            return years;
        },
        today: function () {
            var param = new Date();
            var day = param.getDate() > 9 ? param.getDate() : '0' + param.getDate();
            var month = (param.getMonth() + 1) > 9 ? param.getMonth() + 1 : '0' + (param.getMonth() + 1);
            var today = day + '/' + month + '/' + param.getFullYear();
            return today;
        }
    }
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        window.dataLayer = window.dataLayer || [];

        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-LLFW6FG6QY');
    }
    utils.Analytics = {
        trackPage: function (page) {
            try {
                window.analytics.startTrackerWithId('G-LLFW6FG6QY', 7200);
                window.analytics.trackView(page);
                //window.ga.trackView(page);
            } catch (e) {
                console.log(JSON.stringify(e));
            }

        },
        trackEvent: function (event) {
            try {
                window.analytics.startTrackerWithId('G-LLFW6FG6QY', 7200);
                window.analytics.trackEvent(event.Category, event.Action, event.Label, event.Value, true);
            } catch (e) {
                console.log(JSON.stringify(e));
            }


        },
        trackUser: function (user) {
            try {
                window.analytics.startTrackerWithId('G-LLFW6FG6QY', 7200);
                window.analytics.setUserId(user);
            } catch (e) {
                console.log(JSON.stringify(e));
            }

        },
        trackException: function (ex) {
            try {
                window.analytics.startTrackerWithId('G-LLFW6FG6QY', 7200);
                window.analytics.trackException(ex.Desc, ex.Type);
            } catch (e) {
                console.log(JSON.stringify(e));
            }

        }
    };
})(jQuery);



