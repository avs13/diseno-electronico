import 'dart:async';
import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:telephony/telephony.dart';
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

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  String latitude = "";
  String longitude = "";
  String phone = "";
  List<String> listIp = [""];
  String ip = "";
  int port = 80;
  String timestamp = "";
  StreamSubscription<Position>? positionStream;
  final Telephony telephony = Telephony.instance;
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
          longitude = position.longitude.toString();
          latitude = position.latitude.toString();
          var timestamp = position.timestamp;
          if(timestamp != null){
            this.timestamp = timestamp.millisecondsSinceEpoch.toString();
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
      appBar: AppBar(title: const Text("Enviar ubicacion SMS"),
        centerTitle: true,
        backgroundColor: Colors.redAccent,
      ),
      body: Center(child:
      Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Center(child:  Text("Coordenadas", style: TextStyle(fontSize: 20))),
            Center(child:  Text(latitude == "" ?'Sin permisos': 'Latitud:$latitude Longitud: $longitude',)),
            const SizedBox(height: 50),
            SizedBox(width: 300, child:TextField(onChanged: (value){
              if(value.isNotEmpty){
                phone =value;
                setState(() {
                });
              }
            },decoration: const InputDecoration(border: OutlineInputBorder(),labelText: "Teléfono",),
              keyboardType: TextInputType.number,
            ),),
            const SizedBox(height: 10),
            SizedBox(width: 300,
              child:TextField(onChanged: (value){
                if(value.isNotEmpty){
                  if(ipIsValid(value)){
                    var v = value.split(":");
                    ip = v[0];
                    if(v.length == 2){
                      port = int.parse(v[1]);
                    }
                  }
                 else{
                    ip = value.split(":")[0];
                    port = 80;
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
              if(ipIsValid('$ip:$port')){
                sendMessageByUDP(ip,port,
                    'Tus coordenadas son : \n Latitud:$latitude \n Longitud: $longitude \n timestamp: $timestamp');
              }
              else{
                Fluttertoast.showToast(msg: 'Ip invalida ');
              }

            },
            child: const Text("UDP") ,
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            onPressed: (){
              if(ipIsValid('$ip:$port')){
                sendMessageByTCP(ip,port, 'Tus coordenadas son : \n Latitud:$latitude \n Longitud: $longitude \n timestamp: $timestamp');
              }
              else{
                Fluttertoast.showToast(msg: 'Ip invalida $ip:$port');
              }
            },
            child: const Text("TCP"),
          ),
          const SizedBox(height: 10),
          FloatingActionButton(
            onPressed: (){
              if(phone.length != 10){
                Fluttertoast.showToast(msg: 'Teléfono invalido');
              }
              if (positionStream == null ){
                getLocation();
              }
              if(phone.length == 10 && latitude != "" && longitude != ""){
                telephony.sendSms(to: phone, message: 'Tus coordenadas son : \n Latitud:$latitude \n Longitud: $longitude \n timestamp: $timestamp');
                Fluttertoast.showToast(msg: 'Ubicacion Enviada');
              }
            },
            child:const Icon(Icons.send) ,
          ),const SizedBox(height: 10),
        ],),
    );//
  }
}
