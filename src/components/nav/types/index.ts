export enum NavType {
  menu = "menu",
  button = "button"
}

export enum NavQueryType {
  addNewAnimeDate = "addNewAnimeDate",
  checkPermission = "getPermission",
  null = "null"
}

export interface INavItem {
  path?: string;
  name: string;
  activeColor: string;
  type: NavType;
  placeholder?: string;
  queryType?: NavQueryType;
}

export type INavBase = Omit<INavItem, "type" | "placeholder">;

export interface INavPopover {
  placeholder?: string;
  queryType?: NavQueryType;
  navType: NavType;
}
