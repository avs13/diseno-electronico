
import 'dart:convert';
import 'dart:io';
import 'package:fluttertoast/fluttertoast.dart';

void sendMessageByTCP(String ip,int port,String message){
  RawSocket.connect(ip, port).then((socket) {
    socket.write(const Utf8Codec().encode(message));
    socket.listen((event) {
      if (event == RawSocketEvent.write) {
        socket.close();
        Fluttertoast.showToast(msg: "Enviado TCP");
      }
    });
  });
}