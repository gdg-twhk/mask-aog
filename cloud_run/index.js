 //https://developers.google.com/actions/reference/nodejsv2/overview
 
 'use strict'; //語法嚴格模式
 
 //Cloud Functions for Firebase
 //const functions = require('firebase-functions');
 //Cloud Functions for Firebase
 
 //Dialogflow inline editor
 //const functions = require('firebase-functions');
 //Dialogflow inline editor
 
 //Self-hosted Express server (multiple routes)
 const express = require('express');
 const bodyParser = require('body-parser'); //parse POST request for text/json/query string
 //Self-hosted Express server (multiple routes)

//https
const axios = require('axios');
const https = require('https'); 


 // ... app code start here
//build an app instance in your fulfillment webhook, follow these steps:
//step1:Call the require() function
// Import the service function and various response classes
const {
  dialogflow,
  actionssdk,
  Image,
  Table,
  Carousel,
  Payload,
  Permission
} = require('actions-on-google');

//step2:Create an app instance
//const app = dialogflow();

//step3:configure the app instance
const app = dialogflow({
  debug: true
});

//intent process
app.intent('find_mask', (conv) => {
	conv.data.requestedPermission = 'DEVICE_PRECISE_LOCATION';
    return conv.ask(new Permission({
        context: '您好',
        permissions: conv.data.requestedPermission
      })
    );
});

app.intent('user_info', (conv, params, permissionGranted) => {
    if (permissionGranted) {
        const {
            requestedPermission
        } = conv.data;
        if (requestedPermission === 'DEVICE_PRECISE_LOCATION') {
            
            const {
                coordinates
            } = conv.device.location;
            var entityCity = conv.device.location.formattedAddress;
            console.log('entityCity:', entityCity);  
            if (coordinates) {
                return gdgdatamask(entityCity,coordinates.latitude,coordinates.longitude).then((outside_mask) => {
                  console.log("outside_mask: ",outside_mask);
     			conv.ask(outside_mask);
   				})
            } else {
                // Note: Currently, precise locaton only returns lat/lng coordinates on phones and lat/lng coordinates
                // and a geocoded address on voice-activated speakers.
                // Coarse location only works on voice-activated speakers.
                return conv.close('抱歉，我不知道你在哪裡。');
            }
 
        }
    } else {
        return conv.close('好的，那你還想問什麼問題嗎?');
    }
});

// ... app code end here

//external API start
/**
 * Make an external API call to get open data.
 * @return {Promise<string>}
 */
