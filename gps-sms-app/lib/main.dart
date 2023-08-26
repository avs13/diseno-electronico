import 'dart:async';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'services/udp.dart';
import 'services/tcp.dart';
import 'utils/validateIP.dart';
void main() {
  runApp(const MyApp());
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

Uint8List locationToListBytes(double latitude,double longitude,int timestamp) {
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
  double latitude = 0;
  double longitude = 0;
  List<String> listIp = [""];
  List<int> listPort = [0];
  String ip = "";
  int port = 80;
  int timestamp = 0;



  StreamSubscription<Position>? positionStream;
  final LocationSettings locationSettings = const LocationSettings(
    accuracy: LocationAccuracy.high,
    distanceFilter: 100,
  );

  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    getLocation();

  }

  void getLocation() async {
    bool permissionsLocation = await checkPermission();
    if (permissionsLocation && positionStream == null ){
      positionStream = Geolocator.getPositionStream(locationSettings: locationSettings).listen((Position? position) {
        if(position != null) {
          longitude = position.longitude;
          latitude = position.latitude;
          var timestamp = position.timestamp;
          if(timestamp != null){
            this.timestamp = timestamp.millisecondsSinceEpoch;
          }
          setState(() {});
        }
      });
    }
  }

  Future<bool> checkPermission() async  {
    LocationPermission permission;
    permission = await Geolocator.checkPermission();
    if(permission == LocationPermission.denied){
      permission = await Geolocator.requestPermission();
      if(permission == LocationPermission.denied){
        Fluttertoast.showToast(
            msg: 'Sin permisos de ubicacion',
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.CENTER,
            backgroundColor: Colors.red,
            textColor: Colors.white,
            fontSize: 16.0
        );
        return false;
      }
    }
    if (permission == LocationPermission.deniedForever) {
      Fluttertoast.showToast(
          msg: 'Sin permisos de ubicacion permante',
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.CENTER,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0
      );
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(title: const Text("Enviar ubicacion"),
        centerTitle: true,
        backgroundColor: Colors.redAccent,
      ),
      body: Center(child:
      Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Center(child:  Text("Coordenadas", style: TextStyle(fontSize: 20))),
            Center(child:  Text(latitude == "" ?'Sin permisos': 'Latitud:$latitude Longitud: $longitude timestamp: $timestamp',)),
            const SizedBox(height: 50),
            const SizedBox(height: 10),
            SizedBox(width: 300,
              child:TextField(onChanged: (value){
                if(value.isNotEmpty){
                  listIp = [];
                  listPort = [];
                  if(value.length > 1){
                    var list = value.split(" ");
                    for (String val in list){
                      if(ipIsValid(val)){
                        var v = val.split(":");
                        listIp.add(v[0]);
                        var port = 80;
                        if(v.length == 2){
                         port = int.parse(v[1]);
                        }
                        listPort.add(port);
                      }

                    }
                  }
                if(listIp.isEmpty){
                  listIp = [""];
                  listPort = [0];
                }
                  setState((){});
                  }
                },
                decoration: const InputDecoration(border: OutlineInputBorder(),labelText: "Direccion IP",),
                keyboardType: TextInputType.datetime,
              ),
            ),
          ]),),
      floatingActionButton: Column(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          FloatingActionButton(
            onPressed: (){
              if(listIp[0] == ""){
                Fluttertoast.showToast(msg: 'No hay IPs validas');
              }
              else{
                for (var i = 0; i < listIp.length; i++) {
                  sendMessageByUDP(listIp[i],listPort[i],locationToListBytes(longitude,latitude,timestamp));
                }
              }
            },
            child: const Text("UDP") ,
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            onPressed: (){
              if(listIp[0] == ""){
                Fluttertoast.showToast(msg: 'No hay IPs validas');
              }
              else{
                for (var i = 0; i < listIp.length; i++) {
                  sendMessageByTCP(listIp[i],listPort[i],locationToListBytes(longitude,latitude,timestamp));
                }
              }
            },
            child: const Text("TCP"),
          ),
          const SizedBox(height: 10),

        ],),
    );//
  }
}
