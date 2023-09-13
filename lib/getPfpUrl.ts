import { storageClient } from "./storage";

export const getPfpUrl = (userid: string) => {
  const { data } = storageClient.from("images").getPublicUrl(userid + "/pfp");
  return data.publicUrl;
};
