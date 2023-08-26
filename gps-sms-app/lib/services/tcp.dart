
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'package:fluttertoast/fluttertoast.dart';

void sendMessageByTCP(String ip,int port,List<int> message){
  RawSocket.connect(ip, port).then((socket) {
    socket.write(message);
    socket.listen((event) {
      if (event == RawSocketEvent.write) {
        socket.close();
        Fluttertoast.showToast(msg: "Enviado TCP");
      }
    });
  });
}

Uint8List int64bytes(int value) =>
    Uint8List(8)..buffer.asInt64List()[0] = value;

Uint8List double64bytes(double value) =>
    Uint8List(8)..buffer.asFloat64List()[0] = value;