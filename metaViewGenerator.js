/**
 * Created by RU$$ on 05.11.2014.
 *
 * Requieres:
 * - jQuery, jQueryUI, Bootstrap,
 * Optional:
 * - jQuery.DateTimePicker: http://xdsoft.net/jqplugins/datetimepicker/
 */

/**
 * FLAG - Set it to false if you don't want to use date view by editing of dates
 *        or jQuery.DateTimePicker is not installed
 * @type {boolean}
 */
var FLAG_JQUERY_DATETIMEPICKER = true;
/**
 * FLAG - Set it to false if you don't want to use upload images function
 * @type {boolean}
 */
var FLAG_UPLOADIMAGE_FUNCTION = true;
/**
 * This function should be implemented in dependence of Server, that use meta
 * This function takes an file object, elementId and callback, which is than called with the
 * uploaded url and elementId
 */
var UPLOAD_FILE_FUNKT;

/**
 * This should be set if bootstrap-material design used on the web
 * See: http://fezvrasta.github.io/bootstrap-material-design/
 * @type {Object}
 */
var BOTTSTRAP_MATERIAL = true;

var metaTemplatesStr = new Object();

/**
 * Global help function (private)
 * @param id
 * @param single
 */
var generateMetaTemplate = function (id, single) {
	if ($("#" + id).has("div").length && single) {
		alert("Only one instance of this object is possible!");
		return;
	}
	var tempTemplate = metaTemplatesStr[id].replace(/xXxXx/g, makeid());
	$('#' + id).append(tempTemplate);
};

/**
 * Global help function (private)
 * @param id
 * @param single
 */
var setNameForMetaId = function (id, value) {
	$('#' + id).attr("name", value);
};

/**
 * Global help function (private)
 * @param id
 * @param single
 */
var makeid = function () {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 5; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
};

/**
 * Global help function (private)
 * @param id
 * @param single
 */
var clearImage = function (id) {

	$('#' + id + "_url").val('');
	$('#' + id + "_url").change();
	$('#' + id + "_image").addClass('meta-no-image');
};

/**
 * Global help function (private)
 * @param id
 * @param single
 */
var loadimagefor = function (elemId) {
	$('#' + elemId + '_del_btn').attr("disabled", "disabled");
	$('#' + elemId + '_file_btn').attr("disabled", "disabled");
	$('#' + elemId + '_file').click();
	$('#' + elemId + '_file').change(function () {
		if (UPLOAD_FILE_FUNKT) {
			UPLOAD_FILE_FUNKT(this.files[0], elemId, setUrlImageMeta);
		} else {
			console.error("Please define image upload function for metaViewGenerator to use upload functionality!")
		}
	});
};

var setUrlImageMeta = function (url, elementId) {
	console.log("called back with " + elementId);
	$('#' + elementId + "_url").val(url);
	$('#' + elementId + "_url").change();
	$('#' + elementId + '_del_btn').removeAttr("disabled");
	$('#' + elementId + '_file_btn').removeAttr("disabled");
}

