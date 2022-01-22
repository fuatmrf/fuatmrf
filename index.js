const chalk = require('chalk');
const moment = require('moment');
const fetch = require('node-fetch');
const SMSActivate = require('sms-activate');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()
const sms = new SMSActivate(process.env.SMS_ACTIVATE_TOKEN);
const prompt = require('prompt-sync')({sigint: true});

const randstr = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const genUniqueId = length =>
    new Promise((resolve, reject) => {
        var text = "";
        var possible =
            "abcdefghijklmnopqrstuvwxyz1234567890";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        resolve(text);
    });

const generateIndoName = () => new Promise((resolve, reject) => {
    fetch('https://swappery.site/data.php?qty=1', {
        method: 'GET'
    })
        .then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const sendOtp = (name, email, sessionId, phoneNumber, uniqueId) => new Promise((resolve, reject) => {

    fetch('https://api.gojekapi.com/v5/customers', {
        method: 'POST',
        headers: {
            'X-Signature': '2002',
            'X-Signature-Time': moment().unix().toString(),
            'X-Session-ID': sessionId,
            'Accept': 'application/json',
            'X-AppVersion': '4.35.1',
            'X-AppId': 'com.gojek.app',
            'X-Platform': 'Android',
            'X-UniqueId': uniqueId,
            'D1': '17:AC:A3:A5:AD:0B:5E:27:A1:A1:42:32:FF:CF:15:CB:2C:11:C6:8C:BB:8E:6B:BB:F2:70:DA:EE:38:47:BE:60',
            'X-DeviceOS': 'Android,10',
            'X-User-Type': 'customer',
            'X-PhoneMake': 'Samsung',
            'X-DeviceToken': '',
            'X-PushTokenType': 'FCM',
            'X-PhoneModel': 'samsung,SM-G988B',
            'User-uuid': '',
            'Authorization': 'Bearer',
            'Accept-Language': 'en-null',
            'X-User-Locale': 'en_null',
            'X-Location': '0.0,0.0',
            'X-Location-Accuracy': '0.0',
            'X-M1': '1:UNKNOWN,2:UNKNOWN,3:1631626880354-3511426940583375156,4:12756,5:|UNKNOWN|4,6:UNKNOWN,7:\"WiredSSID\",8:768x1184,9:,10:1,11:UNKNOWN,12:VALUE_NOT_PRESENT,13:2002,14:1631627037',
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '107',
            'Host': 'api.gojekapi.com',
            'Connection': 'close',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/3.12.13'
        },
        body: `{"email":"${email}","name":"${name}","phone":"+${phoneNumber}","signed_up_country":"ID"}`
    }).then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const veryfOtp = (otp, otpToken, sessionId, uniqueId) => new Promise((resolve, reject) => {

    fetch('https://api.gojekapi.com/v5/customers/phone/verify', {
        method: 'POST',
        headers: {
            'X-Session-ID': sessionId,
            'Accept': 'application/json',
            'X-AppVersion': '4.35.1',
            'X-AppId': 'com.gojek.app',
            'X-Platform': 'Android',
            'X-UniqueId': uniqueId,
            'D1': '17:AC:A3:A5:AD:0B:5E:27:A1:A1:42:32:FF:CF:15:CB:2C:11:C6:8C:BB:8E:6B:BB:F2:70:DA:EE:38:47:BE:60',
            'X-DeviceOS': 'Android,10',
            'X-User-Type': 'customer',
            'X-PhoneMake': 'Samsung',
            'X-DeviceToken': '',
            'X-PushTokenType': 'FCM',
            'X-PhoneModel': 'Samsung,SM-G988B',
            'User-uuid': '',
            'Authorization': 'Bearer',
            'Accept-Language': 'en-null',
            'X-User-Locale': 'en_null',
            'X-Location': '0.0,0.0',
            'X-Location-Accuracy': '0.0',
            'X-M1': '1:UNKNOWN,2:UNKNOWN,3:1631626880354-3511426940583375156,4:12756,5:|UNKNOWN|4,6:UNKNOWN,7:\"WiredSSID\",8:768x1184,9:,10:1,11:UNKNOWN,12:VALUE_NOT_PRESENT,13:2002,14:1631627063',
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '158',
            'Host': 'api.gojekapi.com',
            'Connection': 'close',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/3.12.13'
        },
        body: `{"client_name":"gojek:consumer:app","client_secret":"pGwQ7oi8bKqqwvid09UrjqpkMEHklb","data":{"otp":"${otp}","otp_token":"${otpToken}"}}`
    }).then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const requestGetNewJwt = (refreshToken, sessionId, jwt, userId, uniqueId) => new Promise((resolve, reject) => {
    fetch('https://goid.gojekapi.com/goid/token', {
        method: 'POST',
        headers: {
            'X-Signature': '2001',
            'X-Signature-Time': moment().unix().toString(),
            'X-Platform': 'Android',
            'X-UniqueId': uniqueId,
            'D1': '9A:C9:4F:37:14:82:43:AC:08:0E:69:64:80:70:69:F7:08:A5:AF:FC:A2:EA:20:1C:F8:3C:FE:6E:A1:6E:C3:CB',
            'X-Session-ID': sessionId,
            'Accept': 'application/json',
            'X-AppVersion': '4.35.1',
            'X-AppId': 'com.gojek.app',
            'X-DeviceOS': 'Android,10',
            'X-User-Type': 'customer',
            'X-PhoneMake': 'Samsung',
            'X-DeviceToken': '',
            'X-PushTokenType': 'FCM',
            'X-PhoneModel': 'Samsung,SM-G988B',
            'User-uuid': userId,
            'Authorization': `Bearer ${jwt}`,
            'Accept-Language': 'en-ID',
            'X-User-Locale': 'en_ID',
            'X-M1': '1:UNKNOWN,2:UNKNOWN,3:1631626880354-3511426940583375156,4:12756,5:|UNKNOWN|4,6:UNKNOWN,7:\"WiredSSID\",8:768x1184,9:,10:1,11:UNKNOWN,12:VALUE_NOT_PRESENT,13:2001,14:1631633881',
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '189',
            'Host': 'goid.gojekapi.com',
            'Connection': 'close',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/3.12.13'
        },
        body: `{"client_id":"gojek:consumer:app","client_secret":"pGwQ7oi8bKqqwvid09UrjqpkMEHklb","data":{"refresh_token":"${refreshToken}"},"grant_type":"refresh_token","scopes":[]}`
    }).then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const firstSetPin = (sessionId, jwt, userId, uniqueId) => new Promise((resolve, reject) => {
    fetch('https://customer.gopayapi.com/v1/users/pin', {
        method: 'POST',
        headers: {
            'X-Platform': 'Android',
            'X-UniqueId': uniqueId,
            'D1': '9A:C9:4F:37:14:82:43:AC:08:0E:69:64:80:70:69:F7:08:A5:AF:FC:A2:EA:20:1C:F8:3C:FE:6E:A1:6E:C3:CB',
            'X-Session-ID': sessionId,
            'Accept': 'application/json',
            'X-AppVersion': '4.35.1',
            'X-AppId': 'com.gojek.app',
            'X-DeviceOS': 'Android,10',
            'X-User-Type': 'customer',
            'X-PhoneMake': 'Samsung',
            'X-DeviceToken': '',
            'X-PushTokenType': 'FCM',
            'X-PhoneModel': 'Samsung,SM-G988B',
            'User-uuid': userId,
            'Authorization': `Bearer ${jwt}`,
            'Accept-Language': 'en-ID',
            'X-User-Locale': 'en_ID',
            'X-Location': '65.9667,-18.5333',
            'X-Location-Accuracy': '0.0',
            'Gojek-Country-Code': 'ID',
            'X-M1': '1:UNKNOWN,2:UNKNOWN,3:1631626880354-3511426940583375156,4:12756,5:|UNKNOWN|4,6:UNKNOWN,7:\"WiredSSID\",8:768x1184,9:,10:1,11:UNKNOWN,12:VALUE_NOT_PRESENT,13:2002,14:1631633940',
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '16',
            'Host': 'customer.gopayapi.com',
            'Connection': 'close',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/3.12.13'
        },
        body: '{"pin":"123455"}'
    }).then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});

const secondSetPin = (otp, sessionId, jwt, userId, uniqueId) => new Promise((resolve, reject) => {
    console.log(otp, sessionId, jwt, userId, uniqueId)
    fetch('https://customer.gopayapi.com/v1/users/pin', {
        method: 'POST',
        headers: {
            'otp': otp,
            'X-Platform': 'Android',
            'X-UniqueId': uniqueId,
            'D1': '9A:C9:4F:37:14:82:43:AC:08:0E:69:64:80:70:69:F7:08:A5:AF:FC:A2:EA:20:1C:F8:3C:FE:6E:A1:6E:C3:CB',
            'X-Session-ID': sessionId,
            'Accept': 'application/json',
            'X-AppVersion': '4.35.1',
            'X-AppId': 'com.gojek.app',
            'X-DeviceOS': 'Android,10',
            'X-User-Type': 'customer',
            'X-PhoneMake': 'Samsung',
            'X-DeviceToken': '',
            'X-PushTokenType': 'FCM',
            'X-PhoneModel': 'Samsung,SM-G988B',
            'User-uuid': userId,
            'Authorization': `Bearer ${jwt}`,
            'Accept-Language': 'en-ID',
            'X-User-Locale': 'en_ID',
            'X-Location': '65.9667,-18.5333',
            'X-Location-Accuracy': '0.0',
            'Gojek-Country-Code': 'ID',
            'X-M1': '1:UNKNOWN,2:UNKNOWN,3:1631626880354-3511426940583375156,4:12756,5:|UNKNOWN|4,6:UNKNOWN,7:\"WiredSSID\",8:768x1184,9:,10:1,11:UNKNOWN,12:VALUE_NOT_PRESENT,13:2002,14:1631633963',
            'Content-Type': 'application/json; charset=UTF-8',
            'Content-Length': '16',
            'Host': 'customer.gopayapi.com',
            'Connection': 'close',
            'Accept-Encoding': 'gzip, deflate',
            'User-Agent': 'okhttp/3.12.13'
        },
        body: '{"pin":"123455"}'
    }).then(res => res.json())
        .then(res => {
            resolve(res)
        })
        .catch(err => {
            reject(err)
        })
});


// const requestAnotherCode = (id, phoneNumber) => new Promise((resolve, reject) => {

//     fetch(`https://sms-activate.ru/stubs/handler_api.php?api_key=${process.env.SMS_ACTIVATE_TOKEN}&action=setStatus&status=3&id=${id}&forward=${phoneNumber}`, {
//         method: 'GET'
//     }).then(res => res.text())
//         .then(res => {
//             resolve(res)
//         })
//         .catch(err => {
//             reject(err)
//         })
// });


(async () => {
    const phoneNumber = prompt('No. HP (pakai 62):');
    console.log("");

    const indoName = await generateIndoName();
    const { result } = indoName;
    const name = result[0].firstname.toLowerCase() + result[0].lastname.toLowerCase();
    const realName = `${result[0].firstname} ${result[0].lastname}`;
    const email = `${name}@eonohocn.com`;
    console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Mencoba register dengan no hp ${phoneNumber}`));
    const sessionId = uuidv4();
    const uniqueId = await genUniqueId(16);
    const sendOtpResult = await sendOtp(realName, email, sessionId, phoneNumber, uniqueId);

    if (sendOtpResult.success) {
        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`${sendOtpResult.data.message}`))
        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Berhasil mengirim OTP ke nomer ${phoneNumber}`))

        let otpCode1 = prompt('Masukkan Kode OTP : ');
        otpCode1 = Number(otpCode1);

        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Berhasil mendapatkan otp ${otpCode1}`))
        const verifOtpResult = await veryfOtp(otpCode1, sendOtpResult.data.otp_token, sessionId, uniqueId);

        if (verifOtpResult.success) {
            console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Memasang pin (default: 123455)`));

            const requestGetNewJwtResult = await requestGetNewJwt(
                verifOtpResult.data.refresh_token,
                sessionId,
                verifOtpResult.data.access_token,
                verifOtpResult.data.resource_owner_id.toString(),
                uniqueId);

            const firstSetPinResult = await firstSetPin(
                sessionId,
                requestGetNewJwtResult.access_token,
                verifOtpResult.data.resource_owner_id.toString(),
                uniqueId);
                
            console.log(firstSetPinResult);

            let otpCode2 = prompt('Kode OTP ke-2: ');
            otpCode2 = Number(otpCode2);

            console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.green(`Mencoba mengambil otp kedua. ${otpCode2}`));
            
            const secondSetPinResult = await secondSetPin(
                otpCode2.toString(),
                sessionId,
                requestGetNewJwtResult.access_token,
                verifOtpResult.data.resource_owner_id.toString(),
                uniqueId
            );
            console.log(secondSetPinResult)
        }
    } else {
        console.log(`[ ${moment().format("HH:mm:ss")} ] `, chalk.red(`Gagal ${sendOtpResult.errors[0].message}`))
    }
})();