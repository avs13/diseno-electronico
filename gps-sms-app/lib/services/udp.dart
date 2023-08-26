import "dart:io";
import "package:fluttertoast/fluttertoast.dart";

void sendMessageByUDP(String ip, int port, List<int> message) {
  RawDatagramSocket.bind(InternetAddress.anyIPv4, 8000).then((socket) {
    socket.send(message, InternetAddress(ip), port);
    socket.listen((event) {
      if (event == RawSocketEvent.write) {
        socket.close();
        Fluttertoast.showToast(msg: "Enviado UDP");
      }
    });
  });
}
