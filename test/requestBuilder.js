var content = "application/json";

module.exports = {

  contentType: content,

  buildRangeJson: function(range) {
    return '"range":' + range;
  },

  buildNumberJson: function(number) {
    return '"number":' + number;
  },

  buildGenderJson: function(gender) {
    return '"gender":' + '"' + gender + '"';
  },

  buildStartsWithJson: function(startsWith) {
    return '"startsWith":' + '"' + startsWith + '"';  
  },

  buildReq: function(items, type) {
    var json = '{"body":{';
      if (items && items.length > 0) {
        for (var i = 0; i < items.length; ++i) {
          json += items[i] += i != items.length-1 ? "," : "";
        }
      }
    json += "}}";
    var req = JSON.parse(json);
    req.get = function(header, value) {
      return type ? type : content;
    }
    return req;
  }
};
