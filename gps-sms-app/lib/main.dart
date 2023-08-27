import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'services/tcp.dart';
import 'utils/validateIP.dart';
import 'services/gps.dart';

void main() {
  runApp(const MyApp());
}

class GeoLocation {
  double latitude;
  double longitude;
  int timestamp;
  GeoLocation(this.latitude, this.longitude, this.timestamp);
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      //darkTheme: ThemeData.dark(),
      home: const MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

Uint8List locationToListBytes(
    double latitude, double longitude, int timestamp) {
  var list = Uint8List(24);
  list.buffer.asFloat64List()[0] = latitude;
  list.buffer.asFloat64List()[1] = longitude;
  list.buffer.asInt64List()[2] = timestamp;
  return list;
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  var textController = TextEditingController();
  GeoLocation location = GeoLocation(0, 0, 0);
  List<(String, int)> listIP = [("", 0)];
  String ip = "";
  int port = 80;
  Timer? timer;

  void inputHandler(String value) {
    if (value.isNotEmpty) {
      listIP = [];
      if (value.isNotEmpty) {
        var list = value.split(" ");
        for (String val in list) {
          if (ipIsValid(val)) {
            var ip = val.split(":");
            var port = 80;
            if (ip.length == 2) {
              port = int.parse(ip[1]);
            }
            listIP.add((ip[0], port));
          }
        }
      }
      if (listIP.isEmpty) {
        listIP = [("", 0)];
      }
      setState(() {});
    }
  }

  void onPressedTimer() {
    if (listIP[0].$1.isNotEmpty) {
      if (timer == null) {
        Fluttertoast.showToast(msg: "Envio automatico activado");

        timer = Timer.periodic(const Duration(seconds: 5), (time) {
          for (final (ip, port) in listIP) {
            sendMessageByTCP(
                ip,
                port,
                locationToListBytes(
                    location.longitude, location.latitude, location.timestamp));
          }
        });
        setState(() {});
      } else {
        Fluttertoast.showToast(msg: "Envio automatico desactivado");
        timer?.cancel();
        setState(() {
          timer = null;
        });
      }
    }
  }

  void onPressedTCP() {
    if (listIP[0].$1.isEmpty) {
      Fluttertoast.showToast(msg: 'No hay IPs validas');
    } else {
      for (final (ip, port) in listIP) {
        sendMessageByTCP(
            ip,
            port,
            locationToListBytes(
                location.longitude, location.latitude, location.timestamp));
      }
    }
  }

  StreamSubscription<Position>? positionStream;
  final LocationSettings locationSettings = const LocationSettings(
    accuracy: LocationAccuracy.high,
    distanceFilter: 1,
  );

  @override
  void initState() {
    super.initState();
    getLocation((latitude, longitude, timestamp) {
      location.latitude = latitude;
      location.longitude = longitude;
      location.timestamp = timestamp;
      setState(() {});
    });
  }

  //void getLocation() async {
  //  bool permissionsLocation = await checkPermission();
  //  if (permissionsLocation && positionStream == null) {
  //    positionStream =
  //        Geolocator.getPositionStream(locationSettings: locationSettings)
  //            .listen((Position? position) {
  //      if (position != null) {
  //        location.longitude = position.longitude;
  //        location.latitude = position.latitude;
  //        var timestamp = position.timestamp;
  //        if (timestamp != null) {
  //          location.timestamp = timestamp.millisecondsSinceEpoch;
  //        }
  //        setState(() {});
  //      }
  //    });
  //  }
  //}
//
  //Future<bool> checkPermission() async {
  //  LocationPermission permission;
  //  permission = await Geolocator.checkPermission();
  //  if (permission == LocationPermission.denied) {
  //    permission = await Geolocator.requestPermission();
  //    if (permission == LocationPermission.denied) {
  //      Fluttertoast.showToast(msg: 'Sin permisos de ubicacion');
  //      return false;
  //    }
  //  }
  //  if (permission == LocationPermission.deniedForever) {
  //    Fluttertoast.showToast(msg: 'Sin permisos de ubicacion permante');
  //    return false;
  //  }
  //  return true;
  //}
//
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Enviar ubicacion"),
        centerTitle: true,
        backgroundColor: Colors.redAccent,
      ),
      body: Center(
        child: Column(mainAxisAlignment: MainAxisAlignment.center, children: [
          const Text("Coordenadas", style: TextStyle(fontSize: 20)),
          Text('Latitud:${location.latitude}'),
          Text('Longitud: ${location.longitude}'),
          Text('Timestamp: ${location.timestamp}'),
          const SizedBox(height: 30),
          SizedBox(
            width: 300,
            child: TextField(
              enabled: timer == null ? true : false,
              onChanged: inputHandler,
              decoration: const InputDecoration(
                border: OutlineInputBorder(),
                labelText: "Direccion IP",
              ),
              keyboardType: TextInputType.datetime,
            ),
          ),
        ]),
      ),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: onPressedTimer,
            child: timer == null ? const Text("Timer") : const Text("Parar"),
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            onPressed: onPressedTCP,
            child: const Text("TCP"),
          ),
          const SizedBox(height: 10),
        ],
      ),
    ); //
  }
}
