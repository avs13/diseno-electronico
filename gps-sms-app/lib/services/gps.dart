import 'dart:async';
import 'package:geolocator/geolocator.dart';
import 'package:fluttertoast/fluttertoast.dart';

void getLocation(Function(double, double, int) onUpdate) async {
  StreamSubscription<Position>? positionStream;

  const LocationSettings locationSettings = LocationSettings(
    accuracy: LocationAccuracy.best,
    //distanceFilter: 1,
  );

  bool permissionsLocation = await checkPermission();
  if (permissionsLocation && positionStream == null) {
    positionStream =
        Geolocator.getPositionStream(locationSettings: locationSettings)
            .listen((Position? position) {
      if (position != null) {
        var timestamp = position.timestamp;
        if (timestamp != null) {
          onUpdate(position.latitude, position.longitude,
              timestamp.millisecondsSinceEpoch);
        }
      }
    });
  }
}

Future<bool> checkPermission() async {
  LocationPermission permission;
  permission = await Geolocator.checkPermission();
  if (permission == LocationPermission.denied) {
    permission = await Geolocator.requestPermission();
    if (permission == LocationPermission.denied) {
      Fluttertoast.showToast(msg: 'Sin permisos de ubicacion');
      return false;
    }
  }
  if (permission == LocationPermission.deniedForever) {
    Fluttertoast.showToast(msg: 'Sin permisos de ubicacion permante');
    return false;
  }
  return true;
}
