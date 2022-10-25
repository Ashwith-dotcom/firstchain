const shaHash = require('./shahash')

describe('shaHash()' ,()=>{
    it("generates a sha 256 hash output" ,()=>{
        expect(shaHash('aswith')).toEqual("001ec0f5fe3f9cd16efdbcf3df3f412c7791cbb01cbe7cc4a40deb4de9d45736")
    })
    it("generates the same hash with same input arguments in any order", ()=>{
        expect(shaHash('one' , 'two' , 'three')).toEqual(shaHash('three' , 'two' , 'one'));
    })
})