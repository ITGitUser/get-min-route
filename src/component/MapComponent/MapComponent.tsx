import { YMaps, Map, Polyline, Placemark } from "react-yandex-maps";
import { IPropsMapComponent } from "../interfaces/interfaces";

const MapComponent = ({
  coords,
  centerMap,
  startPoints,
  viewPoints,
}: IPropsMapComponent) => {
  return (
    <YMaps>
      <Map
        defaultState={{ center: [55.751574, 37.573856], zoom: 8 }}
        state={{ center: centerMap, zoom: 7 }}
        style={{ width: "100%", height: "100%", minHeight: "450px" }}
      >
        {viewPoints &&
          startPoints &&
          startPoints.map((coord) => {
            return (
              <Placemark
                options={{ preset: "islands#circleIcon" }}
                geometry={coord}
              />
            );
          })}
        {<Polyline geometry={coords} />}
      </Map>
    </YMaps>
  );
};
/**
 * {startPoints &&
          startPoints.map((point) => {
            return <Placemark geometry={point} />;
          })}
 * 
 */
/*
 {coords.map((coord) => {
          return (
            <Placemark
              options={{ preset: "islands#circleIcon" }}
              geometry={coord}
            />
          );
        })}
*/
/*{coords.map((coord) => {
          return <Placemark geometry={coord} />;
        })} 
        {<Polyline geometry={coords} />}
        {clasters.map((claster) => {
          return <Polyline geometry={claster} />;
        })}

        {clasters.map((claster) => {
          return <Polyline geometry={claster} />;
        })}
        */
export default MapComponent;
