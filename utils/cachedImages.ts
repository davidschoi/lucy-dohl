import cloudinary from './cloudinary';

let cachedResults;

export default async function getResults() {
  if (!cachedResults) {
    const fetchedResults = await cloudinary.v2.search
      .expression(`folder:${process.env.CLOUDINARY_FOLDER}/*`)
      .sort_by('uploaded_at', 'asc')
      .max_results(200)
      .execute();

    cachedResults = fetchedResults;
  }

  return cachedResults;
}
