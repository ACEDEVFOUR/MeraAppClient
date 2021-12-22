$ignore = "C:\Workspace\SoochnaSevaProj\SoochnaEnterpreneur\meraApp.mobile\`$tf"
robocopy C:\Workspace\SoochnaSevaProj\SoochnaEnterpreneur\meraApp.mobile C:\Workspace\SoochnaSevaProj\MeraApp\www /mir /xd C:\Workspace\SoochnaSevaProj\SoochnaEnterpreneur\meraApp.mobile\App_Data C:\Workspace\SoochnaSevaProj\SoochnaEnterpreneur\meraApp.mobile\.vs $ignore C:\Workspace\SoochnaSevaProj\SoochnaEnterpreneur\meraApp.mobile\meraApp.mobile /xf C:\Workspace\SoochnaSevaProj\SoochnaEnterpreneur\meraApp.mobile\meraApp.mobile.sln C:\Workspace\SoochnaSevaProj\SoochnaEnterpreneur\meraApp.mobile\website.publishproj

cd C:\Workspace\SoochnaSevaProj\MeraApp\win10-x64\
& 'C:\Workspace\SoochnaSevaProj\MeraApp\win10-x64\console.editFile.exe'
cd\
cd C:\Workspace\SoochnaSevaProj\MeraApp\
cordova build android --release --keystore="C:\Workspace\SoochnaSevaProj\MeraAppApkSign_v2.keystore" --alias=naresh --storePassword=naresh  --password=naresh
cd\
cd C:\Workspace\SoochnaSevaProj\MeraApp\win10-x64\
& 'C:\Workspace\SoochnaSevaProj\MeraApp\win10-x64\console.renameFile.exe'
Echo "COMPLETE"