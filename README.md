# Ag-Grid Uuniversal Filter

Ag-Grid Universal Filter is a highly funtional quick filter control that supports multiple data sources and intergrates witht ag-grid.

For examples and help [ag-grid-quick-filter](https://markgregg.github.io/ag-grid-quick-filter/)

## To install

yarn add ag-grid-quick-filter

npm i --save ag-grid-quick-filter

## How it works
Ag-Grid Universal Filter is intended to be used a quick filter that works with Ag-Grid or another source to filter across a range of fields. The filter supports static lists of values, values returned from a promise and regular expression matches.

### Defining choices
The control has a property called choices that accepts an array of ChoiceDefinitions. The ChoiceDefinition interface is generic and can be set to any when declaring an arry. If the generic parameter is provided, it must be of type OptionType, which has the below defintion;

```js 
export interface Option {
  text: string;
  value: any;
}
export type OptionType = string | object | Option;
```

The only mandatory property is key, which has a number of intrenal uses.

There are three ways the choice definition can be configured to load options. 
#### options
The options property is set if you have a static list of values.
#### lookUp
The lookUp property is for when you have to load values from another source. The property expects a function that returns a promose of OptionType[].
#### regExMatch and valueGetter
the regExMatch and valueGetter poperties are used when you do not have a static list of values. The regExMatch poperty will determine if the text the user has input is a match. The valueGetter property will parse the text and return a value. Bother are functions.

It is possible to have definitions that are a combination of either static options or lookups, and regular expressions. 

#### other choice definition properties

##### text and value
The text and value properties are required if any of the choices are objects and are used to extract an items text or value (both can be set to the same field). If the choices are complex but implement the Option interface then neither are required.

##### choiceDisplayname
The choiceDisplayname is only required if you want to display a different text to the key as a title, when choices are listed.

##### maximumSelections
The maximumSelections property is used to limit the number of items that can be selected in this definition.

##### maxAvailableChoices
The maxAvailableChoices property is used to limit the number of choices that are displayed.

##### search 
The search property is used when the item is complex and control whether the items text or value is compared to the search text. Can be search?: 'text' | 'value' | 'both'.

##### showSelectedValue
the showSelectedValue property determines whether the control dispaly a complex items value or text
 
##### agGridColumn  
The agGridColumn property is required if you want the control to automatically update Ag-Grid.
  
##### filterType
By default values are assumed to be text, if you want them to be treatedly differently then this needs to be set. Can be "text" | "number" | "date".

## Using the Ag-Grid Uuniversal Filter control
When you type text the control will assume that you want to look for equality. If you want a different operation then before you type the text enter an operator.

### text
- !        not equals
- %        contains
- !% not   contains
- %{">"}   ends width
- %{"<"}   starts width  

### numbers            
- =        equals
- !        not equals
- {">"}    greater than
- {"<"}    less than
- {"<"}    greater than or equal to
- {">"}    less than or equal to

### dates
- =       equals
- !       not equals
- {">"}   greater than
- {"<"}   less than

### operands
- &       and
- |       or 

## Quick start

A simple string list

```js
const choices: ChoiceDefinition<any>[] = [
  {
    key: "guarantorName",
    prefix: "guarantorName",
    name: "Guarantor Name",
    options: [...]
    replaceExisting: true
  }
];

<AgGridUniversalFilter
  title="Quick Filter"
  choices={choices}
/>
```
## Properties
  - title                   select title and key for cache
  - choices                 choices to present to the user and their behaviour (see choice properties)
  - selected?               selected items
  - showWithNoFilter?       Show items even if user has not typed
  - cacheLookUp?            should looked up items be cached
  - cacheTimeToLive?        how long should items exist in the cache for in seconds
  - cacheExpiryCheck?       how often should cached item expiry be checked in seconds
  - onChange?               notify of change
  - disabled?               control is disabled
  - noItemText?             text to display if not items are found
  - typePromptText?         prompt to tell user to type
  - caseSensitive?          perform case sensitive matching
  - toolTipValueLimit?      maxium number of items to display
  - maxAvailableChoices?    maxium choices to display for all catagories
  - hideOnSelect            close option list when an item is selected
  - noClearTextOnSelect?    don't clear input text on selection
  - selectIfOnlyOption?     select an option if it is the only option available
  - agGridApi?              if supplied allows automatic filtering of ag-grid

## Styles
The easist way to style the control is using style varaibles

```css
{
  --universalSelectBackgroundColor: #14061F;
  --universalSelectFontColor: White;
  --universalSelectDisabledBackgroundColor: #353576;
  --universalSelectSelectedBackgroundColor: #9c9ccb;
  --universalSelectBorder: WhiteSmoke solid 2px;
}
```

## Styles variables

- --universalSelectBackgroundColor            controls background color, defaults to White
- --universalSelectBackgroundImage            if an image is prefered to a color
- --universalSelectHighlihtedBackgroundColor  the color used to highlight an option, defaults to lightgray
- --universalSelectHighlihtedBackgroundImage  background version of above
- --universalSelectFontColor                  cotrols font color, defaults to Black
- --universalSelectSelectedBackgroundColor    the background color of a selected item, defaults to lightgray
- --universalSelectSelectedBackgroundImage    as above
- --universalSelectDisabledFontColor          color of font when disabled
- --universalSelectDisabledBackgroundColor    background color then disabled, defaults to darkgray
- --universalSelectDisabledBackgroundImage    as above
- --universalSelectListWidth                  width of the options list, defaults to fill available space
- --universalSelectCatagoryTitleFontWeight    catagory title font weight, defaults to bold
- --universalSelectPrefixFontSize             catagory title font size, defaults to xx-small
- --universalSelectPrefixFontWeight           selection prefix font weight, defaults to bold
- --universalSelectDeslectIconColor           deselect icon color
- --universalSelectDeslectHighlightIconColor  deselect icon color when mouse hovers
- --universalSelectFontWeight                 font weight for entire control
- --universalSelectFontFamily                 font family for entire control
- --universalSelectFontSize                   font size for entire control
- --universalSelectFontStyle                  font style for entire control
- --universalSelectDropdownIconSize           dropdown icon size, defaults to large
- --universalSelectDropdownIconColor          dropdown icon color
- --universalSelectClearSelectionIconSize     clear selection icon size, defaults to large
- --universalSelectClearSelectionIconColor    clear selection icon color
- --universalSelectClearSelectionIconHighlightColor  clear selection icon highlight color
- --universalSelectTitleFontSize              title size, defaults to small
- --universalSelectDisabledFontColor          disabled font color
- --universalSelectBorder                     control border, defaults to 2px solid Lightgray
- --universalSelectCatagoryTitleFontSize      catagory titlte font size, defautls to x-small
- --universalSelectCatagorFontColor           catagory font color
- --universalSelectCatagoryTitleBackgroundColor catagory background color
- --universalSelectCatagoryTitleBackgroundImage as above

### Choice apperance properties
- choiceStyle               To override the style of a listed choice
- choiceHoverStyle          To override the hover style of a list choice
- choiceClassName           To override the style of a listed choice using a CSS class
- choiceHoverClassName      To override the hover style of a list choice using a CSS class

### Selection apperance properties
- selectionStyle                    To override the style of a selection
- selectionDisabledStyle            To override the style of a disabled selection
- selectionClassName                To override the style of a selection using a CSS class
- selectionDisabledClassName        To override the style of a disabled selection using a CSS class
- deselectStyle                     To override the style of the deselect icon
- deselectClassName                 To override the style of the deselect icon using a CSS class
- selectionPrefixStyle              To override the style of a selection prefix
- selectionPrefixDisabledStyle      To override the style of a selection prefix when disabled
- selectionPrefixClassName          To override the style of a selection prefix using a CSS class
- selectionPrefixDisabledClassName  To override the style of a selection prefix when disabled using a CSS class
- selectionTextStyle                To override the style of the selection text
- selectionTextDisabledStyle        To override the style of the selection text when disabled
- selectionTextClassName            To override the style of the selection text using a CSS class
- selectionTextDisabledClassName    To override the style of the selection text when disabled using a CSS class
- deselectIcon                      To change the deselect Icon - supports react-icons

### General apperance properties
- selectStyle                       To override the style of the select body
- selectDisabledStyle               To override the style of the select body when disabled
- className                         To override the style of the select body using a CSS class
- disabledClassName                 To override the style of the select body when disabled using a CSS class
- inputStyle                        To override the style of the input control
- inputDisabledStyle                To override the style of the input control when disabled
- inputClassName                    To override the style of the input control using a CSS class
- inputDisabledClassName            To override the style of the input control when disabled using a CSS class
- clearSelectionStyle               To override the style of the clear selection icon
- clearSelectionClassName           To override the style of the clear selection icon using a CSS class
- titleStyle                        To override the style of the controls title
- titleDisabledStyle                To override the style of the controls title when disabled
- titleClassName                    To override the style of the controls title using a CSS class
- titleDisabledClassName            To override the style of the controls title when disabled using a CSS class
- dropdownIconStyle                 To override the style of the dropdown icon
- dropIconClassName                 To override the style of the dropdown icon using a CSS class
- listStyle                         To override the style of the dropdown list
- choiceListClassName               To override the style of the dropdown list using a CSS class
- loadingTextStyle                  To override the style of the loading optons text
- loadingTextClassName              To override the style of the loading optons text using a CSS class
- catagoryStyle                     To override the style of the catagory title
- catagoryClassName                 To override the style of he catagory title using a CSS class
- hideDropdownIcon                  When set hides dropdown icon
- dropdownIcon                      To change the dropdown icon - supports react-icons
- clearSelectionIcon                To change the clear selection  icon - supports react-icons
- hideTitle?                        When sets hides the control's title
- style                             controls style
- height                            controls height
- width                             controls width
- minWidth                          controls min width
- maxWidth                          controls max width

## Componenets
- choiceComponent?: (props: ChoiceProps & ChoiceStyle) => JSX.Element;
- selectComponent?: (props: SelectionProps & SelectionStyle) => JSX.Element;


