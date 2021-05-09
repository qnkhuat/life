import { storage } from "./server";
export async function getUrl(path){

  // These options will allow temporary read access to the file
  const options = {
    version: 'v2', // defaults to 'v2' if missing.
    action: 'read',
    expires: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
  };

  // Get a v2 signed URL for the file
  const [url] = await storage
    .bucket()
    .file(path)
    .getSignedUrl(options);

  return url;
}
