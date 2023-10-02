import React from "react";
import { NavLink } from "react-router-dom";
export const WelcomePage: React.FC = () => {
  return (
    <div className="max-w-[800px] mx-auto">
      <div className="welcome-page">
        <h1 className="text-xl text-center font-bold pb-3">
          Le damos la bienvenida a la central de MY GPS App
        </h1>
        <h4>
          {" "}
          Aquí podrá visualizar toda la información recopilada y en tiempo real
          acerca de los recorridos realizados y llevar un control sobre estos.{" "}
        </h4>
      </div>
      <div className="instructions">
        <p>
          En la esquina superior izquierda encontrará un desplegable indicado
          por un ícono de tres renglones donde podrá observar dos pestañas.
        </p>

        <section className="hover:bg-slate-100 rounded-xl p-3">
          <h2 className="text-lg font-semibold italic pt-2">Home</h2>
          <p>
            Es la pestaña que usted visualiza en este momento dónde se encuentra
            la información relacionada acerca de cómo usar correctamente este
            servicio.
          </p>
        </section>
        <NavLink to="/real-time">
          <section className="hover:bg-slate-100 rounded-xl p-3">
            <h2 className="text-lg font-semibold italic pt-2">
              Ubicación actual
            </h2>
            <p>
              Le permitirá observar la ubicación actual del vehículo en tiempo
              real. Asimismo, tendrá la opción de activar o desactivar la línea
              que marca el recorrido.
            </p>
          </section>
        </NavLink>
        <NavLink to="/history">
          <section className="hover:bg-slate-100 rounded-xl p-3">
            <h2 className="text-lg font-semibold italic pt-2">Históricos</h2>
            <p>
              Le permitirá observar los recorridos realizados por el vehículo a
              partir de una fecha y hora determinada.
            </p>
            <h3 className="text-md font-semibold italic pt-1">
              ¿Cómo funciona?
            </h3>
            <p>
              Deberá seleccionar el rango de fechas y horarios deseados para ver el recorrido, 
              simplemente haga clic en el ícono del calendario en el recuadro correspondiente. 
              Luego, elija la fecha de inicio y la fecha de finalización que le interesen.

              Si desea buscar rutas específicas realizadas en un área determinada dentro de cierto período de tiempo, 
              puede hacerlo arrastrando el mouse mientras mantiene presionada la tecla "Shift" y haciendo clic con el botón izquierdo 
              del mouse para definir un radio de búsqueda en el mapa.

              En la parte inferior del mapa, encontrará un control deslizante (slider) que le permitirá visualizar las rutas una por una, 
              facilitando así su exploración.
            </p>
          </section>
        </NavLink>
      </div>

      <h4 className="italic text-sm">
        Recuerde que puede regresar a leer este tutorial, haciendo clic en la
        pestaña de "Home".
      </h4>
    </div>
  );
};
