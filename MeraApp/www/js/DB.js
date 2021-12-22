function GetSyncStatus() {
    var user = utils.localStorage().get('user');
    var extn = '?syncFunction=GETSCHEMES&userName=' + user.userName;
    $.ajax({
        url: utils.Urls.GetSyncStatus + extn,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            if (data.SyncStatus)
                db.transaction(PopulateScheme, schemeError);
        },
        error: function (error) {
            // alert('Could not sync Language. Please try later.');
        }
    });
}
function PopulateLanguages(tx) {
    //
    $.ajax({
        url: utils.Urls.GetLanguage,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS LanguageMaster');
            tx.executeSql('CREATE TABLE IF NOT EXISTS LanguageMaster (ID, Name, Description)');
            $.each(data, function (i, dat) {
                var description = data[i].Description.replace(/'/g, '"');
                var stmt = "INSERT INTO LanguageMaster (ID, Name, Description) VALUES (" + data[i].ID + ",'" + data[i].Name + "','" + description + "')";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            // alert('Could not sync Language. Please try later.');
        }
    });

}

function GetAnalyticsMaster(tx) {
    $.ajax({
        url: utils.Urls.AnalyticsMasterUrl,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS AnalyticsMaster');
            tx.executeSql('CREATE TABLE IF NOT EXISTS AnalyticsMaster (AnalyticsCode, Description)');
            $.each(data, function (i, dat) {
                var description = data[i].Description.replace(/'/g, '"');
                var stmt = "INSERT INTO AnalyticsMaster (AnalyticsCode, Description) VALUES ('" + data[i].AnalyticsCode + "','" + description + "')";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            // alert('Could not sync Language. Please try later.');
        }
    });

}

function CreateAnalyticsApp(tx) {
    //tx.executeSql('DROP TABLE IF EXISTS AnalyticsApp');
    tx.executeSql('CREATE TABLE IF NOT EXISTS AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)');

}

function PopulateFavorite(tx) {
    var user = utils.localStorage().get('user');

    var LangId = utils.localStorage().get('LangID');
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
        LangId = user.LangId;
    }

    $.ajax({
        url: utils.Urls.GetFavourite + user.userName + "&LangId=" + LangId,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS FavouriteSchemes');
            tx.executeSql('CREATE TABLE IF NOT EXISTS FavouriteSchemes (ID, LangId, Keywords,Objective,SchemeName, UnSchemeId)');
            $.each(data, function (i, dat) {
                var Keywords = data[i].Keywords.replace(/'/g, '"');
                var Objective = data[i].Objective.replace(/'/g, '"');
                var SchemeName = data[i].SchemeName.replace(/'/g, '"');
                var stmt = "INSERT INTO FavouriteSchemes (ID, LangId, Keywords,Objective,SchemeName, UnSchemeId) VALUES (" + data[i].ID + "," + data[i].LangId + ",'" + Keywords + "','" + Objective + "','" + SchemeName + "','" + data[i].UnSchemeId + "')";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            //alert('Could not sync Language. Please try later.');
        }
    });
}

function PopulateBeneficiaryApplied(tx) {
    var user = utils.localStorage().get('user');

    var LangId = 1;
    LangId = utils.localStorage().get('LangID');

    $.ajax({
        url: utils.Urls.PopulateBeneficiaryApplied + user.userName,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS BeneficiaryApplied');
            tx.executeSql('CREATE TABLE IF NOT EXISTS BeneficiaryApplied (ID, SchemeId, BeneficiaryId, UserId, Status,DateApplied)');
            $.each(data, function (i, dat) {
                var stmt = "INSERT INTO BeneficiaryApplied (ID, SchemeId, BeneficiaryId, UserId, Status, DateApplied) VALUES (" + data[i].ID + "," + data[i].SchemeId + "," + data[i].BeneficiaryId + ",'" + data[i].UserId + "'," + data[i].Status + ",'" + data[i].DateApplied + "')";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            // alert('Could not sync BeneficiaryApplied. Please try later.');
        }
    });
}

function PopulateSubBeneficiary(tx) {
    var user = utils.localStorage().get('user');
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    $.ajax({
        url: utils.Urls.GetSubBeneficiary + user.userName,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SubBeneficiary');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SubBeneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, Qualification, DateOfRegistration, EngDistrictId, Block, Panchayat, Village)');
            $.each(data, function (i, dat) {
                var qualification = data[i].Qualification == '' ? 0 : data[i].Qualification;
                var dateOfRegistration = (data[i].DateOfRegistration != null && data[i].DateOfRegistration.length > 0) ? data[i].DateOfRegistration.slice(0, 10).replace(/-/g, '/') : null;
                var stmt = "INSERT INTO SubBeneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, Qualification, DateOfRegistration, EngDistrictId, Block, Panchayat, Village) VALUES (" + data[i].Id + "," + data[i].BeneficiaryId + ",'" + data[i].FirstName + "','" + data[i].LastName + "','" + data[i].FathersName + "','" + data[i].HusbandsName + "','" + data[i].DOB + "'," + data[i].IDProof + ",'" + data[i].IDDetails + "'," + data[i].State + "," + data[i].District + "," + data[i].Sex + "," + data[i].Age + "," + data[i].Religion + "," + data[i].Socio + "," + data[i].Occupation + "," + data[i].MaritalStatus + "," + data[i].Category + "," + data[i].Department + "," + data[i].EmploymentStatus + "," + data[i].VulGroup + "," + data[i].AnnualIncome + "," + data[i].Disabilty + ",'" + data[i].SoochnaPreneur + "','" + data[i].Photo + "'," + data[i].Relationship + "," + data[i].Sickness + "," + data[i].PercentageDisablity + ",'" + data[i].Address + "','" + data[i].EMail + "','" + data[i].Phone + "','false'," + qualification + ",'" + dateOfRegistration + "'," + data[i].EngDistrictId + ",'" + data[i].Block + "','" + data[i].Panchayat + "','" + data[i].Village + "'" + ")";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            //  alert('Could not sync beneficiary data. Please try later.');
        }
    });
}

function PopulateBeneficiarySchemes(tx) {
    var user = utils.localStorage().get('user');

    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    $.ajax({
        url: utils.Urls.BeneficiarySchemes + user.userName,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS BeneficiarySchemes');
            tx.executeSql('CREATE TABLE IF NOT EXISTS BeneficiarySchemes (Id, BeneficiaryId, SchemeId, UnSchemeId, Keywords, Objective, SchemeName, AppliedStatus, LangID)');
            $.each(data, function (i, dat) {

                var Keywords = data[i].Keywords.replace(/'/g, '"');
                var Objective = data[i].Objective.replace(/'/g, '"');
                var SchemeName = data[i].SchemeName.replace(/'/g, '"');
                var stmt = "INSERT INTO BeneficiarySchemes (Id, BeneficiaryId, SchemeId, UnSchemeId, Keywords, Objective, SchemeName, AppliedStatus, LangID) ";
                stmt += "VALUES (" + dat.ID + "," + dat.BeneficiaryId + "," + dat.SchemeID + ",'" + dat.UnSchemeId + "','" + Keywords + "','" + Objective + "','" + SchemeName + "','" + dat.AppliedStatus + "'," + dat.LangID + ")";
                tx.executeSql(stmt);

            });
        },
        error: function (error) {
            //alert('Could not sync beneficiary data. Please try later.');
        }
    });
}

function PopulateBeneficiary(tx) {
    var user = utils.localStorage().get('user');

    var LangId = 1;
    LangId = utils.localStorage().get('LangID');

    $.ajax({
        url: utils.Urls.GetBeneficiary + user.userName + '&Beneficiary=0',
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS Beneficiary');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Beneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, Qualification, DateOfRegistration, EngDistrictId, Block, Panchayat, Village)');
            $.each(data, function (i, dat) {
                var qualification = data[i].Qualification == '' ? 0 : data[i].Qualification;
                var dateOfRegistration = (data[i].DateOfRegistration != null && data[i].DateOfRegistration.length > 0) ? data[i].DateOfRegistration.slice(0, 10).replace(/-/g, '/') : null;
                var stmt = "INSERT INTO Beneficiary (Id, Beneficiary, FirstName, LastName, FathersName, HusbandsName, DOB, IDProof, IDDetails, State, District, Sex, Age, Religion, Socio, Occupation, MaritalStatus, Category, Department, EmploymentStatus, VulGroup, AnnualIncome, Disabilty, SoochnaPreneur, Photo, Relationship, Sickness, PercentageDisablity, Address, EMail, Phone, IsUpdated, Qualification, DateOfRegistration,EngDistrictId,Block, Panchayat, Village) VALUES (" + data[i].Id + "," + data[i].BeneficiaryId + ",'" + data[i].FirstName + "','" + data[i].LastName + "','" + data[i].FathersName + "','" + data[i].HusbandsName + "','" + data[i].DOB + "'," + data[i].IDProof + ",'" + data[i].IDDetails + "'," + data[i].State + "," + data[i].District + "," + data[i].Sex + "," + data[i].Age + "," + data[i].Religion + "," + data[i].Socio + "," + data[i].Occupation + "," + data[i].MaritalStatus + "," + data[i].Category + "," + data[i].Department + "," + data[i].EmploymentStatus + "," + data[i].VulGroup + "," + data[i].AnnualIncome + "," + data[i].Disabilty + ",'" + data[i].SoochnaPreneur + "','" + data[i].Photo + "'," + data[i].Relationship + "," + data[i].Sickness + "," + data[i].PercentageDisablity + ",'" + data[i].Address + "','" + data[i].EMail + "','" + data[i].Phone + "','false'," + qualification + ",'" + dateOfRegistration + "'," + data[i].EngDistrictId + ",'" + data[i].Block + "','" + data[i].Panchayat + "','" + data[i].Village + "'" + ")";

                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            console.log("HERE : " + error);
            // alert('Could not sync beneficiary data. Please try later.');
        }
    });
}

function PopulateRecentScheme(tx) {
    var user = utils.localStorage().get('user');
    //;
    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    $.ajax({
        url: utils.Urls.GetRecentSearch + user.userName,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            //;
            tx.executeSql('DROP TABLE IF EXISTS RecentSchemes');
            tx.executeSql('CREATE TABLE IF NOT EXISTS RecentSchemes (ID, Keywords, Objective, SchemeName, UnSchemeId, LangId)');
            $.each(data, function (i, dat) {
                var Keywords = data[i].Keywords.replace(/'/g, '"');
                var Objective = data[i].Objective.replace(/'/g, '"');
                var SchemeName = data[i].SchemeName.replace(/'/g, '"');

                var stmt = "INSERT INTO RecentSchemes (ID, Keywords, Objective, SchemeName, UnSchemeId, LangId) VALUES (" + data[i].ID + ",'" + Keywords + "','" + Objective + "','" + SchemeName + "','" + data[i].UnSchemeId + "'," + data[i].LangId + ")";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            //;
            // alert('Could not sync Recent Schemes. Please try later.');
        }
    });
}
function getMobileNumber(mob) {
    var len = mob.length;
    var mobNumer = '';
    if (len > 10) {
        mobNumer = mob.substring(len - 10, len);
    }
    else {
        mobNumer = mob;
    }
    return mobNumer;
}
function PopulateUsers(tx) {
    //var deviceDetails = utils.localStorage().get('deviceDetails');
    //details.geolocation = utils.localStorage().get('position');
    //var setSimInfo = utils.localStorage().get('simInfo');
    //var userName = '1234512345';
    //var IMEI = '35412365478964625452';
    //if (setSimInfo != null) {
    //    userName = getMobileNumber(setSimInfo.cards[0].phoneNumber);
    //    IMEI = setSimInfo.cards[0].deviceId;

    //}

    $.ajax({
        url: utils.Urls.GetAppUsers,
        //type: 'POST',
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        //  data: { 'userName': userName, 'IMEI': IMEI },
        // dataType: 'json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS USERS');
            tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (UserName, Password, FirstName, LastName, MobileNumber, Email, Address, StateID, DistrictID, PinCode, Organization, RoleID, DeviceID, Status, PackageID, IsDeleted, CreatedDate, LastModifiedDate, Gender, OccupationID, IncomeLevel, MonthlyFamilyIncome, ReligonID, CategoryID, Photo, IMEI)');
            $.each(data, function (i, dat) {
                var stmt = "INSERT INTO USERS (UserName, Password, FirstName, LastName, MobileNumber, Email, Address, StateID, DistrictID, PinCode, Organization, RoleID, DeviceID, Status, PackageID, IsDeleted, CreatedDate, LastModifiedDate, Gender, OccupationID, IncomeLevel, MonthlyFamilyIncome, ReligonID, CategoryID, Photo, IMEI ) VALUES ('" + data[i].UserName + "','" + data[i].Password + "','" + data[i].FirstName + "','" + data[i].LastName + "','" + data[i].Phone + "','" + data[i].EMail + "','" + data[i].Address + "'," + data[i].StateID + "," + data[i].DistrictID + ",'" + data[i].PinCode + "','" + data[i].Organization + "'," + data[i].RoleID + "," + null + ",'" + data[i].Status + "'," + null + ",'" + data[i].IsDeleted + "','" + data[i].CreatedDate + "','" + data[i].LastModifiedDate + "'," + null + "," + null + "," + null + "," + null + "," + null + "," + null + ",'" + data[i].Photo + "','" + data[i].IMEI + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            // alert('Could not sync User. Please try later.');
        }
    });

}

function PopulateMasters(tx) {
    var ajaxObj = {
        url: utils.Urls.GetBeneficiaryDtls,
        type: 'GET'
    };
    var primaryBeneficiary = utils.localStorage().get('primaryBeneficiary');
    var AllData = new Array();



    $.ajax({
        url: utils.Urls.GetBeneficiaryDtls,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {



            tx.executeSql('DROP TABLE IF EXISTS Age');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Age (ID, Name, LangID)');

            $.each(data.Ages, function (i, dat) {
                var Ages = "INSERT INTO Age (ID, Name, LangID) VALUES ('" + data.Ages[i].ID + "','" + data.Ages[i].Name + "','" + data.Ages[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Ages);
            });

            tx.executeSql('DROP TABLE IF EXISTS Religion');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Religion (ID, Name, LangID)');

            $.each(data.Religions, function (i, dat) {
                var Religions = "INSERT INTO Religion (ID, Name, LangID) VALUES ('" + data.Religions[i].ID + "','" + data.Religions[i].Name + "','" + data.Religions[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Religions);
            });

            tx.executeSql('DROP TABLE IF EXISTS Sickness');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Sickness (ID, Name, LangID)');

            $.each(data.Sicknesses, function (i, dat) {
                var Sicknesses = "INSERT INTO Sickness (ID, Name, LangID) VALUES ('" + data.Sicknesses[i].ID + "','" + data.Sicknesses[i].Name + "','" + data.Sicknesses[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Sicknesses);
            });

            tx.executeSql('DROP TABLE IF EXISTS IncomeLevel');
            tx.executeSql('CREATE TABLE IF NOT EXISTS IncomeLevel (ID, Name, LangID)');

            $.each(data.SocioStatuses, function (i, dat) {
                var SocioStatuses = "INSERT INTO IncomeLevel (ID, Name, LangID) VALUES ('" + data.SocioStatuses[i].ID + "','" + data.SocioStatuses[i].Name + "','" + data.SocioStatuses[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(SocioStatuses);
            });

            tx.executeSql('DROP TABLE IF EXISTS Occupation');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Occupation (ID, Name, LangID)');

            $.each(data.Occupations, function (i, dat) {
                var Occupations = "INSERT INTO Occupation (ID, Name, LangID) VALUES ('" + data.Occupations[i].ID + "','" + data.Occupations[i].Name + "','" + data.Occupations[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Occupations);
            });

            tx.executeSql('DROP TABLE IF EXISTS MaritalStatus');
            tx.executeSql('CREATE TABLE IF NOT EXISTS MaritalStatus (ID, Name, LangID)');

            $.each(data.MaritalStatuses, function (i, dat) {
                var MaritalStatuses = "INSERT INTO MaritalStatus (ID, Name, LangID) VALUES ('" + data.MaritalStatuses[i].ID + "','" + data.MaritalStatuses[i].Name + "','" + data.MaritalStatuses[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(MaritalStatuses);
            });

            tx.executeSql('DROP TABLE IF EXISTS Category');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Category (ID, Name, LangID)');

            $.each(data.Categories, function (i, dat) {
                var Categories = "INSERT INTO Category (ID, Name, LangID) VALUES ('" + data.Categories[i].ID + "','" + data.Categories[i].Name + "','" + data.Categories[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Categories);
            });

            tx.executeSql('DROP TABLE IF EXISTS Department');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Department (ID, Name, LangID, StateId)');

            $.each(data.Departments, function (i, dat) {
                var Departments = "INSERT INTO Department (ID, Name, LangID, StateId) VALUES ('" + data.Departments[i].ID + "','" + data.Departments[i].Name + "','" + data.Departments[i].LangID + "','" + data.Departments[i].StateId + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Departments);
            });

            tx.executeSql('DROP TABLE IF EXISTS EmpStatus');
            tx.executeSql('CREATE TABLE IF NOT EXISTS EmpStatus (ID, Name, LangID)');

            $.each(data.EmpStatuses, function (i, dat) {
                var EmpStatuses = "INSERT INTO EmpStatus (ID, Name, LangID) VALUES ('" + data.EmpStatuses[i].ID + "','" + data.EmpStatuses[i].Name + "','" + data.EmpStatuses[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(EmpStatuses);
            });

            tx.executeSql('DROP TABLE IF EXISTS VulnerableGroup');
            tx.executeSql('CREATE TABLE IF NOT EXISTS VulnerableGroup (ID, Name, LangID)');

            $.each(data.VulnerableGroups, function (i, dat) {
                var VulnerableGroups = "INSERT INTO VulnerableGroup (ID, Name, LangID) VALUES ('" + data.VulnerableGroups[i].ID + "','" + data.VulnerableGroups[i].Name + "','" + data.VulnerableGroups[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(VulnerableGroups);
            });

            tx.executeSql('DROP TABLE IF EXISTS IDProofDocuments');
            tx.executeSql('CREATE TABLE IF NOT EXISTS IDProofDocuments (ID, Name, LangID)');

            $.each(data.IDProofs, function (i, dat) {
                var IDProofs = "INSERT INTO IDProofDocuments (ID, Name, LangID) VALUES ('" + data.IDProofs[i].ID + "','" + data.IDProofs[i].Name + "','" + data.IDProofs[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(IDProofs);
            });

            tx.executeSql('DROP TABLE IF EXISTS Sex');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Sex (ID, Name, LangID)');

            $.each(data.Sex, function (i, dat) {
                var Sex = "INSERT INTO Sex (ID, Name, LangID) VALUES ('" + data.Sex[i].ID + "','" + data.Sex[i].Name + "','" + data.Sex[i].LangId + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Sex);
            });

            tx.executeSql('DROP TABLE IF EXISTS Disablity');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Disablity (ID, Name, LangID)');

            $.each(data.Disabilities, function (i, dat) {
                var Disabilities = "INSERT INTO Disablity (ID, Name, LangID) VALUES ('" + data.Disabilities[i].ID + "','" + data.Disabilities[i].Name + "','" + data.Disabilities[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Disabilities);
            });


            tx.executeSql('DROP TABLE IF EXISTS State');
            tx.executeSql('CREATE TABLE IF NOT EXISTS State (ID, StateName, LangID, EngStateId)');

            $.each(data.States, function (i, dat) {
                var States = "INSERT INTO State (ID, StateName, LangID, EngStateId ) VALUES ('" + data.States[i].StateID + "','" + data.States[i].StateName + "','" + data.States[i].LangId + "','" + data.States[i].EngStateId + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(States);
            });

            tx.executeSql('DROP TABLE IF EXISTS Districts');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Districts (StateID, StateName, DistrictID, DistrictName, LangID, EngDistrictId)');

            $.each(data.Districts, function (i, dat) {
                var Districts = "INSERT INTO Districts (StateID, StateName, DistrictID, DistrictName, LangID, EngDistrictId ) VALUES ('" + data.Districts[i].StateID + "','" + data.Districts[i].StateName + "','" + data.Districts[i].DistrictID + "','" + data.Districts[i].DistrictName + "','" + data.Districts[i].LangID + "','" + data.Districts[i].EngDistrictId + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Districts);
            });

            tx.executeSql('DROP TABLE IF EXISTS Qualification');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Qualification (ID, Name, LangID)');

            $.each(data.Qualifications, function (i, dat) {
                var Qualifications = "INSERT INTO Qualification (ID, Name, LangID ) VALUES ('" + data.Qualifications[i].ID + "','" + data.Qualifications[i].Name + "','" + data.Qualifications[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Qualifications);
            });

            tx.executeSql('DROP TABLE IF EXISTS Relationship');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Relationship (ID, Name, LangID)');

            $.each(data.Relationships, function (i, dat) {
                var Relationships = "INSERT INTO Relationship (ID, Name, LangID ) VALUES ('" + data.Relationships[i].ID + "','" + data.Relationships[i].Name + "','" + data.Relationships[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Relationships);
            });

            tx.executeSql('DROP TABLE IF EXISTS Domain');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Domain (ID, Name, LangID, EngId)');

            $.each(data.Domains, function (i, dat) {
                var Domains = "INSERT INTO Domain (ID, Name, LangID, EngId ) VALUES ('" + data.Domains[i].ID + "','" + data.Domains[i].Name + "','" + data.Domains[i].LangID + "'," + data.Domains[i].EngId + ")";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(Domains);
            });

            tx.executeSql('DROP TABLE IF EXISTS District');
            tx.executeSql('CREATE TABLE IF NOT EXISTS District (ID, DistrictName, StateID, LangID, EngDistrictId)');

            $.each(data.MasterDistricts, function (i, dat) {
                var MasterDistricts = "INSERT INTO District (ID, DistrictName, StateID, LangID,EngDistrictId ) VALUES ('" + data.MasterDistricts[i].DistrictID + "','" + data.MasterDistricts[i].DistrictName + "','" + data.MasterDistricts[i].StateID + "','" + data.MasterDistricts[i].LangId + "'," + data.MasterDistricts[i].EngDistrictId + ")";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(MasterDistricts);
            });

            tx.executeSql('DROP TABLE IF EXISTS SchemeOriginator');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SchemeOriginator (ID, Name, LangID)');

            $.each(data.GetSchemeOriginator, function (i, dat) {
                var GetSchemeOriginator = "INSERT INTO SchemeOriginator (ID, Name, LangID ) VALUES ('" + data.GetSchemeOriginator[i].ID + "','" + data.GetSchemeOriginator[i].Name + "','" + data.GetSchemeOriginator[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(GetSchemeOriginator);
            });

            tx.executeSql('DROP TABLE IF EXISTS AddressProofDocuments');
            tx.executeSql('CREATE TABLE IF NOT EXISTS AddressProofDocuments (ID, Name, LangID)');

            $.each(data.GetAddressProofDoc, function (i, dat) {
                var GetAddressProofDoc = "INSERT INTO AddressProofDocuments (ID, Name, LangID ) VALUES ('" + data.GetAddressProofDoc[i].ID + "','" + data.GetAddressProofDoc[i].Name + "','" + data.GetAddressProofDoc[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(GetAddressProofDoc);
            });

            tx.executeSql('DROP TABLE IF EXISTS PaymentMode');
            tx.executeSql('CREATE TABLE IF NOT EXISTS PaymentMode (ID, Name, LangID)');

            $.each(data.GetPaymentMode, function (i, dat) {
                var GetPaymentMode = "INSERT INTO PaymentMode (ID, Name, LangID ) VALUES ('" + data.GetPaymentMode[i].ID + "','" + data.GetPaymentMode[i].Name + "','" + data.GetPaymentMode[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(GetPaymentMode);
            });

            tx.executeSql('DROP TABLE IF EXISTS PaymentLocation');
            tx.executeSql('CREATE TABLE IF NOT EXISTS PaymentLocation (ID, Name, PaymentModeID, LangID)');

            $.each(data.GetPaymentLocation, function (i, dat) {
                var GetPaymentLocation = "INSERT INTO PaymentLocation (ID, Name, PaymentModeID, LangID ) VALUES ('" + data.GetPaymentLocation[i].ID + "','" + data.GetPaymentLocation[i].Name + "','" + data.GetPaymentLocation[i].PaymentModeID + "','" + data.GetPaymentLocation[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(GetPaymentLocation);
            });

            tx.executeSql('DROP TABLE IF EXISTS FundDisbursementTime');
            tx.executeSql('CREATE TABLE IF NOT EXISTS FundDisbursementTime (ID, Name, LangID)');

            $.each(data.GetFundDisbursementTime, function (i, dat) {
                var GetFundDisbursementTime = "INSERT INTO FundDisbursementTime (ID, Name, LangID ) VALUES ('" + data.GetFundDisbursementTime[i].ID + "','" + data.GetFundDisbursementTime[i].Name + "','" + data.GetFundDisbursementTime[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(GetFundDisbursementTime);
            });

            tx.executeSql('DROP TABLE IF EXISTS BenefitFrequency');
            tx.executeSql('CREATE TABLE IF NOT EXISTS BenefitFrequency (ID, Name, LangID)');

            $.each(data.GetBenefitFrequency, function (i, dat) {
                var GetBenefitFrequency = "INSERT INTO BenefitFrequency (ID, Name, LangID ) VALUES ('" + data.GetBenefitFrequency[i].ID + "','" + data.GetBenefitFrequency[i].Name + "','" + data.GetBenefitFrequency[i].LangID + "')";
                //console.log(i + ' ->' + stmt);
                tx.executeSql(GetBenefitFrequency);
            });
            $('#myModal').modal('hide');
            $('#SyncUpdateProgress').hide();

        },
        error: function (error) {
            //   alert('Could not sync User. Please try later.');
        }
    });

    //var callBack = function (data) {
    //    //
    //    //utils.bindDropDown(data.Ages, 'Age', 'Age'); //
    //    ////utils.bindDropDown(data.Castes, 'Caste', 'Caste'); //
    //    //utils.bindDropDown(data.Categories, 'Category', 'Category'); //
    //    //utils.bindDropDown(data.Departments, 'Department', 'Department'); //
    //    //utils.bindDropDown(data.EmpStatuses, 'Employment Status', 'EmploymentStatus');
    //    //utils.bindDropDown(data.VulnerableGroups, 'Special Group', 'SpecialGroup');
    //    //utils.bindDropDown(data.MaritalStatuses, 'Marital Status', 'MaritalStatus');
    //    //utils.bindDropDown(data.IDProofs, 'User ID Proof (Optional)', 'IDProof'); //
    //    //utils.bindDropDown(data.Sex, 'Gender', 'Gender');
    //    //utils.bindDropDown(data.Religions, 'Religion', 'Religion');
    //    //utils.bindDropDown(data.Disabilities, 'Type of Disability', 'TypeofDisability');
    //    //utils.bindDropDown(data.Sicknesses, 'Sickness', 'Sickness');
    //    //utils.bindDropDown(data.SocioStatuses, 'Economic/Social Status', 'EconomicSocial');
    //    //utils.bindDropDown(data.Occupations, 'Occupation', 'Occupation');
    //    //utils.bindDropDown(data.Qualifications, 'Qualification', 'Qualification');
    //    //utils.bindDropDown(data.Relationships, 'Relationship*', 'Relationship');
    //    //bindStates(data.States, 'State *', 'State'); //
    //    //bindDistricts(data.Districts, 'District *', 'District');
    //    //AllData = JSON.parse(JSON.stringify(data.Districts));

    //};
}

function PopulateSearchMapping(tx) {
    $.ajax({
        url: utils.Urls.SearchMapping,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SearchMapping');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SearchMapping (Id, LangId, Name)');
            $.each(data, function (i, dat) {
                var Name = data[i].Name.replace(/'/g, '"');
                var stmt = "INSERT INTO SearchMapping (Id, LangId, Name) VALUES (" + data[i].Id + "," + data[i].LangId + ",'" + Name + "')";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            //  alert('Could not sync news. Please refresh.');
        }
    });

}

function PopulateNews(tx) {
    var user = utils.localStorage().get('user');

    var LangId = 1;
    LangId = utils.localStorage().get('LangID');

    $.ajax({
        url: utils.Urls.news + '?StateID=' + user.StateID + '&LangID=' + LangId,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS News');
            tx.executeSql('CREATE TABLE IF NOT EXISTS News (ID, NewsTitle, NewsDetails, PublishedDate, IsActive, Publisher, StateID, LangID)');
            $.each(data, function (i, dat) {
                var NewsDetails = data[i].NewsDetails.replace(/'/g, '"');
                var NewsTitle = data[i].NewsTitle.replace(/'/g, '"');
                var Publisher = data[i].Publisher.replace(/'/g, '"');
                var stmt = "INSERT INTO News (ID, NewsTitle, NewsDetails, PublishedDate, IsActive, Publisher, StateID, LangID ) VALUES (" + data[i].ID + ",'" + NewsTitle + "','" + NewsDetails + "','" + data[i].PublishedDate + "','" + data[i].IsActive + "','" + Publisher + "'," + user.StateID + "," + data[i].LangID + ")";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            //  alert('Could not sync news. Please refresh.');
        }
    });
}

function PopulateScheme(tx) {

    var user = utils.localStorage().get('user');
    $.ajax({
        // url: utils.Urls.GetSchemes + 'StateId=' + user.StateID,
        url: utils.Urls.GetSchemes + 'StateId=' + user.StateID + '&UserId=' + '' + user.userName + '',
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        timeout: 60000,
        success: function (data) {
            try {
                //debugger;
                tx.executeSql('DROP TABLE IF EXISTS Scheme');
                var CreateTable = 'CREATE TABLE IF NOT EXISTS Scheme (ID, UnSchemeId,SchemeName, SchemeStartDate, SchemeEndDate, LastAmendmentDate,Objective,BenefitsFrequencyID, ';
                CreateTable += ' NumberOfBenfeciaries,ApplicationFormAvailableDate,LastDateToGetApplicationForm,LastDateOfFormSubmission,BeneficiarySelectionAnnouncementDate, ';
                CreateTable += ' WhereDocumentSubmission,IsSchemeActive,OperatorRemark,ApproverRemark,AdminRemark,StateId,DistrictId,DepartmentId,DomainId,OriginatorId,MinAge,MaxAge, ';
                CreateTable += ' Sex,MaritalStatusID,IncomeId,AnnualFamilyIncome,OccupationId,CasteId,EmpStatusID,QualificationId,ReligonID,ApplicationFormUpload,LangID,CategoryID, '
                CreateTable += ' VulnerableID,DisabilityID,DisabilityPercent,Disease,FundDisbursed,IDProofDocumentID,AddressProofDocumentID,SicknessID,PaymentModeID,PaymentLocationID, ';
                CreateTable += ' FundDisburesementTimeID,FundDisbursementFrequencyID,ContactPerson,ContactEmailId,ContactNumber,SchemeStatus,OperatorName,ApproverName,Keywords, ';
                CreateTable += ' SubmissionDate,SpecialBasicDetailsAddon,SpecialEligibilityAddon,SpecialApplicationAddon,SpecialAdditionalAddon,IsSubmitted,IsPopular,ProcessingFee, IDProofComments, AddressProofComments, ';
                CreateTable += ' StateNames, DistrictNames, DepartmentNames, DomainNames, OriginatorNames, MaritalStatusNames, IncomeLevelNames, OccupationNames, CasteNames, EmpStatusNames, '
                CreateTable += ' QualificationNames, ReligonNames,SpecialStatusNames, DisablityNames, IDProofDocumentsNames, AddressProofDocumentsNames, SicknessNames, PaymentModeNames, '
                CreateTable += ' PaymentLocationNames, FundDisbursementTimeNames, BenefitFrequencyNames, SchemeURL, SchemeTypeId,SchemeTypeName)';
                tx.executeSql(CreateTable);

                $.each(data, function (i, dat) {
                    var Keywords = data[i].Keywords.replace(/'/g, '"');
                    var Objective = data[i].Objective.replace(/'/g, '"');
                    var SchemeName = data[i].SchemeName.replace(/'/g, '"');
                    var SpecialAdditionalAddon = data[i].SpecialAdditionalAddon.replace(/'/g, '"');
                    var SpecialApplicationAddon = data[i].SpecialApplicationAddon.replace(/'/g, '"');
                    var SpecialEligibilityAddon = data[i].SpecialEligibilityAddon.replace(/'/g, '"');
                    var SpecialBasicDetailsAddon = data[i].SpecialBasicDetailsAddon.replace(/'/g, '"');
                    var WhereDocumentSubmission = data[i].WhereDocumentSubmission.replace(/'/g, '"');
                    var IDProofComments = data[i].IDProofComments != null && data[i].IDProofComments != '' ? data[i].IDProofComments.replace(/'/g, '"') : '';
                    var ContactPerson = data[i].ContactPerson != null && data[i].ContactPerson != '' ? data[i].ContactPerson.replace(/'/g, '"') : '';
                    var AddressProofComments = data[i].AddressProofComments != null && data[i].AddressProofComments != '' ? data[i].AddressProofComments.replace(/'/g, '"') : '';
                    var AnnualFamilyIncome = data[i].AnnualFamilyIncome != null && data[i].AnnualFamilyIncome != '' ? data[i].AnnualFamilyIncome.replace(/'/g, '"') : '';
                    var stmt = "INSERT INTO Scheme (ID, UnSchemeId,SchemeName, SchemeStartDate, SchemeEndDate, LastAmendmentDate,Objective,BenefitsFrequencyID,NumberOfBenfeciaries, "
                    stmt += " ApplicationFormAvailableDate,LastDateToGetApplicationForm,LastDateOfFormSubmission,BeneficiarySelectionAnnouncementDate,WhereDocumentSubmission, "
                    stmt += " IsSchemeActive,OperatorRemark,ApproverRemark,AdminRemark,StateId,DistrictId,DepartmentId,DomainId,OriginatorId,MinAge,MaxAge,Sex,MaritalStatusID, "
                    stmt += " IncomeId,AnnualFamilyIncome,OccupationId,CasteId,EmpStatusID,QualificationId,ReligonID,ApplicationFormUpload,LangID,CategoryID,VulnerableID, "
                    stmt += " DisabilityID,DisabilityPercent,Disease,FundDisbursed,IDProofDocumentID,AddressProofDocumentID,SicknessID,PaymentModeID,PaymentLocationID, "
                    stmt += " FundDisburesementTimeID,FundDisbursementFrequencyID,ContactPerson, ContactEmailId,ContactNumber,SchemeStatus,OperatorName,ApproverName, "
                    stmt += " Keywords,SubmissionDate,SpecialBasicDetailsAddon,SpecialEligibilityAddon,SpecialApplicationAddon,SpecialAdditionalAddon,IsSubmitted,IsPopular, "
                    stmt += ' StateNames, DistrictNames, DepartmentNames, DomainNames, OriginatorNames, MaritalStatusNames, IncomeLevelNames, OccupationNames, CasteNames, EmpStatusNames, '
                    stmt += ' QualificationNames, ReligonNames,SpecialStatusNames, DisablityNames, IDProofDocumentsNames, AddressProofDocumentsNames, SicknessNames, PaymentModeNames, '
                    stmt += ' PaymentLocationNames, FundDisbursementTimeNames, BenefitFrequencyNames, SchemeURL, SchemeTypeId, SchemeTypeName, ProcessingFee, IDProofComments, AddressProofComments)'
                    stmt += " VALUES ("
                    stmt += data[i].ID + ",'" + data[i].UnSchemeId + "','" + SchemeName + "','" + data[i].SchemeStartDate + "','" + data[i].SchemeEndDate + "','";
                    stmt += data[i].LastAmendmentDate + "','" + Objective + "',";
                    stmt += data[i].BenefitsFrequencyID + "," + data[i].NumberOfBenfeciaries + ",'" + data[i].ApplicationFormAvailableDate + "','";
                    stmt += data[i].LastDateToGetApplicationForm + "','" + data[i].LastDateOfFormSubmission + "','" + data[i].BeneficiarySelectionAnnouncementDate + "','";
                    stmt += WhereDocumentSubmission + "','" + data[i].IsSchemeActive + "'," + null + "," + null + "," + null + ",'" + data[i].StateId + "','";
                    stmt += data[i].DistrictId + "'," + data[i].DepartmentId + "," + data[i].DomainId + ",'" + data[i].OriginatorId + "'," + data[i].MinAge + ",";
                    stmt += data[i].MaxAge + ",'" + data[i].Sex + "','" + data[i].MaritalStatusID + "','" + data[i].IncomeId + "','" + AnnualFamilyIncome + "','";
                    stmt += data[i].OccupationId + "','" + data[i].CasteId + "','" + data[i].EmpStatusID + "','" + data[i].QualificationId + "','" + data[i].ReligonID + "','";
                    stmt += data[i].ApplicationFormUpload + "'," + data[i].LangID + ",'" + data[i].CategoryID + "','" + data[i].VulnerableID + "','" + data[i].DisabilityID + "','";
                    stmt += data[i].DisabilityPercent + "','" + data[i].Disease + "','" + data[i].FundDisbursed + "','" + data[i].IDProofDocumentID + "','";
                    stmt += data[i].AddressProofDocumentID + "','" + data[i].SicknessID + "','" + data[i].PaymentModeID + "','" + data[i].PaymentLocationID + "',";
                    stmt += data[i].FundDisburesementTimeID + "," + data[i].FundDisbursementFrequencyID + ",'" + ContactPerson + "','" + data[i].ContactEmailId + "','";
                    stmt += data[i].ContactNumber + "','" + data[i].SchemeStatus + "'," + null + "," + null + ",'" + Keywords + "','" + data[i].SubmissionDate + "','";
                    stmt += SpecialBasicDetailsAddon + "','" + SpecialEligibilityAddon + "','" + SpecialApplicationAddon + "','" + SpecialAdditionalAddon + "','";
                    stmt += data[i].IsSubmitted + "','" + data[i].IsPopular + "','";
                    stmt += data[i].StateNames + "','" + data[i].DistrictNames + "','" + data[i].DepartmentNames + "','" + data[i].DomainNames + "','" + data[i].OriginatorNames + "','";
                    stmt += data[i].MaritalStatusNames + "','" + data[i].IncomeLevelNames + "','" + data[i].OccupationNames + "','" + data[i].CasteNames + "','" + data[i].EmpStatusNames + "','";
                    stmt += data[i].QualificationNames + "','" + data[i].ReligonNames + "','" + data[i].SpecialStatusNames + "','" + data[i].DisablityNames + "','";
                    stmt += data[i].IDProofDocumentsNames + "','" + data[i].AddressProofDocumentsNames + "','" + data[i].SicknessNames + "','" + data[i].PaymentModeNames + "','";
                    stmt += data[i].PaymentLocationNames + "','" + data[i].FundDisbursementTimeNames + "','" + data[i].BenefitFrequencyNames + "','" + data[i].SchemeURL + "'," + data[i].SchemeTypeId + ",'" + data[i].SchemeTypeName + "','" + data[i].ProcessingFee + "','" + IDProofComments + "','" + AddressProofComments + "')";
                    tx.executeSql(stmt);
                });
                // var MyDB = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
                // MyDB.transaction(queryPopularSchemes, errorCB);
                utils.localStorage().set('ShowPopular', false);
            }
            catch (e) {
                console.log(e);
            }

        },
        error: function (error) {
            //  alert('Could not sync Scheme. Please try later.');
        }
    });

}

function PopulateSchemeBenefits(tx) {
    var user = utils.localStorage().get('user');

    var LangId = 1;
    LangId = utils.localStorage().get('LangID');
    $.ajax({
        url: utils.Urls.GetSchemeBenefits + '?StateId=' + user.StateID,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SchemeBenefits');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SchemeBenefits (ID, Sex, MaritalStatus, BenefitTypeID, Details, LangID, SchemeID, MaxAge, MinAge)');
            $.each(data, function (i, dat) {
                var Details = data[i].Details.replace(/'/g, '"');

                var stmt = "INSERT INTO SchemeBenefits (ID, Sex, MaritalStatus, BenefitTypeID, Details, LangID, SchemeID, MaxAge, MinAge ) VALUES (" + data[i].ID + ",'" + data[i].Sex + "','" + data[i].MaritalStatus + "'," + data[i].BenefitTypeID + ",'" + Details + "'," + data[i].LangID + "," + data[i].SchemeID + "," + data[i].MaxAge + "," + data[i].MinAge + ")";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {
            //    alert('Could not sync. Please try later.');
        }
    });
}

function PopulateSchemeDetails(tx) {
    var user = utils.localStorage().get('user');

    var LangId = 1;
    LangId = utils.localStorage().get('LangID');

    $.ajax({
        url: utils.Urls.GetSchemeDetails + '?StateId=' + user.StateID,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SchemeDetails');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SchemeDetails (ID, SchemeID, KeyField, FieldValue, LangID )');
            $.each(data, function (i, dat) {

                var KeyField = data[i].KeyField.replace(/'/g, '"');
                var FieldValue = data[i].FieldValue.replace(/'/g, '"');

                var stmt = "INSERT INTO SchemeDetails (ID, SchemeID, KeyField, FieldValue, LangID  ) VALUES (" + data[i].ID + "," + data[i].SchemeID + ",'" + KeyField + "','" + FieldValue + "'," + data[i].LangID + ")";
                tx.executeSql(stmt);
            });

        },
        error: function (error) {
            //    alert('Could not sync. Please try later.');
        }
    });
}

function PopulateSchemeDocuments(tx) {
    var user = utils.localStorage().get('user');

    var LangId = 1;
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
        LangId = user.LangId;
    }

    $.ajax({
        url: utils.Urls.GetSchemeDocuments + '?StateId=' + user.StateID,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SchemeDocuments');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SchemeDocuments (ID, SchemeID, Description, UploadPath )');
            $.each(data, function (i, dat) {

                var UploadPath = data[i].UploadPath.replace(/'/g, '"');
                if (data[i].SchemeID == 182 || data[i].SchemeID == 198 || data[i].SchemeID == 204 || data[i].SchemeID == 203 || data[i].SchemeID == 208 || data[i].SchemeID == 194 || data[i].SchemeID == 187 || data[i].SchemeID == 262 || data[i].SchemeID == 261 || data[i].SchemeID == 263) {
                    UploadPath = UploadPath.replace('http://fileupload.defindia.org/SoochanaSeva', 'media');
                    UploadPath = UploadPath.replace(/\\/g, "/");
                }
                var stmt = "INSERT INTO SchemeDocuments (ID, SchemeID, Description, UploadPath  ) VALUES (" + data[i].ID + "," + data[i].SchemeID + ",'" + data[i].Description + "','" + UploadPath + "')";
                tx.executeSql(stmt);
            });
            $(".sync-data-box").css("display", "none");
        },
        error: function (error) {
            //   alert('Could not sync. Please try later.');
        }
    });
}

function PopulateSurveys(tx) {
    var user = utils.localStorage().get('user');
    var Url = utils.Urls.GetAllSurveys + '?userName=' + user.userName;
    $.ajax({
        url: Url,
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS Survey');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Survey (Id, SurveyName, SurveyTemplate, SurveyDesc, UserCreated, StartDate, EndDate, StateId, DistrictId )');
            $.each(data, function (i, dat) {
                var stmt = "INSERT INTO Survey (Id, SurveyName, SurveyTemplate, SurveyDesc, UserCreated, StartDate, EndDate, StateId, DistrictId ) VALUES (" + dat.Id + ", '" + dat.SurveyName + "', '" + dat.SurveyTemplate + "','" + dat.SurveyDesc + "', '" + dat.UserCreated + "','" + utils.toPaddedDate(dat.StartDate) + "','" + utils.toPaddedDate(dat.EndDate) + "'," + dat.StateId + "," + dat.DistrictId + ")";
                tx.executeSql(stmt);
            });

        },
        error: function (error) {
            alert('Could not sync. Please try later.' + error.message);
        }
    });
}
function PopulateSurveySections(tx) {
    var user = utils.localStorage().get('user');
    $.ajax({
        url: utils.Urls.GetAllSurveySections + '?userName=' + user.userName,
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SurveySections');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SurveySections (Id, SurveyId, SectionId, SectionHeader, IsAvailable, ClientId )');
            $.each(data, function (i, dat) {
                var sectionHeader = dat.SectionHeader.replace(/'/g, '"');
                try {
                    var stmt = "INSERT INTO SurveySections (Id, SurveyId, SectionId, SectionHeader, IsAvailable, ClientId ) VALUES (" + dat.Id + "," + dat.SurveyId + "," + dat.SectionId + ",'" + sectionHeader + "', '" + dat.IsAvailable + "','" + dat.ClientId + "')";
                    tx.executeSql(stmt);
                } catch (e) {
                    console.log(e);
                }

            });

        },
        error: function (error) {
            alert('Could not sync. Please try later.' + error.message);
        }
    });
}
function PopulateSurveyDetails(tx) {
    var user = utils.localStorage().get('user');
    $.ajax({
        url: utils.Urls.GetAllSurveyDetails + '?userName=' + user.userName,
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SurveyDetails');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SurveyDetails (Id , SurveyId ,Question ,InputTypes ,HasSubQuestion , SectionId ,Condition ,ValidationMessage ,isMandatory ,isAvailable ,isSearchable ,SelectValues , LangId, LinkQuestion, ClientId, Size)');
            $.each(data, function (i, dat) {
                try {
                    var question = dat.Question.replace(/'/g, '');
                    var validation = dat.ValidationMessage.replace(/'/g, '');
                    var selection = dat.SelectValues.replace(/'/g, '');
                    var stmt = "INSERT INTO SurveyDetails (Id , SurveyId ,Question ,InputTypes ,HasSubQuestion , SectionId ,Condition ,ValidationMessage ,isMandatory ,isAvailable ,isSearchable ,SelectValues , LangId, LinkQuestion, ClientId, Size ) VALUES (" + dat.Id + "," + dat.SurveyId + ",'" + question + "','" + dat.InputTypes + "','" + dat.HasSubQuestion + "'," + dat.SectionId + ",'" + dat.Condition + "','" + validation + "','" + dat.isMandatory + "','" + dat.isAvailable + "','" + dat.isSearchable + "','" + selection + "'," + dat.LangId + "," + dat.LinkQuestion + ",'" + dat.ClientId + "'," + dat.Size + ")";

                    // console.log(i + ':' + stmt);
                    tx.executeSql(stmt);

                } catch (e) {
                    console.log(e);
                }

            });

        },
        error: function (error) {
            alert('Could not sync. Please try later.' + error.message);
        }
    });
}
function PopulateSurveyData(tx) {
    var user = utils.localStorage().get('user');
    var UserName = '';
    if (user != undefined || user != null) {
        UserName = user.userName;
    }
    $.ajax({
        url: utils.Urls.GetAllSurveyData + UserName,
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SurveyData');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SurveyData (Id, SurveyId, SurveyDataId ,BeneficiaryId, SoochnaPrenuer, Latitude, Longitude, Timestamp, SyncStatus )');
            $.each(data, function (i, dat) {
                try {
                    var stmt = "INSERT INTO SurveyData (Id, SurveyId, SurveyDataId, BeneficiaryId, SoochnaPrenuer, Latitude, Longitude, Timestamp, SyncStatus) VALUES (" + dat.Id + "," + dat.SurveyId + ",'" + dat.SurveyDataId + "'," + dat.BeneficiaryId + ",'" + UserName + "','" + dat.Latitude + "','" + dat.Longitude + "','" + dat.Timestamp + "', 'true')";
                    // console.log(stmt);
                    tx.executeSql(stmt);
                } catch (e) {
                    console.log(e);
                }

            });

        },
        error: function (error) {
            alert('Could not sync. Please try later.' + error.message);
        }
    });
}

function PopulateSurveyDataDetails(tx) {
    var user = utils.localStorage().get('user');
    var UserName = '';
    if (user != undefined || user != null) {
        UserName = user.userName;
    }

    $.ajax({
        url: utils.Urls.GetAllSurveyDataDetails + UserName,
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS SurveyDataDetails');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SurveyDataDetails (Id, SurveyDataId, SurveyDetailsId, SurveyDetailsData, InputType, SurveyId, SurveyDataFK, SyncStatus)');
            $.each(data, function (i, dat) {
                try {
                    var stmt = "INSERT INTO SurveyDataDetails (Id, SurveyDataId,SurveyDetailsId, SurveyDetailsData, InputType, SurveyId, SurveyDataFK, SyncStatus) VALUES (" + dat.Id + ",'" + dat.SurveyDataId + "','" + dat.SurveyDetailsId + "','" + dat.SurveyDetailsData + "','" + dat.InputType + "'," + dat.SurveyId + ",'" + dat.SurveyDataIdFK + "','true')";
                    //   console.log(stmt);
                    tx.executeSql(stmt);
                } catch (e) {
                    console.log(e);
                }

            });

        },
        error: function (error) {
            alert('Could not sync. Please try later.' + error.message);
        }
    });
}
var setBeneficiaryDetails = function () {
    var ajaxObj = {
        url: utils.Urls.GetBeneficiaryDtls,
        type: 'GET'
    };
    utils.ajaxCallUrl(ajaxObj.url, ajaxObj.type, writeGetBeneficiaryDtls);

};
var writeGetBeneficiaryDtls = function (data) {
    utils.localStorage().set('masterDataBeneficiary', data);
    RefreshPage();
};
function RefreshPage() {
    //  window.location.reload();
    //  window.location.href = 'myaccount.html';
    $('#RevSyncModal').modal('hide');
}
function errorCB(err) {
    //  $('#SyncUpdateProgress').modal('hide');
    var errMsg = err.message;
    console.log(errMsg);
    //
    //    alert("Error fetching Data: " + err.message);
}
function schemeError(e) {
    //debugger;
    //console.log(e);
}
function MakeFavourite(schemeId) {

    utils.localStorage().set('FavoriteSchemeId', schemeId);

    //Insert or Delete in offline DB
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(queryMakeFavorite, errorCB);


}
//Get Favorite Schemes in current Language 
function queryFavorite(tx) {

    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null && (LangId == null || LangId == undefined)) {
        LangId = user.LangId;
    }
    //Add analytics
    var SchemeId = utils.localStorage().get('FavoriteSchemeId');

    var param1 = new Date();
    var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();

    var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
    sqlStmt += "  ('S0003', 'Scheme','" + user.userName + "'," + user.StateID + "," + LangId + ",'" + SchemeId + "','SchemeId','Favorite Scheme','" + today + "')";

    if (sqlStmt != undefined && sqlStmt != null && SchemeId != undefined) {
        tx.executeSql(sqlStmt);
    }


    var queryText = "SELECT  ID, Keywords, LangId, Objective, SchemeName, UnSchemeId ";
    queryText += " FROM FavouriteSchemes ";
    queryText += " WHERE LangId =" + LangId;
    tx.executeSql(queryText, [], queryFavoriteSuccess, errorCB);

}
//Populate Favorite Schemes
function queryFavoriteSuccess(tx, data) {
    var popularDiv = '';
    var isDetails = utils.localStorage().get('IsSchemeDetails');
    var len = data.rows.length;
    if (len > 0) {
        var LangId = utils.localStorage().get('LangID');
        $("#divFavourite").html('');
        for (var i = 0; i < len; i++) {
            var keyWords = getKeyWords(data.rows.item(i).Keywords);
            popularDiv += '<div class="scheme-detail1 scheme-detail5 width90 margin5 padding5 background-fav">';
            popularDiv += '<div class="upper-case padding-r-15">' + data.rows.item(i).SchemeName + '</div>';
            popularDiv += '<div class="delete-fav-box" id="btndelfav-' + data.rows.item(i).ID + '" onclick="DeleteFavourite(' + data.rows.item(i).ID + ')"><img class="max-width100" src="images/delete.png"></div>';
            if (LangId == 1) {
                popularDiv += '<div class="body2 width85 position-a-6" id="delfav-' + data.rows.item(i).ID + '"><div class="color-w text-align-c">Are you sure you want to delete this scheme from your favourite?</div>';
                popularDiv += '<div class="clearboth"></div><div class="padding2 body5 text-align-c" onclick="MakeFavourite(' + data.rows.item(i).ID + ')">Yes, please delete</div>';
                popularDiv += '<div class="clearboth2"></div><div class="padding2 body5 text-align-c canceldelete" onclick="cancelFavourite(' + data.rows.item(i).ID + ')">No, cancel request</div>';
            }
            else
                if (LangId == 2) {
                    popularDiv += '<div class="body2 width85 position-a-6" id="delfav-' + data.rows.item(i).ID + '"><div class="color-w text-align-c">क्या आप इस योजना को अपने पसंद की सूची से हटाना चाहते हैं?</div>';
                    popularDiv += '<div class="clearboth"></div><div class="padding2 body5 text-align-c" onclick="MakeFavourite(' + data.rows.item(i).ID + ')">हां, हटाएं</div>';
                    popularDiv += '<div class="clearboth2"></div><div class="padding2 body5 text-align-c canceldelete" onclick="cancelFavourite(' + data.rows.item(i).ID + ')">नहीं, मत हटाएं</div>';
                }
            popularDiv += '<div class="arrow-right"></div></div>';
            popularDiv += '<div class="scheme-detail2"' + 'onclick="ShowScheme(' + data.rows.item(i).ID + ')">';
            popularDiv += '<div class="scheme-detail3">';

            popularDiv += keyWords;
            popularDiv += '</div>';
            popularDiv += '<div class="scheme-detail4">';
            popularDiv += '<div>' + data.rows.item(i).Objective + '</div>';
            if (LangId == 1) {
                popularDiv += '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + data.rows.item(i).ID + ')">Read more...</div></div>';
            }
            else {
                popularDiv += '<div><div class="anchor3" style="cursor: pointer;" onclick="ShowScheme(' + data.rows.item(i).ID + ')">विवरण पढ़िए...</div></div>';
            }
            popularDiv += '</div>';
            popularDiv += '</div>';

            popularDiv += '</div>';
        }

    }
    else {
        if (isDetails) {
            LangId = 1;
            LangId = utils.localStorage().get('LangID');
            if (LangId == 1) {
                popularDiv = '<div class="width97 margin-left3" id="divFavourite">No Favorite schemes</div>';
            }
            else if (LangId == 2) {
                popularDiv = '<div class="width97 margin-left3" id="divFavourite"> पसंदीदा योजना नहीं मिला </div>';
            }
        }
    }
    $("#divFavourite").append(popularDiv);


    if (isDetails) {
        var isFav = $("#divFav").html();
        if (isFav == '<img class="max-width30 fav-icon" src="images/fav.png">') {
            $("#divFav").html(isFav.replace('<img class="max-width30 fav-icon" src="images/fav.png">', '<img class="max-width30 fav-icon" src="images/fav-plain.png">'));
        }
        else {
            if (isFav == '<img class="max-width30 fav-icon" src="images/fav-plain.png">') {
                $("#divFav").html(isFav.replace('<img class="max-width30 fav-icon" src="images/fav-plain.png">', '<img class="max-width30 fav-icon" src="images/fav.png">'));
            }
        }
    }
}

function queryMakeFavorite(tx) {
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    var schemeId = utils.localStorage().get('FavoriteSchemeId');
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
        LangId = user.LangId;
    }

    //Add analytics
    var param1 = new Date();
    var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();

    var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
    sqlStmt += "  ('S0003','Scheme','" + user.userName + "'," + user.StateID + "," + LangId + ",'" + schemeId + "','SchemeId','Favorite Scheme','" + today + "')";

    if (sqlStmt != undefined && sqlStmt != null && schemeId != undefined) {
        tx.executeSql(sqlStmt);
    }

    var queryText = "SELECT  ID, Keywords, LangId, Objective, SchemeName, UnSchemeId ";
    queryText += " FROM FavouriteSchemes ";
    queryText += " WHERE LangId =" + LangId;
    queryText += " AND ID =" + schemeId;
    tx.executeSql(queryText, [], queryMakeFavoriteSuccess, errorCB);
}

function queryMakeFavoriteSuccess(tx, data) {
    var sqlText = '';

    var len = data.rows.length;
    var schemeId = utils.localStorage().get('FavoriteSchemeId');
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
        LangId = user.LangId;
    }

    if (len > 0) {
        //Delete the Scheme
        sqlText = 'DELETE FROM FavouriteSchemes WHERE ID = ' + schemeId;
        tx.executeSql(sqlText);
        window.location.href = "myaccount.html";
        var queryText = "SELECT  ID, Keywords, LangId, Objective, SchemeName, UnSchemeId ";
        queryText += " FROM FavouriteSchemes ";
        queryText += " WHERE LangId =" + LangId;
        //console.log(queryText);
        tx.executeSql(queryText, [], queryFavoriteSuccess, errorCB);
    }
    else {
        //Query Scheme table to get data.
        var queryText = "SELECT  ID, Keywords, LangId, Objective, SchemeName, UnSchemeId ";
        queryText += " FROM Scheme ";
        queryText += " WHERE LangId =" + LangId;
        queryText += " AND ID =" + schemeId;
        tx.executeSql(queryText, [], querySchemeDataSuccess, errorCB);

    }


}

function querySchemeDataSuccess(tx, data) {

    var len = data.rows.length;
    var schemeId = utils.localStorage().get('FavoriteSchemeId');
    var LangId = utils.localStorage().get('LangID');
    if (len > 0) {
        var Keywords = data.rows.item(0).Keywords.replace(/'/g, '"');
        var Objective = data.rows.item(0).Objective.replace(/'/g, '"');
        var SchemeName = data.rows.item(0).SchemeName.replace(/'/g, '"');
        var UnSchemeId = data.rows.item(0).UnSchemeId.replace(/'/g, '"');
        var stmt = "INSERT INTO FavouriteSchemes (ID, LangId, Keywords,Objective,SchemeName, UnSchemeId) VALUES (" + schemeId + "," + LangId + ",'" + Keywords + "','" + Objective + "','" + SchemeName + "','" + UnSchemeId + "')";
        tx.executeSql(stmt);
        var user = utils.localStorage().get('user');
        var LangId = utils.localStorage().get('LangID');
        if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
            LangId = user.LangId;
        }
        var queryText = "SELECT  ID, Keywords, LangId, Objective, SchemeName, UnSchemeId ";
        queryText += " FROM FavouriteSchemes ";
        queryText += " WHERE LangId =" + LangId;
        // console.log(queryText);
        tx.executeSql(queryText, [], queryFavoriteSuccess, errorCB);

    }

}

function PopulateCMS(tx) {
    $.ajax({
        url: 'http://cms.defindia.org/api/meraapp?ApplicationId=1',
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        timeout: 0,
        success: function (data) {
            //
            tx.executeSql('DROP TABLE IF EXISTS CMS');
            tx.executeSql('CREATE TABLE IF NOT EXISTS CMS (ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId)');
            $.each(data, function (i, dat) {
                var KeyName = data[i].KeyName.replace(/'/g, '"');
                var KeyValue = data[i].KeyValue.replace(/'/g, '"');
                var stmt = "INSERT INTO CMS (ApplicationId, CMSKeyId, CMSKeyValueId, KeyName, KeyValue, LanguageId ) VALUES (" + data[i].ApplicationId + "," + data[i].CMSKeyId + "," + data[i].CMSKeyValueId + ",'" + KeyName + "','" + KeyValue + "'," + data[i].LanguageId + ")";
                tx.executeSql(stmt);

            });
            var LoggedIn = utils.localStorage().get('loggedIn');

            if (LoggedIn == undefined || LoggedIn == false) {
                window.location = 'login.html';
            }

        },
        error: function (error) {
            //
            // window.location = 'login.html';
            //alert('Could not sync CMS. Please try later.');

        }
    });

}
function errorScheme(err) {
    console.log(err);
}

// Query the Scheme Table to get popular schemes
function queryPopularSchemes(tx) {
    var user = utils.localStorage().get('user');
    var LangId = utils.localStorage().get('LangID');
    if (user != undefined && user != null && user.LangId != undefined && user.LangId != null) {
        LangId = user.LangId;
    }
    var queryText = "SELECT S.ID, S.UnSchemeId, S.SchemeName, S.Objective, S.IsPopular, S.Keywords FROM Scheme S ";
    queryText += " WHERE  S.LangID = " + LangId;
    queryText += " AND S.IsPopular = 'true' ";
    // queryText += " AND S.IsSchemeActive='true' AND (S.IsPopular = 'true' OR S.IsPopular = 'TRUE'";
    tx.executeSql(queryText, [], queryPopularSchemesSuccess, errorCB);
}

// Query the queryPopularSchemesSuccess callback
function queryPopularSchemesSuccess(tx, scheme) {
    var len = scheme.rows.length;
    if (len > 0) {
        for (var i = 0; i < len; i++) {
            var keywords = getKeyWords(scheme.rows.item(i).Keywords);
            var schemeName = scheme.rows.item(i).SchemeName;
            if (schemeName != null && schemeName != undefined && schemeName.length > 45) {
                schemeName = schemeName.substring(0, 45) + "...";
            }
            var popularDiv = ' <div class="width60 items news-item-box" onclick=ShowScheme(' + scheme.rows.item(i).ID + ')>';
            popularDiv += '<div class="news-item1">';
            //popularDiv += '<p style="cursor: pointer;" onclick=ShowScheme(' + scheme[i].ID + ')>';
            popularDiv += '<div class="news-item2">';
            popularDiv += schemeName + ' </div>';// </p>';
            popularDiv += '<div class="tags news-item3"><span>';
            popularDiv += keywords + '</span></div> </div> </div>';
            $("#divPopular").append(popularDiv);

        }
    }

}

function PopulateServiceType(tx) {
    $.ajax({
        url: utils.Urls.ServiceTypeUrl,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        timeout: 0,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS ServiceType');
            tx.executeSql('CREATE TABLE IF NOT EXISTS ServiceType (Id, ServiceName, LangID)');
            $.each(data, function (i, dat) {
                var stmt = "INSERT INTO ServiceType (Id, ServiceName, LangID ) VALUES (" + data[i].Id + ",'" + data[i].ServiceName + "'," + data[i].LangID + ")";
                tx.executeSql(stmt);

            });


        },
        error: function (error) {
            //
            // window.location = 'login.html';
            //alert('Could not sync CMS. Please try later.');

        }
    });

}

function PopulateServices(tx) {
    $.ajax({
        url: utils.Urls.ServicesUrl,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        timeout: 0,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS Services');
            tx.executeSql('CREATE TABLE IF NOT EXISTS Services (Id, ServiceTypeId, ProgramName, Price, LangID)');
            $.each(data, function (i, dat) {
                var stmt = "INSERT INTO Services (Id, ServiceTypeId, ProgramName, Price, LangID ) VALUES (" + data[i].Id + "," + data[i].ServiceTypeId + ",'" + data[i].ProgramName + "','" + data[i].Price + "'," + data[i].LangID + ")";
                tx.executeSql(stmt);

            });


        },
        error: function (error) {
            //
            // window.location = 'login.html';
            //alert('Could not sync CMS. Please try later.');

        }
    });

}
function CheckTable(tx) {
    //tx.executeSql("SELECT AppUserWallet, sql from sqlite_master WHERE type = 'table'");
    var tblName = 'AppUserWallet';
    //  db.transaction(function(tx) {
    tx.executeSql("SELECT count(*) AS textist FROM sqlite_master WHERE type='table' AND name='" + tblName + "'", [], function (tx, results) {
        var ex = results.rows.item(0).textist;
        switch (tblName) {
            case 'AppUserWallet':
                PopulateAppUserWallet(tx);
                break;
            case 'Beneficiary':
                PopulateAppUserWallet(tx);
                break;
        }
    }, function (tx, e) {
        console.log("There has been an error: " + e.message);
        //deferred.reject();
    });
    // });
}
function PopulateAppUserWallet(tx) {
    var user = utils.localStorage().get('user');
    var UserName = '';
    if (user != undefined || user != null) {
        UserName = user.userName;
    }
    $.ajax({
        url: utils.Urls.AppUserWalletUrl + UserName,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        timeout: 0,
        success: function (data) {
            tx.executeSql('DROP TABLE IF EXISTS AppUserWallet');
            tx.executeSql('CREATE TABLE IF NOT EXISTS AppUserWallet (Id, UserId, ServiceTypeId, BeneficiaryId, ServiceName, Price, Date, LangID, SchemeId)');
            $.each(data, function (i, dat) {
                var stmt = "INSERT INTO AppUserWallet (Id, UserId, ServiceTypeId, BeneficiaryId, ServiceName, Price, Date, LangID, SchemeId ) VALUES (" + data[i].Id + ",'" + data[i].UserId + "'," + data[i].ServiceTypeId + "," + data[i].BeneficiaryId + ",'" + data[i].ServiceName + "'," + data[i].Price + ",'" + data[i].Date + "'," + data[i].LangID + "," + data[i].SchemeId + ")";
                tx.executeSql(stmt);

            });

        },
        error: function (error) {
            //
            // window.location = 'login.html';
            //alert('Could not sync CMS. Please try later.');

        }
    });

}

function PopulateEngHinDistrict(tx) {
    var user = utils.localStorage().get('user');
    var StateId = '';
    if (user != undefined || user != null) {
        StateId = user.StateID;
    }

    $.ajax({
        url: utils.Urls.EngHinDistrict + StateId,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {

            tx.executeSql('DROP TABLE IF EXISTS EngHinDistrict');
            tx.executeSql('CREATE TABLE IF NOT EXISTS EngHinDistrict (ID, EngStateId, HinStateId, LangID, OtherStateId, StateName)');
            $.each(data, function (i, dat) {
                var stmt = "INSERT INTO EngHinDistrict (ID, EngStateId, HinStateId, LangID, OtherStateId, StateName) VALUES (" + data[i].ID + "," + data[i].EngStateId + "," + data[i].HinStateId + "," + data[i].LangID + "," + data[i].OtherStateId + ",'" + data[i].StateName + "')";
                tx.executeSql(stmt);
            });
        },
        error: function (error) {

            console.log('Error in PopulateEngHinDistrict ' + error.message);
        }
    });

}

function GetUserImage(tx) {
    var user = utils.localStorage().get('user');
    var langId = utils.localStorage().get('LangID');
    $.ajax({
        url: utils.Urls.AppUserImage + user.userName + "&Stateid=" + user.StateID,
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        crossdomain: true,
        async: false,
        success: function (data) {

            if (data != null && data != undefined) {
                var stmt = "UPDATE USERS SET Photo = '" + data.Photo + "' WHERE UserName = '" + user.userName + "'";
                tx.executeSql(stmt);
            }
            $('#SyncUpdateProgress').modal('hide');

            if (langId == 1)
                alert('Sync Complete');
            else if (langId == 2)
                alert('सिंक पूरा हो गया');

            $(".sync-data-box").css("display", "none");
        },
        error: function (error) {
            $('#SyncUpdateProgress').modal('hide');
            if (langId == 1)
                alert('Sync Complete');
            else if (langId == 2)
                alert('सिंक पूरा हो गया');

            $(".sync-data-box").css("display", "none");
        }
    });

}
function SyncData() {
    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2 * 1024 * 1024);
    //db.transaction(DeleteAnalyticsApp, errorCB);
    //db.transaction(PopulateScheme, schemeError);
    db.transaction(GetSyncStatus, schemeError);
    db.transaction(GetAnalyticsMaster, errorCB);
    //db.transaction(CreateAnalyticsApp, errorCB);

    db.transaction(PopulateNews, errorCB);
    db.transaction(PopulateCMS, errorCB);
    //
    db.transaction(PopulateUsers, errorCB);
    db.transaction(PopulateLanguages, errorCB);

    db.transaction(PopulateRecentScheme, errorCB);
    db.transaction(PopulateBeneficiary, errorCB);
    db.transaction(PopulateSubBeneficiary, errorCB);
    db.transaction(PopulateFavorite, errorCB);
    db.transaction(PopulateMasters, errorCB);
    db.transaction(PopulateBeneficiarySchemes, errorCB)
    db.transaction(PopulateSchemeBenefits, errorCB);
    db.transaction(PopulateSchemeDetails, errorCB);
    db.transaction(PopulateSchemeDocuments, errorCB);
    db.transaction(PopulateBeneficiaryApplied, errorCB);
    db.transaction(PopulateSearchMapping, errorCB);

    db.transaction(PopulateServiceType, errorCB);
    db.transaction(PopulateServices, errorCB);
    db.transaction(PopulateAppUserWallet, errorCB);
    db.transaction(PopulateEngHinDistrict, errorCB);
    setBeneficiaryDetails();
    db.transaction(PopulateSurveys, errorCB);
    db.transaction(PopulateSurveySections, errorCB);
    db.transaction(PopulateSurveyDetails, errorCB);
    db.transaction(PopulateSurveyData, errorCB);
    db.transaction(PopulateSurveyDataDetails, errorCB);
    db.transaction(GetUserImage, errorCB);
    db.transaction(queryPopularSchemes, errorCB);
    utils.localStorage().set('NewBen', 0);
}

function Logout() {
    utils.localStorage().set('loggedIn', false);

    var db = window.openDatabase("SoochnaSevaDB_Offline", "1.0", "SoochnaSevaDB_Offline", 2000000);
    db.transaction(AddUserAnalytics, errorCB);

    window.location.href = "home.html";
}

function AddUserAnalytics(tx) {
    var user = utils.localStorage().get('user');

    var LangId = utils.localStorage().get('LangID');
    var LoggedInTime = utils.localStorage().get('LoggedInTime');
    var param1 = new Date();
    var today = (param1.getMonth() + 1) + '/' + param1.getDate() + '/' + param1.getFullYear() + ' ' + param1.getHours() + ':' + param1.getMinutes() + ':' + param1.getSeconds();
    var sessionDuration = GetTimeDifference(today, LoggedInTime);
    var sqlStmt = "INSERT INTO AnalyticsApp (AnalyticsCode, Feature, SoochnaPreneur, StateId, LangId, ObjectId, ObjectType, FeatureClicked, EventDateTime)  VALUES ";
    sqlStmt += "  ('U0003','User','" + user.userName + "'," + user.StateID + "," + LangId + ",'" + sessionDuration + "','UserSession','Logout','" + today + "')";

    if (sqlStmt != undefined && sqlStmt != null) {
        tx.executeSql(sqlStmt);
    }
}

function GetTimeDifference(today, LoggedInTime) {
    var start_actual_time = new Date(LoggedInTime);
    var end_actual_time = new Date(today);

    var diff = end_actual_time - start_actual_time;
    var diffSeconds = diff / 1000;
    var HH = Math.floor(diffSeconds / 3600);
    var MM = Math.floor(diffSeconds % 3600) / 60;
    MM = MM.toFixed(2);
    var formatted = ((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM);
    return (formatted);
}
var getKeyWords = function (data) {
    var words = '';
    if (data == null || data.length <= 0) {
        var LangId = utils.localStorage().get('LangID');
        if (LangId == 1) {
            words += '<div>No Keywords available</div>';
        }
        else if (LangId == 2) {
            words += '<div> कीवर्ड उपलब्ध नहीं है।</div>';
        }
    }
    else {
        var keywords = data.split(',');
        if (keywords != null && keywords.length > 0) {
            for (var j = 0; j < keywords.length; j++) {
                words += '#' + $.trim(keywords[j]) + ' ';
            }
        }

    }

    return words;
};