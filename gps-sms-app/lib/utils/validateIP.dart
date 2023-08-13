bool ipIsValid(String ip){
  var regex = RegExp(r'^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}(:\d{1,5})?$');
  return regex.hasMatch(ip);
}