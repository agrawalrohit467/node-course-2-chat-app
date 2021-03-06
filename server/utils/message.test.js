var expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () =>{
    it('should generate correct message object', () => {
        var from = 'Jen';
        var text = 'Some Message';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text });
    });
});

describe('generateLocationMessage', ()=>{
    it('should generate correct location object', ()=>{
        var from = 'Rohit';
        var lat = 10;
        var lng = 20;
        var url = 'https://www.google.com/maps?q=10,20';
        var message = generateLocationMessage(from, lat, lng);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
    })
})