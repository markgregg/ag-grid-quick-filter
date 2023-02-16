import { Option } from '../types';
import { LookUp } from '../types/choiceDefinition';
import { OptionType } from '../types/optionType';

export function isDocumentElement(
  el: HTMLElement | typeof window
): el is typeof window {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}

export const errorMessage = (error: any): string =>
  `${error instanceof Error ? error.message : error}`;

export function scrollTo(el: HTMLElement | typeof window, top: number): void {
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }

  el.scrollTop = top;
}

export function scrollIntoView(
  listElement: HTMLElement,
  elementToShow: HTMLElement
): void {
  const menuRect = listElement.getBoundingClientRect();
  const focusedRect = elementToShow.getBoundingClientRect();
  const overScroll = elementToShow.offsetHeight / 3;

  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(
      listElement,
      Math.min(
        elementToShow.offsetTop +
          elementToShow.clientHeight -
          listElement.offsetHeight +
          overScroll,
        listElement.scrollHeight
      )
    );
  } else if (focusedRect.top - overScroll < menuRect.top) {
    scrollTo(listElement, Math.max(elementToShow.offsetTop - overScroll, 0));
  }
}

export const itemText = (item: OptionType, text?: LookUp): string => {
  try {
    return (item as Option).text ?? (text ? text(item) : (item as string));
  } catch (error) {
    console.log(
      `Object type either does not implement Option, the property getter (itemText) or is not a string, error: ${errorMessage(
        error
      )}`
    );
  }
  return '';
};

export const stringValue = (value: any): string =>
  typeof value === 'string' ? (value as string) : value.toString();

export const itemValue = (item: OptionType, value?: LookUp): string => {
  try {
    return (item as Option).value
      ? stringValue((item as Option).value)
      : value
      ? value(item)
      : (item as string);
  } catch (error) {
    console.log(
      `Object type either does not implement Option, the property getter (itemValue) or is not a string, error: ${errorMessage(
        error
      )}`
    );
  }
  return '';
};
