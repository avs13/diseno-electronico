import 'dart:io';
import 'package:fluttertoast/fluttertoast.dart';

void sendMessageByTCP(String ip, int port, List<int> message) {
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