var MetaViewGenerator = {
	/**
	 * Function checks if l20n library is installed
	 * @param label
	 * @returns {string}
	 */
	getL20n: function (label) {
		if (document.l10n) {
			return document.l10n.getSync(label) + ":";
		} else {
			return label + ":";
		}
	},
	/**
	 * Generates the table view of given data, depends on its meta
	 * Returns the result in onComplete function. Skip FIELDS_TRANSIENT
	 * @param meta
	 * @param data
	 * @param onComplete
	 */
	generateTableView: function (meta, data, onComplete, order) {
		var result = '';
		if (meta.FIELDS_ALL) {

			if (order) {
				for (var i = order.length - 1; i > -1; i--) {
					if (this.contains(meta.FIELDS_ALL, order[i])) {
						var j = this.indexOf(meta.FIELDS_ALL, order[i]);
						meta.FIELDS_ALL.splice(j, 1);
						meta.FIELDS_ALL.unshift(order[i]);
					}
				}
			}

			result += '<div class="row" style="overflow:auto;"><div class="col-md-12">';
			result += '<table class="table table-hover table-striped">';
			result += '<thead>';
			result += '<tr>';
			for (var i = 0; i < meta.FIELDS_ALL.length; i++) {
				if (!this.contains(meta.FIELDS_TRANSIENT, meta.FIELDS_ALL[i])) {
					result += '<th>' + meta.FIELDS_ALL[i] + '</th>';
				}
			}
			result += '</tr>';
			result += '</thead>';
			result += '<tbody>';
			for (var i = 0; i < data.length; i++) {
				result += '<tr>';
				for (var j = 0; j < meta.FIELDS_ALL.length; j++) {
					if (!this.contains(meta.FIELDS_TRANSIENT, meta.FIELDS_ALL[j])) {
						result += '<td>';
						result += this.generateSimpleTypeElement(data[i], meta, meta.FIELDS_ALL[j]);

						result += '</td>';
					}
				}
				result += '</tr>'
			}
			result += '</tbody>';
			result += '</table>';
			result += '</div></div>';

		} else {
			result = "No Data Found!";
		}

		onComplete(result);
	},

	indexOf: function (arr, val) {
		if (!arr) {
			return -1;
		}
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] === val) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * Generates a list view of given data, depends on its meta. In list view will be only the fields given by metaAttr.
	 * Each list entry has a data-id and className depends on its meta
	 * @param meta
	 * @param data
	 * @param metaAttr - attribute to show
	 * @param showTitle
	 * @param showElements - element names to show, if undefined then all elements
	 * @param onComplete
	 */
	generateSelectableListViewForAttr: function (meta, data, metaAttr, showTitle, showFieldNames, showElements, onComplete) {
		var res = '';
		if (showTitle) {
			res += '<div class="alert alert-success" role="alert">Found: <b>' + data.length + '</b> entr' + (data.length == 1 ? "y" : "ies") + '. Select <b>' + meta.CLASS_NAME + '</b> you want to edit:</div>';
		}

		if (meta[metaAttr] === undefined) {
			res = '<div class="alert alert-danger" role="alert"> <b>' + meta.CLASS_NAME + '</b> has no ' + metaAttr + ' fields!</div>';
			onComplete(res);
			return;
		}

		res += '<div class="list-group" id="projectsListGroup" >';
		for (var i = 0; i < data.length; i++) {
			res += '<div class="list-group-item"';
			for (var j = 0; j < meta[metaAttr].length; j++) {
				res += 'data-' + meta[metaAttr][j] + '="' + ((data[i][meta[metaAttr][j]] !== "") ? data[i][meta[metaAttr][j]] : "---" ) + '"';
			}
			res += 'style="cursor:pointer;" onmouseover=$(this).addClass("list-group-item-info") onmouseout=$(this).removeClass("list-group-item-info")>';
			var first = true;
			for (var j = 0; j < meta[metaAttr].length; j++) {
				if (showElements) {
					if (this.contains(showElements, meta[metaAttr][j])) {
						res += (!first ? ", " : "") + (showFieldNames ? "<b>" + this.getL20n(meta[metaAttr][j]) + "</b> " : "") + ((data[i][meta[metaAttr][j]] !== "") ? data[i][meta[metaAttr][j]] : "---" );
						first = false;
					}
				} else {
					res += (!first ? ", " : "") + (showFieldNames ? "<b>" + this.getL20n(meta[metaAttr][j]) + "</b> " : "") + ((data[i][meta[metaAttr][j]] !== "") ? data[i][meta[metaAttr][j]] : "---" );
					first = false;
				}
			}
			res += '</div>';
		}
		res += '</div>';

		onComplete(res);
	},

	/**
	 * Generates a edit view: all fields with its inputs. Returns the result in onComplete function
	 * If object is undefined then it makes a 'create view' depends on meta model
	 * @param meta
	 * @param data
	 * @param onComplete
	 */
	generateObjectEditView: function (meta, data, onComplete) {
		var res = '';
		res += '<input type="hidden" name="classname" value="' + meta['CLASS_NAME'] + '">';
		if (!this.isJSONArray(meta.FIELDS_ALL)) {
			meta.FIELDS_ALL = [meta.FIELDS_ALL];
		}
		for (var i = 0; i < meta.FIELDS_ALL.length; i++) {
			// Check if actual field is a complex field
			var indexOfComplexMeta = (meta.FIELDS_COMPLEX !== undefined) ? this.containsComplex(meta.FIELDS_COMPLEX, meta.FIELDS_ALL[i]) : -1;
			if (indexOfComplexMeta !== -1) {
				var tempRes = '<div class="meta_complex_object_main meta-container"><div class="meta-container meta-legend">' + this.getL20n(meta.FIELDS_ALL[i]) + '</div>';
				var tempId = makeid();
				tempRes += '<div id="' + tempId + '">';
				if (typeof data !== 'undefined') {

					if (data[meta.FIELDS_ALL[i]] !== undefined && data[meta.FIELDS_ALL[i]].length !== undefined) {
						for (var k = 0; k < data[meta.FIELDS_ALL[i]].length; k++) {
							this.generateObjectEditView(meta.FIELDS_COMPLEX[indexOfComplexMeta].META_DATA, data[meta.FIELDS_ALL[i]][k], function (res2) {
								tempRes += '<div class="meta_complex_object meta_simple_collection_element" data-metaname="' + meta.FIELDS_ALL[i] + '"><div class="meta-button-legend"  align="right"><button type="button" class="btn btn-danger btn-xs" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);">X</button></div>';
								tempRes += res2;
								tempRes += '</div>';
							});
						}
					} else if (data[meta.FIELDS_ALL[i]] !== undefined && data[meta.FIELDS_ALL[i]].length === undefined) {
						this.generateObjectEditView(meta.FIELDS_COMPLEX[indexOfComplexMeta].META_DATA, data[meta.FIELDS_ALL[i]], function (res2) {
							tempRes += '<div class="meta_complex_object meta_simple_collection_element"  data-metaname="' + meta.FIELDS_ALL[i] + '"><div class="meta-button-legend"  align="right"><button type="button" class="btn btn-danger btn-xs" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);">X</button></div>';
							tempRes += res2;
							tempRes += '</div>';
						});
					}
				}

				var single = true;
				if (meta.FIELDS_COMPLEX[indexOfComplexMeta].ATTRIBUTE_TYPE === "COLLECTION") {
					single = false;
				}
				metaTemplatesStr[tempId] = '<div class="meta_complex_object meta_simple_collection_element" data-metaname="' + meta.FIELDS_ALL[i] + '"><div  class="meta-button-legend" align="right" ><button type="button" class="btn btn-danger btn-xs" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);">X</button></div>';
				this.generateObjectEditView(meta.FIELDS_COMPLEX[indexOfComplexMeta].META_DATA, undefined, function (res2) {
					metaTemplatesStr[tempId] += res2;
				});
				metaTemplatesStr[tempId] += "</div>";

				tempRes += '</div><div align="right"><button type="button" class="btn btn-success btn-sm" onclick="generateMetaTemplate(\'' + tempId + '\', ' + single + ');">Add</button></div>';
				tempRes += "</div>";

				res += tempRes;

			} else
			// Check if actual field is an index
			if (meta.FIELDS_ALL[i] === meta.TYPE_ID) {
				res += '<input type="hidden" name="id" value="';
				if (typeof data !== 'undefined') {
					res += data[meta.FIELDS_ALL[i]];
				}
				res += '">';

				// Check if actual field is a simple collection
			} else if (meta.TYPE_SIMPLE_COLLECTION !== undefined && this.contains(meta.TYPE_SIMPLE_COLLECTION, meta.FIELDS_ALL[i])) {
				var tempRes = '<div class="meta-container" data-metaname="' + meta.FIELDS_ALL[i] + '"><div class="meta-container meta-legend">' + this.getL20n(meta.FIELDS_ALL[i]) + '</div>';
				var tempId = makeid();
				tempRes += '<div id="' + tempId + '">'

				if (typeof data !== 'undefined') {
					for (var k = 0; k < data[meta.FIELDS_ALL[i]].length; k++) {
						tempRes += '<div class="meta_simple_collection_element"><div class="meta-button-legend"  align="right"><button type="button" class="btn btn-danger btn-xs" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);">X</button></div>';
						tempRes += this.generateSimpleTypeElementEdit(data[meta.FIELDS_ALL[i]][k], meta, meta.FIELDS_ALL[i], false, "meta_simple_collection");
						tempRes += '</div>';
					}
				}

				metaTemplatesStr[tempId] = '<div class="meta_simple_collection_element"><div class="meta-button-legend"  align="right"><button type="button" class="btn btn-danger btn-xs" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);">X</button></div>';
				metaTemplatesStr[tempId] += this.generateSimpleTypeElementEdit(undefined, meta, meta.FIELDS_ALL[i], false, "meta_simple_collection");
				metaTemplatesStr[tempId] += '</div>';

				tempRes += '</div><div align="right"><button type="button" class="btn btn-success btn-sm" onclick="generateMetaTemplate(\'' + tempId + '\', false);">Add</button></div>';
				tempRes += '</div>';

				res += tempRes; //this.generateSimpleTypeElementEdit(data,meta,i);

			} else
			// check if type is a simple map
			if (meta.TYPE_SIMPLE_MAP !== undefined && this.contains(meta.TYPE_SIMPLE_MAP, meta.FIELDS_ALL[i])) {
				var tempRes = '<div class="meta_simple_map meta_complex_object" data-metaname="' + meta.FIELDS_ALL[i] + '"><div class="meta-container meta-legend">' + this.getL20n(meta.FIELDS_ALL[i]) + '</div>';
				var tempId = makeid();
				tempRes += '<div id="' + tempId + '">'

				if (typeof data !== 'undefined') {
					for (var key in data[meta.FIELDS_ALL[i]]) {
						if (data[meta.FIELDS_ALL[i]].hasOwnProperty(key)) {
							var tempId2 = makeid();
							tempRes += '<div class="meta_simple_collection_element"><div class="meta-button-legend"   align="right"><button type="button" class="btn btn-danger btn-xs" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);">X</button></div>';
							tempRes += '<table class="meta_map_value_paar"><tr><td><input class="form-control" type="text" value="' + key + '" onkeyup="setNameForMetaId(\'' + tempId2 + '\',this.value)"></td><td><input id="' + tempId2 + '" name="' + key + '" class="form-control" type="text" value="' + data[meta.FIELDS_ALL[i]][key] + '"></td></tr></table>';
							tempRes += '</div>';
						}
					}
				}

				metaTemplatesStr[tempId] = '<div class="meta_simple_collection_element"><div class="meta-button-legend" align="right"><button type="button" class="btn btn-danger btn-xs" onclick="this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);">X</button></div>';
				metaTemplatesStr[tempId] += '<table class="meta_map_value_paar"><tr><td><input class="form-control" type="text" value="" onkeyup="setNameForMetaId(\'xXxXx\',this.value)"></td><td><input id="xXxXx" name="" class="form-control" type="text" value=""></td></tr></table>';
				metaTemplatesStr[tempId] += '</div>';

				tempRes += '</div><div align="right"><button type="button" class="btn btn-success btn-sm" onclick="generateMetaTemplate(\'' + tempId + '\', false);">Add</button></div>';
				tempRes += '</div>';

				res += tempRes; //this.generateSimpleTypeElementEdit(data,meta,i);

			}
			else {
				if (typeof  data !== "undefined") {
					res += this.generateSimpleTypeElementEdit(data[meta.FIELDS_ALL[i]], meta, meta.FIELDS_ALL[i], true);
				} else {
					res += this.generateSimpleTypeElementEdit(undefined, meta, meta.FIELDS_ALL[i], true);
				}
			}
		}
		onComplete(res);
	},

	/**
	 * This is for generating of an element view, without editing and convert it in user friendly view
	 * e.g. image url -> image, date long format -> date
	 * @param data
	 * @param meta
	 * @param fieldName
	 * @returns {string}
	 */
	generateSimpleTypeElement: function (data, meta, fieldName) {
		var res = "";
		if (this.contains(meta.TYPE_DATE_LONG, fieldName)) {
			if (data[fieldName]) {
				var dateCreated = new Date(data[fieldName]);
				res += dateCreated.getFullYear() + "." + (dateCreated.getMonth() + 1) + "." + dateCreated.getDate() + " " + dateCreated.getHours() + ":" + dateCreated.getMinutes() + ":" + dateCreated.getSeconds();
			} else {
				res += '---';
			}
		} else if (this.contains(meta.TYPE_URL_IMAGE, fieldName)) {
			if (data[fieldName]) {
				res += "<img src='" + data[fieldName] + "' style='height:50px;'/>";
			} else {
				res += 'No Image';
			}
		} else if (this.contains(meta.TYPE_SIMPLE_MAP, fieldName)) {
			if (data[fieldName]) {
				for (var key in data[fieldName]) {
					if (data[fieldName].hasOwnProperty(key)) {
						res += (key + " -> " + data[fieldName][key]) + "<br/>";
					}
				}
			} else {
				res += '---';
			}
		} else {
			res += data[fieldName];
		}
		return res;
	},

	/**
	 * This is for generating of an input field with special logic, e.g. image, date, boolean or just simple input
	 * @param data
	 * @param meta
	 * @param fieldName
	 * @param setNameLabel
	 * @returns {string}
	 */
	generateSimpleTypeElementEdit: function (data, meta, fieldName, setNameLabel, addClass) {
		if (typeof addClass === "undefined") {
			addClass = "";
		}
		var res = "";
		if (meta.TYPE_BOOLEAN !== undefined && this.contains(meta.TYPE_BOOLEAN, fieldName)) {
			res += '<div class="form-group">';
			if (setNameLabel) {
				res += '<label for="' + fieldName + '">' + this.getL20n(fieldName) + '</label>';
			}
			res += '<select name="' + fieldName + '" class="form-control ' + addClass + '"> <option ' + (typeof data !== 'undefined' && data ? "selected" : "") + '>true</option><option ' + (typeof data !== 'undefined' && !data ? "selected" : "") + '>false</option></select>';
			res += '</div>';
		} else if (meta.TYPE_DATE_LONG !== undefined && this.contains(meta.TYPE_DATE_LONG, fieldName) && FLAG_JQUERY_DATETIMEPICKER) {
			res += '<div class="form-group">';
			if (setNameLabel) {
				res += '<label for="' + fieldName + '">' + this.getL20n(fieldName) + '</label>';
			}
			var tempId = makeid();
			res += (BOTTSTRAP_MATERIAL?'<div class="form-control-wrapper">':'');
			res += '<input type="hidden" class="' + addClass + '" id="' + tempId + '_long" name="' + fieldName + '" value="">';
			res += '<input type="text" class="form-control" id="' + tempId + '_date" value="">';
			res += (BOTTSTRAP_MATERIAL?' <span class="material-input"></span></div>':'');
			res += '<script>$(function() {$("#' + tempId + '_date").datetimepicker({allowBlank:true, onChangeDateTime: function(dp, $input){$("#' + tempId + '_long").val((dp===null)?null:dp.getTime());}}); ';
			if (typeof data !== 'undefined') {
				var tD = new Date(data);
				res += '$("#' + tempId + '_date").datetimepicker({value:"' + tD.getFullYear() + '/' + ((tD.getMonth() + 1) < 10 ? '0' + (tD.getMonth() + 1) : (tD.getMonth() + 1)) + '/' + (tD.getDate() < 10 ? '0' + tD.getDate() : tD.getDate()) + ' ' + (tD.getHours() < 10 ? "0" + tD.getHours() : tD.getHours()) + ':' + (tD.getMinutes() < 10 ? "0" + tD.getMinutes() : tD.getMinutes()) + '", format:"Y/m/d H:i"}); ';
				res += '$("#' + tempId + '_long").val(' + data + ');';
			}
			res += '});</script>';
			res += '</div>';
		} else if (meta.TYPE_URL_IMAGE !== undefined && this.contains(meta.TYPE_URL_IMAGE, fieldName)) {
			res += '<div class="form-group">';
			if (setNameLabel) {
				res += '<label for="' + fieldName + '">' + this.getL20n(fieldName) + '</label>';
			}
			var tempId = makeid();
			res += '<div class="meta-container" >' +
			'<div class="row"><div class="col-md-3"><div class="meta-container" style="display:block;height:110px;" ><img id="' + tempId + '_image" class="meta-image ';
			if (typeof data !== 'undefined') {
				res += '" src="' + data + '">';
			} else {
				res += 'meta-no-image">';
			}
			res += '</div></div><div class="col-md-9" align="right">' +
			'<table class="meta_full_width"><tr><td>Url: </td><td class="' + (BOTTSTRAP_MATERIAL ? " form-control-wrapper" : "") + '"><input id="' + tempId + '_url" type="text" class="form-control ' + addClass + '" name="' + fieldName + '" value="';

			if (typeof data !== 'undefined') {
				res += data;
			}
			res += '" ' + (meta.FIELDS_READ_ONLY !== undefined && this.contains(meta.FIELDS_READ_ONLY, fieldName) ? 'readonly' : '');
			res += '>' + (BOTTSTRAP_MATERIAL ? '<span class="material-input"></span>' : '') + '</td></tr></table>';
			res += '<div style="margin-top: 10px;"><button id="' + tempId + '_del_btn" type=button class="btn btn-danger btn-sm" onclick="clearImage(\'' + tempId + '\');">Delete</button>'
			if (FLAG_UPLOADIMAGE_FUNCTION) {
				res += '<button id="' + tempId + '_file_btn" type=button class="btn btn-primary btn-sm" style="margin-left: 10px;" onclick="loadimagefor(\'' + tempId + '\');">Select file</button><input type="file" id="' + tempId + '_file" class="meta-no-image" /> ';
			}

			res += '</div></div></div></div>';

			res += '</div>';
			res += '<script> $("#' + tempId + '_url").change(function(ti){console.log(ti.target.value);$("#' + tempId + '_image").attr("src",ti.target.value);$("#' + tempId + '_image").removeClass("meta-no-image");})</script>'
		} else {
			res += '<div class="form-group">';
			if (setNameLabel) {
				res += '<label for="' + fieldName + '">' + this.getL20n(fieldName) + '</label>';
			}
			res += (BOTTSTRAP_MATERIAL?'<div class="form-control-wrapper">':'');
			res += '<input type="text" class="form-control ' + addClass + '" name="' + fieldName + '" value="';
			if (typeof data !== 'undefined') {
				res += (this.isJSONArray(data) ? '[' + data + ']' : data);
			}
			res += '" '
			if (typeof data !== 'undefined') {
				res += (meta.FIELDS_READ_ONLY !== undefined && this.contains(meta.FIELDS_READ_ONLY, fieldName) ? 'readonly' : '');
			}
			res += '>'+(BOTTSTRAP_MATERIAL?' <span class="material-input"></span></div>':'')+'</div>';
		}
		return res;
	},

	/**
	 * Check if an object is json array
	 * @param what
	 * @returns {boolean}
	 */
	isJSONArray: function (what) {
		return Object.prototype.toString.call(what) === '[object Array]';
	},

	/**
	 * Check if an object contains in array
	 * @param arr
	 * @param val
	 * @returns {boolean}
	 */
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
	},

	/**
	 * Check if an attribute contains in meta list of complex object
	 * @param arrComplex
	 * @param complex
	 * @returns {number} index of object
	 */
	containsComplex: function (arrComplex, complex) {
		for (var i = 0; i < arrComplex.length; i++) {
			if (arrComplex[i].ATTRIBUTE_NAME === complex) {
				return i;
			}
		}
		return -1;
	},

	/**
	 * Sets flags for generating edit view components
	 * @param datetimepicker_enabled
	 * @param imageupload_enabled
	 */
	setFlags: function (datetimepicker_enabled, imageupload_enabled) {
		FLAG_JQUERY_DATETIMEPICKER = datetimepicker_enabled;
		FLAG_UPLOADIMAGE_FUNCTION = imageupload_enabled;
	},

	setUploadFunction: function (uploadFunction) {
		UPLOAD_FILE_FUNKT = uploadFunction;
	}

};

