declare module 'maath/random/dist/maath-random.esm' {
  export function inSphere(array: Float32Array, options: { radius: number }): Float32Array
  export function inBox(array: Float32Array, options: { size: number }): Float32Array
  export function inCircle(array: Float32Array, options: { radius: number }): Float32Array
  export function inRect(array: Float32Array, options: { size: number }): Float32Array
  export function inCylinder(array: Float32Array, options: { radius: number, height: number }): Float32Array
  export function inCone(array: Float32Array, options: { radius: number, height: number }): Float32Array
  export function inTorus(array: Float32Array, options: { radius: number, tube: number }): Float32Array
  export function inSphereSurface(array: Float32Array, options: { radius: number }): Float32Array
  export function inBoxSurface(array: Float32Array, options: { size: number }): Float32Array
  export function inCircleSurface(array: Float32Array, options: { radius: number }): Float32Array
  export function inRectSurface(array: Float32Array, options: { size: number }): Float32Array
  export function inCylinderSurface(array: Float32Array, options: { radius: number, height: number }): Float32Array
  export function inConeSurface(array: Float32Array, options: { radius: number, height: number }): Float32Array
  export function inTorusSurface(array: Float32Array, options: { radius: number, tube: number }): Float32Array
} 