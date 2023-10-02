import React from 'react';
import './styles.css';
export const WelcomePage: React.FC = () => {
  return (
<html>
	<head>
		<title>Home</title>
	</head>
	<body>
	<div className="welcome-page">
		<h1>Le damos la bienvenida a la central de MY GPS App</h1>
      		<h4> Aquí podrá visualizar toda la información recopilada y en tiempo real acerca de los recorridos realizados y llevar un control sobre estos. </h4>
    	</div>
      	<div className="instructions">
        <p>
		En la esquina superior izquierda encontrará un desplegable indicado por un ícono de tres renglones donde podrá observar dos pestañas.
	</p>

        <h2>Home</h2>
        <p>
		Es la pestaña que usted visualiza en este momento dónde se encuentra la información relacionada acerca de cómo usar correctamente este servicio.
	</p>

        <h2>Ubicación actual</h2>
	<p>
		Le permitirá observar la ubicación actual del vehículo en tiempo real. Asimismo, tendrá la opción de activar o desactivar la línea que marca el recorrido.
	</p>

        <h2>Históricos</h2>
        <p>
          Le permitirá observar los recorridos realizados por el vehículo a partir de una fecha y hora determinada.
        </p>
	</div>
		
	<h3>¿Cómo funciona?</h3>
	<p>
        Deberá seleccionar en el recuadro de fecha y hora, haciendo clic en el ícono de calendario, la fecha inicial y final en la cual desea ver el recorrido, y hacer clic en el botón de "Buscar".
        Si desea buscar las rutas realizadas entre ciertas fechas pero, en un área específica, puede activar el toggle de "Buscar por área", elegir la distancia del radio de esta área, reconfigurar la fecha inicial y final, y por último darle clic en "Buscar". En la parte inferior del mapa tendrá acceso a un slider para poder visualizar ruta por ruta.
	</p>
	
	<h4>Recuerde que puede regresar a leer este tutorial, haciendo clic en la pestaña de "Home".</h4>
	</body>
</html>
  );
};
