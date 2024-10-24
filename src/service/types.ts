export interface IRequestType {
  msg: string;
  data: any;
  status: number;
}

export interface IAnimeDate {
  date_id: string;
  date_name: string;
}

export interface IAnimeRecord {
  record_id: string;
  date_id: string;
  anime_name: string;
  watch_status: string;
  image_url: string;
}
