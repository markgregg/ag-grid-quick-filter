import CSS from 'csstype';
export enum Themes {
  Plain = "Plain",
  Dark = "Dark",
  Light = "Light",
  Blue = "Blue",
}

export const themes = Object.keys(Themes).filter((item) => {
  return isNaN(Number(item));
});

type Theme = {
  selectBackgroundImage: CSS.Property.BackgroundImage | null;
  selectBackgroundColor: CSS.Property.BackgroundColor | null;
  selectFontColor: CSS.Property.Color | null;
  selectFontHighLightColor: CSS.Property.Color | null;
  selectDisableBackgroundColor: CSS.Property.BackgroundColor | null;
  selectToolTipBackgroundColor: CSS.Property.Color | null;
  selectToolTipBackgroundImage: CSS.Property.BackgroundImage | null;
  selectHighLightBackgroundColor: CSS.Property.Color | null;
  selectSelectedBackgroundColor: CSS.Property.Color | null;
  selectBorder: CSS.Property.Border | null;
  pageColor1: CSS.Property.BackgroundColor;
  pageColor2: CSS.Property.BackgroundColor;
  pageColor3: CSS.Property.BackgroundColor;
  pageColor4: CSS.Property.BackgroundColor;
  pageColor5: CSS.Property.BackgroundColor;
  pageFontColor: CSS.Property.Color;
}

const setColors = (theme: Theme) => {
  
  document.documentElement.style.setProperty("--QuickFilterSelectBackgroundImage", theme.selectBackgroundImage);
  document.documentElement.style.setProperty("--QuickFilterSelectBackgroundColor", theme.selectBackgroundColor);
  document.documentElement.style.setProperty("--QuickFilterSelectFontColor", theme.selectFontColor);
  document.documentElement.style.setProperty("--QuickFilterSelectDisabledBackgroundColor", theme.selectDisableBackgroundColor);
  document.documentElement.style.setProperty("--QuickFilterSelectSelectedBackgroundColor", theme.selectSelectedBackgroundColor);
  document.documentElement.style.setProperty("--QuickFilterSelectHighlihtedBackgroundColor", theme.selectHighLightBackgroundColor);
  document.documentElement.style.setProperty("--QuickFilterSelectBorder", theme.selectBorder !== null ? theme.selectBorder.toString() : null);
  document.documentElement.style.setProperty("--compactSelectBackgroundColor", theme.selectBackgroundColor);
  document.documentElement.style.setProperty("--compactSelectFontColor", theme.selectFontColor);
  document.documentElement.style.setProperty("--compactSelectFonHighlightColor", theme.selectFontHighLightColor);
  document.documentElement.style.setProperty("--compactSelectDisabledBackgroundColor", theme.selectDisableBackgroundColor);
  document.documentElement.style.setProperty("--compactSelectToolTipBackgroundColor", theme.selectToolTipBackgroundColor);
  document.documentElement.style.setProperty("--compactSelectHighlightedBackgroundColor", theme.selectHighLightBackgroundColor);
  document.documentElement.style.setProperty("--compactSelectBorder", theme.selectBorder !== null ? theme.selectBorder.toString() : null);
  document.documentElement.style.setProperty("--pageColor1", theme.pageColor1);
  document.documentElement.style.setProperty("--pageColor2", theme.pageColor2);
  document.documentElement.style.setProperty("--pageColor3",theme.pageColor3);
  document.documentElement.style.setProperty("--pageColor4",theme.pageColor4);
  document.documentElement.style.setProperty("--pageColor5",theme.pageColor5);
  document.documentElement.style.setProperty("--pageFont", theme.pageFontColor);
}

export const applyTheme = (theme: string) => {
  switch(theme){
    case Themes.Blue: 
      setColors({
        selectBackgroundImage: 'linear-gradient(to bottom, #75b7e7, #4f86af)',
        selectBackgroundColor: null,
        selectFontColor: "White",
        selectFontHighLightColor: "LightGray",
        selectDisableBackgroundColor: "#577b95",
        selectToolTipBackgroundColor: null,
        selectToolTipBackgroundImage: 'linear-gradient(to bottom, #75b7e7, #4f86af)',
        selectHighLightBackgroundColor: "#1c95eb",
        selectSelectedBackgroundColor: "#1c95eb",
        selectBorder: "none",
        pageColor1: "white",
        pageColor2: "#4f86af",
        pageColor3: "#75b7e7",
        pageColor4: "#4f86af",
        pageColor5: "#1c95eb",
        pageFontColor: "Black",
      });
      break;
     case Themes.Dark: 
       setColors({
        selectBackgroundImage: null,
        selectBackgroundColor: '#0badad',
        selectFontColor: "white",
        selectFontHighLightColor: "lightgray",
        selectDisableBackgroundColor: "#799c9c",
        selectToolTipBackgroundColor: "#0a7b7b",
        selectToolTipBackgroundImage: null,
        selectHighLightBackgroundColor: "#12dddd",
        selectSelectedBackgroundColor: "#215555",
        selectBorder: "none",
        pageColor1: "Black",
        pageColor2: "#0a7b7b",
        pageColor3: "#28e0e0",
        pageColor4: "#215555",
        pageColor5: "#348585",
        pageFontColor: "white",
      });
      break;
    case Themes.Light: 
      setColors({
        selectBackgroundImage: 'linear-gradient(to bottom, #f5eaa7, #fadc37)',
        selectBackgroundColor: null,
        selectFontColor: "#3D350B",
        selectFontHighLightColor: "DarkGray",
        selectDisableBackgroundColor: "#f7edaf",
        selectToolTipBackgroundColor: null,
        selectToolTipBackgroundImage: 'linear-gradient(to bottom, #F7E575, #f1d520)',
        selectHighLightBackgroundColor: "#EFD233",
        selectSelectedBackgroundColor: "#f1c420",
        selectBorder: "none",
        pageColor1: "white",
        pageColor2: "#fadc37",
        pageColor3: "#f5eaa7",
        pageColor4: "#F7E575",
        pageColor5: "#f1c420",
        pageFontColor: "#3D350B",
      });
      break;
    case Themes.Plain: 
      setColors({
        selectBackgroundImage: null,
        selectBackgroundColor: null,
        selectFontColor: null,
        selectFontHighLightColor: null,
        selectDisableBackgroundColor: null,
        selectToolTipBackgroundColor: null,
        selectToolTipBackgroundImage: null,
        selectHighLightBackgroundColor: null,
        selectSelectedBackgroundColor: null,
        selectBorder: null,
        pageColor1: "White",
        pageColor2: "#dce916",
        pageColor3: "#eaff5c",
        pageColor4: "#b1bc11",
        pageColor5: "#eaff5c",
        pageFontColor: "Black",
      });
      break;
  }
  
}