function gdgdatamask(entityCity,latitude,longitude){
  var lat = latitude;
  console.log('latitude:', latitude);
  var lng = longitude;  
  console.log('longitude:', longitude);
  
  var ne_lat = lat+0.01081754;
  console.log('ne latitude:', ne_lat);
  var ne_lng = lng+0.01086831;
  console.log('ne longitude:', ne_lng);

  var se_lat = lat-0.01081845;
  console.log('se latitude:', se_lat);
  var se_lng = lng+0.01086831;
  console.log('se longitude:', se_lng);

  var sw_lat = lat-0.01081845;
  console.log('sw latitude:', sw_lat);
  var sw_lng = lng-0.01086831;
  console.log('sw longitude:', sw_lng);

  var nw_lat = lat+0.01081754;
  console.log('nw latitude:', nw_lat);
  var nw_lng = lng-0.01086831;
  console.log('nw longitude:', nw_lng);

  
return new Promise((resolve, reject) => { 
let msg = "callaxiosApi";
const findmaskUrl = "https://mask-9999.appspot.com/api/pharmacies";

console.log(`findmaskUrl ==`+findmaskUrl);
// // At instance level
// const instance = axios.create({
//   httpsAgent: new https.Agent({  
//     rejectUnauthorized: false
//   })
// });
// instance.post(findmaskUrl);

// // At request level
// const agent = new https.Agent({  
//   rejectUnauthorized: false
// });
//let body_data = {"center":{"lat":lat,"lng":lng},"bounds":{"ne":{"lat":ne_lat,"lng":ne_lng},"se":{"lat":se_lat,"lng":se_lng},"sw":{"lat":sw_lat,"lng":sw_lng},"nw":{"lat":nw_lat,"lng":nw_lng}},"max":3};
axios.post(findmaskUrl,{"center":{"lat":lat,"lng":lng},"bounds":{"ne":{"lat":ne_lat,"lng":ne_lng},"se":{"lat":se_lat,"lng":se_lng},"sw":{"lat":sw_lat,"lng":sw_lng},"nw":{"lat":nw_lat,"lng":nw_lng}},"max":3})
  .then((response) =>{
    console.log("status: ",response.status);
    console.log("statustest: ",response.statusText);
    let json = response.data;
    //console.log("json "+json);
    //let res_msg = "";
    //let data = json.data;
    //console.log("data "+data);
  //if (res_msg !=  "發生錯誤。"){
    //let success = json.success;
    //console.log('success: '  + success);
    //let id = json.result.resource_id;
    //console.log('id: '  + id);
    //let total = json.result.total;
    //var intTotal = 3;
  //});
  /* json format
  {
    "apiVersion": "0.1",
    "data": {
        "items": [
            {
                "id": "5917070659",
                "distance": 0.4318552137117765,
                "name": "德安藥局",
                "phone": "04 -23894920",
                "address": "台中市南屯區文山里忠勇路115–6號1樓",
                "maskAdult": 0,
                "maskChild": 16,
                "available": "星期一上午看診、星期二上午看診、星期三上午看診、星期四上午看診、星期五上午看診、星期六上午看診、星期日上午休診、星期一下午看診、星期二下午看診、星期三下午看診、星期四下午看診、星期五下午看診、星期六下午看診、星期日下午休診、星期一晚上看診、星期二晚上看診、星期三晚上看診、星期四晚上看診、星期五晚上看診、星期六晚上看診、星期日晚上看診",
                "customNote": "發放時間請參照藥局臉書公告，口罩地圖頁面位置是錯的，我們實際地點接近忠勇路跟五權西路交叉這邊。",
                "website": "https://www.facebook.com/DeansPharmacy1983/",
                "note": "",
                "longitude": 120.613596,
                "latitude": 24.142959,
                "servicePeriods": "NNNNNNYNNNNNNYNNNNNNN",
                "serviceNote": "",
                "county": "臺中市",
                "town": "南屯區",
                "cunli": "文山里",
                "updated": "2020-02-12T19:07:05+0800"
            },
            {
                "id": "5917072582",
                "distance": 0.6023746005360272,
                "name": "嶺東藥局",
                "phone": "04 -23861789",
                "address": "臺中市南屯區忠勇路46之3號1樓",
                "maskAdult": 0,
                "maskChild": 36,
                "available": "星期一上午看診、星期二上午看診、星期三上午看診、星期四上午看診、星期五上午看診、星期六上午看診、星期日上午休診、星期一下午看診、星期二下午看診、星期三下午看診、星期四下午看診、星期五下午看診、星期六下午看診、星期日下午休診、星期一晚上看診、星期二晚上看診、星期三晚上看診、星期四晚上看診、星期五晚上看診、星期六晚上看診、星期日晚上休診",
                "customNote": "",
                "website": "",
                "note": "禮拜日休",
                "longitude": 120.613047,
                "latitude": 24.139459,
                "servicePeriods": "NNNNNNYNNNNNNYNNNNNNY",
                "serviceNote": "禮拜日休",
                "county": "臺中市",
                "town": "南屯區",
                "cunli": "春社里",
                "updated": "2020-02-12T19:07:05+0800"
            }
        ]
    }
}
  */

	var outMsg = "";
	var i =0;
	if(json != ""){
		for(i=0;i<3;i++){
			outMsg = outMsg+json.data.items[i].name+", 地址: "+json.data.items[i].address+", 成人口罩: "+json.data.items[i].maskAdult+" 個 "+", 小孩口罩: "+json.data.items[i].maskChild+" 個 "+"\n";
			console.log('Msg data = '  + outMsg);
		}
 	}else{
 		outMsg = "目前查無資料";
   }
  //}else{
  //  outMsg = "資料查詢錯誤";
  //} 
    msg=outMsg+"口罩數量以現場為準，如果還要找其他地方，請再問一次請問口罩在哪裏";
	resolve(msg);
    
  })
  .catch((error) => {
    console.log("error: ",error);
    msg =error;
    if (error.response.status === 500) {
      //console.log('unauthorized, logging out ...');
      msg="位置資訊不在選擇的縣市內。";
    }
    resolve(msg);
    reject(msg);
  });
  })
}

//external API end

//Cloud Functions for Firebase
//exports.fulfillment = functions.https.onRequest(app);
//Cloud Functions for Firebase

//Dialogflow inline editor
// Exported function name must be 'dialogflowFirebaseFulfillment'

//exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
//Dialogflow inline editor

//Self-hosted Express server (multiple routes)

const expressApp = express().use(bodyParser.json());


expressApp.get('/', (req, res) => {
  console.log('Hello world received a request.');

  const target = process.env.TARGET || 'World';
  res.send(`Hello ${target}!`);
});

expressApp.post('/webhook', app);

const port = process.env.PORT || 8080;
expressApp.listen(port, () => {
  console.log('server start ... on port', port);
})

//Self-hosted Express server (multiple routes) 