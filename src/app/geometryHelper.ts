import { HelperClass } from "./helperClass";

export interface Point {
    x: number, y: number
}

export interface LimitsX {
    bottom: number,
    upper: number
}

export interface View {
    angleDeg : number,
    postion: Point,
    height: number
}

export function getLimitsOfView(distance: number, viewHeight : number, viewDeg: number): LimitsX{
    let diff= Math.atan(viewDeg) * distance;
    return {upper: viewHeight + diff , bottom: viewHeight - diff};
}

export function getProjectionOnView(view: View , pole: Pole, screenLength: number): Pole{
    let distance = HelperClass.Length(view.postion.x,view.postion.y,pole.x,pole.y);
    let projectionLimits = getLimitsOfView(distance,view.height,view.angleDeg);
    let distanceBottomViewToPlayer = projectionLimits.bottom;
    let viewWholeDistance = projectionLimits.upper - projectionLimits.bottom;

    let projectedDistanceBottomViewToPlayer = distanceBottomViewToPlayer * (viewWholeDistance / screenLength);
    let projectedHeight =  pole.height * (viewWholeDistance / screenLength);

    return {x: 0 , y: projectedDistanceBottomViewToPlayer , height: projectedHeight };

}



