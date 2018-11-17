const getJsonFromUrl = require('./client');
const redisClient = require('./redisClient');

var url = process.argv[2];

function isValue(result, key, value) {
    return result[key].name === value;
}

function mergeInformation(info){
  stationInfoArray = info[0].data.stations;
  stationStatusArray = info[1].data.stations;
  var outArr = [];

  stationInfoArray.slice(0,3).forEach(function(value) {
      var existing = stationStatusArray.find(function(v, i) {
          return (v.station_id == value.station_id);
      });

      var stationInfo = {};
      stationInfo.station_id = value.station_id;
      stationInfo.lat = value.lat;
      stationInfo.lon = value.lon;
      stationInfo.name = value.name;

      if (existing) {
          stationInfo.bikes_available = existing.num_bikes_available;
          stationInfo.docks_available = existing.num_docks_available;
          outArr.push(stationInfo)
      } else {
          outArr.push(stationInfo);
      }
  });

  var o = {};
  var key = 'stations';
  o[key] = outArr;
  console.log(JSON.stringify(o));
  redisClient.writeToRedis('bixi', JSON.stringify(o));
}

var callbackGetUrl = function callback(data) {

  var result = data.data.en.feeds;
  var station_information_key = Object.keys(result)
                                      .filter(key => isValue(result, key,'station_information'));
  var station_status_key = Object.keys(result)
                                .filter(key => isValue(result, key, 'station_status'));

  var station_information_url = result[station_information_key].url;
  var station_status_url = result[station_status_key].url;
  var station_information;
  var station_status;

  promiseStationInformation = new Promise((resolve, reject) => {
    getJsonFromUrl(station_information_url, function callback(data) {
        station_information = data;
        resolve(data);
    })
  });

  promiseStationStatus = new Promise((resolve, reject) => {
    getJsonFromUrl(station_status_url, function callback(data) {
        station_status = data;
        resolve(data);
    })
  });

  Promise.all([promiseStationInformation, promiseStationStatus]).then(mergeInformation);
}

getJsonFromUrl(url, callbackGetUrl);
