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
                  .replace(/&amp;/g, '＆')
                  .replace(/ß/g, 'ẞ')
                  .replace(/</g, 'ᐸ')
                  .replace(/>/g, 'ᐳ')
                  .replace(/"/g, 'ʺ')
                  .replace(/Á/g, '\u0041\u0301')
                  .replace(/À/g, '\u0041\u0300')
                  .replace(/Ä/g, '\u0041\u0308')
                  .replace(/Ã/g, '\u0041\u0303')
                  .replace(/Â/g, '\u0041\u0302')
                  .replace(/Å/g, '\u0041\u030A')
                  .replace(/Ç/g, '\u0043\u0327')
                  .replace(/É/g, '\u0045\u0301')
                  .replace(/È/g, '\u0045\u0300')
                  .replace(/Ë/g, '\u0045\u0308')
                  .replace(/Ê/g, '\u0045\u0302')
                  .replace(/Í/g, '\u0049\u0301')
                  .replace(/Ì/g, '\u0049\u0300')
                  .replace(/Ï/g, '\u0049\u0308')
                  .replace(/Î/g, '\u0049\u0302')
                  .replace(/Ñ/g, '\u004e\u0303')
                  .replace(/Ó/g, '\u004F\u0301')
                  .replace(/Ò/g, '\u004F\u0300')
                  .replace(/Ö/g, '\u004F\u0308')
                  .replace(/Ô/g, '\u004F\u0302')
                  .replace(/Ú/g, '\u0055\u0308')
                  .replace(/Ù/g, '\u0055\u0300')
                  .replace(/Ü/g, '\u0055\u0308')
                  .replace(/Û/g, '\u0055\u0302')
                  .replace(/á/g, '\u0061\u0301')
                  .replace(/à/g, '\u0061\u0300')
                  .replace(/ã/g, '\u0061\u0303')
                  .replace(/ä/g, '\u0061\u0308')
                  .replace(/â/g, '\u0061\u0302')
                  .replace(/å/g, '\u0061\u030a')
                  .replace(/ç/g, '\u0063\u0327')
                  .replace(/é/g, '\u0065\u0301')
                  .replace(/è/g, '\u0065\u0300')
                  .replace(/ë/g, '\u0065\u0308')
                  .replace(/ê/g, '\u0065\u0302')
                  .replace(/ó/g, '\u006f\u0301')
                  .replace(/ò/g, '\u006e\u0300')
                  .replace(/ô/g, '\u006f\u0302')
                  .replace(/ö/g, '\u006f\u0308')
                  .replace(/ù/g, '\u0075\u0301')
                  .replace(/ú/g, '\u0075\u0300')
                  .replace(/ü/g, '\u0075\u0308')
                  .replace(/û/g, '\u0075\u0302')
                  .replace(/í/g, '\u0069\u0301')
                  .replace(/ì/g, '\u0069\u0300')
                  .replace(/ì/g, '\u0069\u0300')
                  .replace(/ï/g, '\u0069\u0308')
                  .replace(/î/g, '\u0069\u0302')
                  .replace(/ñ/g, '\u006e\u0303')
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
