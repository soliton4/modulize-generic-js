var fs = require("fs");

var Modulizer = function(){
};

_Modulizer = {
  convertCode: function(parCode, parConfig){
    if (!parConfig){
      parConfig = {};
    };
    var resStr = "";
    resStr += "var helperDefine = function(parRequire, parFactory){\n";
    resStr += "  if (typeof define == \"function\"){\n";
    resStr += "    // amd part\n";
    resStr += "    define(parRequire, parFactory);\n";
    resStr += "  }else{\n";
    resStr += "    // commonjs part\n";
    resStr += "    var parAr = [];\n";
    resStr += "    var i = 0;\n";
    resStr += "    for (i = 0; i < parRequire.length; ++i){\n";
    resStr += "      parAr.push(require(parRequire[i]));\n";
    resStr += "    };\n";
    resStr += "    module.exports = parFactory.apply(undefined, parAr);\n";
    resStr += "  };\n";
    resStr += "};\n";
    resStr += "helperDefine([";
    var i = 0;
    if (parConfig.require){
      for (i = 0; i < parConfig.require.length; ++i){
        if (i > 0){
          resStr += (", ");
        };
        resStr += ("\"");
        if (parConfig.require[i]){
          if (typeof parConfig.require[i] == "string"){
            resStr += (parConfig.require[i]);
          }else{
            resStr += (parConfig.require[i].module);
          };
        };
        resStr += ("\"");
      };
    };
    resStr += "], function(";
    if (parConfig.require){
      for (i = 0; i < parConfig.require.length; ++i){
        if (i > 0){
          resStr += (", ");
        };
        if (parConfig.require[i]){
          if (typeof parConfig.require[i] == "string"){
            resStr += ("_undefined_module_name_" + i);
          }else{
            resStr += (parConfig.require[i].as);
          };
        };
      };
    };
    resStr += "){\n";
    
    if (parConfig.require){
      for (i = 0; i < parConfig.require.length; ++i){
        if (parConfig.require[i]){
          if (parConfig.require[i].members){
            var m = 0;
            for (m = 0; m < parConfig.require[i].members.length; ++m){
              resStr += "var " + parConfig.require[i].members[m] + " = ";
              resStr += parConfig.require[i].as + "." + parConfig.require[i].members[m] + ";\n";
            };
          };
        };
      };
    };
    
    if (parConfig.replace){
      var codeStr = parCode;
      for (i = 0; i < parConfig.replace.length; ++i){
        console.log(parConfig.replace[i]);
        codeStr = codeStr.replace(parConfig.replace[i].find, parConfig.replace[i].replace);
      };
      resStr += codeStr;
      console.log(codeStr.substr(0, 200));
    }else{
      resStr += parCode;
    };
    
    resStr += "\n";
    if (parConfig["return"]){
      resStr += "  return ";
      resStr += parConfig.return;
      resStr += ";\n";
    }else if (parConfig["returnmultiple"]){
      resStr += "  return {";
      //resStr += parConfig.return;
      var first = true;
      for (i in parConfig["returnmultiple"]){
        if (!first){
          resStr += ",\n";
        };
        first = false;
        resStr += "\"" + i + "\": ";
        if (parConfig["returnmultiple"][i] === true){
          resStr += i;
        }else{
          resStr += parConfig["returnmultiple"][i];
        };
      };
      resStr += "\n};\n";
    }else{
      //console.log("no return");
    };
    resStr += "});\n";
    
    return resStr;
  }
  
  , convertFile: function(parFileName, parConfig, parDestFileName, parCallback){
    var self = this;
    fs.readFile(parFileName, { encoding: "utf8" }, function(err, data){
      if (err){
        if (parCallback){
          parCallback(err);
        };
        return;
      };
      var convertedCode = self.convertCode(data, parConfig);
      if (parDestFileName){
        fs.writeFile(parDestFileName, convertedCode, { encoding: "utf8" }, function(err){
          if (err){
            if (parCallback){
              parCallback(err);
            };
            return;
          };
          if (parCallback){
            parCallback(undefined, convertedCode);
          };
        });
      }else{
        if (parCallback){
          parCallback(undefined, convertedCode);
        };
      };
    });
  }
};

Modulizer.prototype = _Modulizer;


module.exports = new Modulizer();