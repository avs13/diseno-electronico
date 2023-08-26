import "dart:convert";
import "dart:io";
import "dart:typed_data";
import "package:fluttertoast/fluttertoast.dart";


void sendMessageByUDP(String ip,int port,List<int> message){
  RawDatagramSocket.bind(InternetAddress.anyIPv4, 8000).then((socket) {
    socket.send(message,InternetAddress(ip), port);
    socket.listen((event) {
      if (event == RawSocketEvent.write) {
        socket.close();
        Fluttertoast.showToast(msg: "Enviado UDP");
      }
    });
  });
}



Uint8List double64bytes(double value) =>
    Uint8List(8)..buffer.asFloat64List()[0] = value;
//const Utf8Codec().encode(message)