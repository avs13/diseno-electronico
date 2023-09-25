import React from 'react';

export const WelcomePage: React.FC = () => {
  return (
    <div className="welcome-page">
      <h1>Le damos la bienvenida a la central de MY GPS App</h1>
      <p>
        Aquí podrá visualizar toda la información recopilada y en tiempo real acerca de los recorridos realizados y llevar un control sobre estos.
      </p>

      <div className="instructions">
        <h2>En la esquina superior izquierda encontrará un desplegable indicado por un ícono de tres renglones donde podrá observar dos pestañas.</h2>

        <h3>Ubicación actual</h3>
        <p>
          Le permitirá observar la ubicación actual del vehículo en tiempo real. Asimismo, tendrá la opción de activar o desactivar la línea que marca el recorrido.
        </p>

        <h3>Históricos</h3>
        <p>
          Le permitirá observar los recorridos realizados por el vehículo a partir de una fecha y hora determinada.
        </p>
      </div>

      <h2>¿Cómo funciona?</h2>
      <p>
        Deberá seleccionar en el recuadro de fecha y hora, haciendo clic en el ícono de calendario, la fecha inicial y final en la cual desea ver el recorrido, y hacer clic en el botón de "Buscar".
        Si desea buscar las rutas realizadas entre ciertas fechas pero, en un área específica, puede activar el toggle de "Buscar por área", elegir la distancia del radio de esta área, reconfigurar la fecha inicial y final, y por último darle clic en "Buscar". En la parte inferior del mapa tendrá acceso a una slider para poder visualizar ruta por ruta.
      </p>

      <h3>Recuerde que puede regresar a leer este tutorial, haciendo clic en la pestaña de "Inicio".</h3>
    </div>
  );
}

