declare module 'styles/_colours.module.scss' {
  interface Colors {
    quality: string;
    durationPercent: string;
    awakeTime: string;
    lightSleep: string;
    deepSleep: string;
    remSleep: string;
  }

  const styles: Colors
  export default styles
}