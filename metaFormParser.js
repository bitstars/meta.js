/**
 * Created by RU$$ on 17.11.2014.
 * Needs jQuery
 */

var MetaFormParser = {
  parseMetaObject: function (domElement, resultTemp) {
    var result = resultTemp;
    if (typeof resultTemp === "undefined") {
      result = new Object();
    }

    $(domElement).children().each(function () {
      if ($(this).hasClass("meta_complex_object")) {
        var arrName = $(this).data("metaname");
        if (result[arrName] !== undefined) {
          if (!result[arrName].push) {
            result[arrName] = [result[arrName]];
          }
          result[arrName].push(MetaFormParser.parseMetaObject($(this)) || '');
        } else {
          result[arrName] = MetaFormParser.parseMetaObject($(this)) || '';
        }
      } else if ($(this).hasClass("meta_simple_collection")) {
        var name = $(this).attr("name");
        if (result[name] !== undefined) {
          if (!result[name].push) {
            result[name] = [result[name]];
          }
          if (this.value) {
            if ($.isNumeric(this.value)) {
              result[name].push(parseFloat(this.value));
            } else {
              result[name].push(this.value);
            }
          }
        }else{
          if (this.value) {
            if ($.isNumeric(this.value)) {
              result[name]=[parseFloat(this.value)];
            } else {
              result[name]=[this.value];
            }
          }
        }
      }
      else{
        if ($(this).attr("name")) {
          var name = $(this).attr("name");
          if (result[name] !== undefined) {
            if (!result[name].push) {
              result[name] = [result[name]];
            }
            if (this.value) {
              if ($.isNumeric(this.value)) {
                result[name].push(parseFloat(this.value));
              } else {
                result[name].push(this.value);
              }
            }else{
              result[name].push(null);
            }

          } else {
            if (this.value) {
              if ($.isNumeric(this.value)) {
                result[name]=(parseFloat(this.value));
              } else {
                result[name]=(this.value);
              }
            }else{
              result[name] = null;
            }

          }
        }
        result = MetaFormParser.parseMetaObject($(this), result);
      }
    });

    return result;
  }
}