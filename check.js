var getJSON = function(url, onLoad) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = onLoad
    xhr.send();
};
var onLoad = function(success, faliure) {
    var status = xhr.status;
    if (status == 200) {
      success(xhr.response);
    } else {
      failure(status);
    }
}
var success = function(data) {
    url = "http://" data.ip + "." + data.cust + ".mon.ly/"
    //get the above url, this will nxdomain but we dont care
}
var failure = function(error) {
    // how do we get the customer 
    url = "http://" status + "." + data.cust + ".mon.ly/"
    //get the above url, this will nxdomain but we dont care
}

getJSON("http://cust.mon.ly", onLoad)


