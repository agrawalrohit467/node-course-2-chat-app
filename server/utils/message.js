var moment = require('moment');

var generateMessage = (from, text, displayColor) =>{
    return {
        from,
        text,
        createdAt: moment().valueOf(),
        displayColor
    };
}

var generateLocationMessage = (from, lat, lng, displayColor)=>{
    return{
        from,
        url:`https://www.google.com/maps?q=${lat},${lng}`,
        createdAt: moment().valueOf(),
        displayColor
    }
}

var generateUserColor = function () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

module.exports = {generateMessage, generateLocationMessage, generateUserColor};