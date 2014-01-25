## Description

Turn your generic JavaScript files into loadable modules.  

## Usage


`
var modulizer = require("modulize-generic-js");
var someSourceCodeStr = "var x = 'something'";
console.log( modulizer.convertCode(someSourceCodeStr, { "return": "x" }) );

var sourceFileName = "/somejs.js"
var destFileName = "/modules/some/somejs.js"

modulizer.convertFile(sourceFileName, {
  require: [{
    module: "/othermodule/main"
    , as: "otherVariable"
  }, "/othermodule/justload-dontrefer"]
  , "return": "moduleVariable"
}, destFileName, function(err, data){});
`

the result will contain a header that is supposed to autodetect weather it is being loaded as AMD by the presence of a define function or as a commonJs module.

## License

BSD
