import { request } from "./request";

export async function getAnimeDate() {
  return await request({
    url: "/api/getAnimeDate",
    method: "get"
  });
}

export async function getAnimeRecordByDateId(date_id) {
  return await request({
    url: "/api/getAnimeRecordByDateId",
    method: "get",
    params: { date_id }
  });
}

export async function updateNewAnimeRecord(record_id, date_id, anime_name, watch_status) {
  return await request({
    url: "/api/updateNewAnimeRecord",
    method: "post",
    data: { record_id, date_id, anime_name, watch_status }
  });
}

export async function updateNewAnimeWatchStatus(record_id, date_id, anime_name, watch_status) {
  return await request({
    url: "/api/updateNewAnimeWatchStatus",
    method: "post",
    data: { record_id, date_id, anime_name, watch_status }
  });
}

export async function addNewAnimeDate(date_name) {
  return await request({
    url: "/api/addNewAnimeDate",
    method: "post",
    data: { date_name }
  });
}

export async function deleteAnimeRecord(date_id) {
  return await request({
    url: "/api/deleteAnimeRecord",
    method: "post",
    data: { date_id }
  });
}

export async function updateRecordDateName(date_id, date_name) {
  return await request({
    url: "/api/updateRecordDateName",
    method: "post",
    data: { date_id, date_name }
  });
}

export async function deleteAnime(record_id, date_id, anime_name) {
  return await request({
    url: "/api/deleteAnime",
    method: "post",
    data: { record_id, date_id, anime_name }
  });
}

export async function getPermission(secret) {
  return await request({
    url: "/permission/permission",
    method: "post",
    data: { secret }
  });
}

export async function uploadImage(formData: FormData) {
  return await request({
    url: "/api/uploadImage",
    method: "post",
    data: formData
  });
}
