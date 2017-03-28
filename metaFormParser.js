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
                result[name]=(this.value).toString().replace(/&/g, '＆')
                  .replace(/ö/g, 'ӧ')
                  .replace(/ä/g, 'ӓ')
                  .replace(/ü/g, 'ue')
                  .replace(/ß/g, 'ẞ')
                  .replace(/Ö/g, 'Ӧ')
                  .replace(/Ü/g, 'Ue')
                  .replace(/Ä/g, 'Ӓ')
                  .replace(/</g, 'ᐸ')
                  .replace(/>/g, 'ᐳ')
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
  },

	parseForm: function (domElement, resultTemp) {

		var result = resultTemp;
		if (typeof resultTemp === "undefined") {
			result = new Object();
		}

		$(domElement).children().each(function () {
			if ($(this).attr("name")) {
				var name = $(this).attr("name");
				if (result[name] !== undefined) {
					if (!result[name].push) {
						result[name] = [result[name]];
					}
					if (this.value) {
						if (this.value.toLowerCase().trim() === "true") {
							result[name].push(true);
						} else if (this.value.toLowerCase().trim() === "false") {
							result[name].push(false);
						} else if ($.isNumeric(this.value)) {
							result[name].push(parseFloat(this.value));
						} else {
							result[name].push(JSON.parse(this.value));
						}
					} else {
						result[name].push(null);
					}

				} else {
					if (this.value) {
						if (this.value.toLowerCase().trim() === "true") {
							result[name] = true;
						} else if (this.value.toLowerCase().trim() === "false") {
							result[name] = false;
						} else if ($.isNumeric(this.value)) {
							result[name] = parseFloat(this.value);
						} else {
							//try to parse json
							try{
								result[name] = JSON.parse(this.value);
							}catch(e){
								result[name] = this.value;
							}

						}
					} else {
						result[name] = null;
					}

				}
			}
			result = MetaFormParser.parseForm($(this), result);
		});
		return result;
	}
}

module.exports = MetaFormParser;
