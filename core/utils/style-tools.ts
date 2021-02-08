// TEMP

export function styleElementFactory(dataLabel: string) {
  if (document.querySelector(`[data-swds-styleElem-${dataLabel}='1']`) !== null) return;

  const elem = document.createElement('style');
  elem.setAttribute(`data-swds-styleElem-${dataLabel}`, '1');
  document.getElementsByTagName('head')[0].appendChild(elem);
}

export function getStyleElement(dataLabel: string) {
  return document.querySelector(`[data-swds-styleElem-${dataLabel}='1']`);
}
