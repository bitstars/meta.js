/**
 * Created by RU$$ on 13.11.2014.
 */

var MetaValidator = {
    getL20n: function(label){
      if(document.l10n){
        return document.l10n.getSync(label);
      }else{
        return label;
      }
    },
    // @Deprecated
    validateObject_old: function (object, meta, error, success) {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          if (meta.FIELDS_NOT_NULL !== undefined && this.contains(meta.FIELDS_NOT_NULL, key)) {
            if (object[key].trim() === "") {
              error("Field <b>" + key + "</b> cannot be empty!");
              return false;
            }
          }

          if (meta.FIELDS_REGEX !== undefined) {
            for (var j = 0; j < meta.FIELDS_REGEX.length; j++) {
              if (meta.FIELDS_REGEX[j].hasOwnProperty(key)) {
                if (!object[key].match(meta.FIELDS_REGEX[j][key])) {
                  console.log("Value <b>" + object[key] + "</b> of field <b>" + key + "</b> cannot be matched by regex <b>" + meta.FIELDS_REGEX[j][key] + "</b>");
                  error("Value <b>" + object[key] + "</b> of field <b>" + key + "</b> has not right form!<br>Please, check it.");
                  return;
                }
              }
            }
          }
        }
      }
      success();
    },
    /**
     * Validates an object depends on its meta model
     * @param object
     * @param meta
     * @param error
     * @returns {boolean}
     */
    validateObject: function (object, meta, error) {
      var resOk = true;
      // check fields not null
      if (typeof meta.FIELDS_NOT_NULL !== "undefined") {
        for (var k=0;k<meta.FIELDS_NOT_NULL.length;k++) {
            if (typeof object[meta.FIELDS_NOT_NULL[k]] === "undefined" || object[meta.FIELDS_NOT_NULL[k]].toString().trim() === "") {
              error("Field <b>" + this.getL20n(meta.FIELDS_NOT_NULL[k])+"</b> cannot be empty!");
              resOk = false;
            }
        }
      }

      // check fields regex
      if (typeof meta.FIELDS_REGEX !== "undefined") {
        for (var j = 0; j < meta.FIELDS_REGEX.length; j++) {
          for (var key in meta.FIELDS_REGEX[j]) {
            if (meta.FIELDS_REGEX[j].hasOwnProperty(key)) {
              if (typeof object[key] !== "undefined") {
                var testling = meta.FIELDS_REGEX[j][key];
                if (!object[key].toString().match(testling)) {
                  console.log("Value <b>" + object[key] + "</b> of field <b>" + this.getL20n(key) + "</b> cannot be matched by regex <b>" + meta.FIELDS_REGEX[j][key] + "</b>");
                  error("Value <b>" + object[key] + "</b> of field <b>" + this.getL20n(key) + "</b> is incorrect.<br> Please, check it!");
                  resOk = false;
                }
              }
            }

          }
        }
      }


// check complex fields
      if (typeof meta.FIELDS_COMPLEX !== "undefined") {
        for (var j = 0; j < meta.FIELDS_COMPLEX.length; j++) {
          if (typeof object[meta.FIELDS_COMPLEX[j]["ATTRIBUTE_NAME"]] !== "undefined") {
            if (meta.FIELDS_COMPLEX[j]["ATTRIBUTE_TYPE"] === "COLLECTION") {
              for (var r = 0; r < object[meta.FIELDS_COMPLEX[j]["ATTRIBUTE_NAME"]].length; r++) {
                resOk &= this.validateObject(object[meta.FIELDS_COMPLEX[j]["ATTRIBUTE_NAME"]][r], meta.FIELDS_COMPLEX[j]["META_DATA"], error);
              }
            } else {
              resOk &= this.validateObject(object[meta.FIELDS_COMPLEX[j]["ATTRIBUTE_NAME"]], meta.FIELDS_COMPLEX[j]["META_DATA"], error);
            }
          }
        }
      }

// all tests done
      return resOk;
    },

    contains: function (arr, val) {
      if (!arr) {
        return false;
      }
      for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
          return true;
        }
      }
      return false;
    }
  }
  ;