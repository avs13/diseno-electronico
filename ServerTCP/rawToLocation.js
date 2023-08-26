function rawToLocation(raw){
  let longitude = hexToNumber(reverseHexa(raw.slice(0,16)))
  let latitude =  hexToNumber(reverseHexa(raw.slice(16,32)))
  let timestamp = parseInt(reverseHexa(raw.slice(32,48)),16)
  return {
    latitude,
    longitude,
    timestamp
  }
}

function reverseHexa(hex) {

  hex = hex.toString();

  const bytes = [];
  for (let i = 0; i < hex.length; i += 2) {
    bytes.push(hex.substr(i, 2));
  }

  return bytes.reverse().join("");
}

function hexToNumber(str) {
  str = (str + "0000000000000000").slice(0,16);
  var sign_and_exponent_bits = parseInt(str.slice(0,3), 16);
  var sign = sign_and_exponent_bits >= 0x800 ? -1 : +1;
  var exponent_bits = sign_and_exponent_bits & ((1<<11) - 1);
  var significand_bits = parseInt(str.slice(3,16), 16);
  if (exponent_bits == 0x7FF)
    return significand_bits == 0 ? sign * Number.POSITIVE_INFINITY : Number.NaN;
  else if (exponent_bits == 0)
    return sign * Math.pow(2, 1-1023-52) * significand_bits;
  else 
    return sign * Math.pow(2, exponent_bits-1023-52) * (Math.pow(2, 52) + significand_bits);
}
module.exports = {
  rawToLocation
}