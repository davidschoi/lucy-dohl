import cloudinary from './cloudinary';

let cachedResults;

export default async function getResults() {
  if (!cachedResults) {
    const {
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
      CLOUDINARY_FOLDER,
    } = process.env;

    if (
      !NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !CLOUDINARY_API_KEY ||
      !CLOUDINARY_API_SECRET ||
      !CLOUDINARY_FOLDER
    ) {
      cachedResults = { resources: [] };
      return cachedResults;
    }

    const fetchedResults = await cloudinary.v2.search
      .expression(`folder:${CLOUDINARY_FOLDER}/*`)
      .sort_by('public_id', 'asc')
      .max_results(200)
      .execute();

    cachedResults = fetchedResults;
  }

  return cachedResults;
}
