import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import Modal from '../components/Modal';
import getBase64ImageUrl from '../utils/generateBlurPlaceholder';
import type { ImageProps } from '../utils/types';
import { useLastViewedPhoto } from '../utils/useLastViewedPhoto';
import getResults from '../utils/cachedImages';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { getQueryParamsFromCookie, saveQueryParamsToCookie } from '../utils/cookieUtils';

const Home: NextPage = ({ images }: { images: ImageProps[] }) => {
  const router = useRouter();
  const { photoId } = router.query;
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto();

  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null);

  const [queryParams, setQueryParams] = useState({ name: '' });

  useEffect(() => {
    const { name } = router.query;
    if (name) {
      saveQueryParamsToCookie(router.query);
      setQueryParams((prevParams) => ({ ...prevParams, name }));
    } else {
      const storedQueryParams = getQueryParamsFromCookie();
      setQueryParams(storedQueryParams);
    }
  }, [router.query]);

  const name = queryParams?.name;

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current.scrollIntoView({ block: 'center' });
      setLastViewedPhoto(null);
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto]);

  const homePhotoUrl = `https://res.cloudinary.com/dtk8pqhhx/image/upload/c_scale,w_2560/lucy-dohl/2023_05_20-30.jpg`;

  return (
    <>
      <Head>
        <title>Lucy's Dohl</title>
        <meta property="og:image" content={homePhotoUrl} />
        <meta name="twitter:image" content={homePhotoUrl} />
      </Head>
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Modal
            images={images}
            onClose={() => {
              setLastViewedPhoto(photoId);
            }}
          />
        )}
        <div className="after:content relative flex h-[500px] flex-col items-center justify-end gap-3 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center text-white after:pointer-events-none after:absolute after:inset-0 after:rounded-lg md:h-[calc(100vh-2rem)] lg:pt-0">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="flex max-h-full max-w-full items-center justify-center">
              <Image src="/home-cover-photo.jpg" alt="Lucy's Dohl cover photo" width="1960" height="2832" priority />
            </span>
            <span className="absolute bottom-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black/0 via-black/50 to-black/100 md:h-[300px] lg:h-[400px]"></span>
          </div>
          <h1 className="mb-2 mt-6 text-base font-bold uppercase tracking-widest">Lucy's Dohl</h1>
          {name && <h2 className="mb-2 font-bold tracking-widest text-white">{name}</h2>}
          <p className="max-w-[50ch] text-white sm:max-w-[40ch]">
            Thank you so much to our beloved family and friends for celebrating Lucy's first birthday with us! We are so
            grateful for your love and support. We hope you enjoy these photos from this special day!
          </p>
          <a
            className="pointer z-10 mt-6 rounded-lg border border-white bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-white/10 hover:text-white md:mt-4"
            href="#gallery">
            View Gallery
          </a>
        </div>
        <div id="gallery" className="pt-5">
          <ResponsiveMasonry columnsCountBreakPoints={{ 640: 1, 768: 2, 1024: 3, 1280: 4 }}>
            <Masonry gutter="1rem">
              {images.map(({ id, public_id, format, blurDataUrl }) => (
                <Link
                  key={id}
                  href={`/?photoId=${id}`}
                  as={`/p/${id}`}
                  ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
                  shallow
                  className="after:content group relative block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight">
                  <Image
                    alt={`Lucy's Dohl photo ${id}`}
                    className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                    style={{ transform: 'translate3d(0, 0, 0)' }}
                    placeholder="blur"
                    blurDataURL={blurDataUrl}
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                    width={720}
                    height={480}
                    sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
                  />
                </Link>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      </main>
      <footer className="p-6 text-center text-white/80 sm:p-12">
        Thank you to{' '}
        <a
          href="https://www.skymeadowplace.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer">
          Ellen (Sky Meadow Place)
        </a>{' '}
        for planning and hosting,{' '}
        <a href="https://laniohye.com/" target="_blank" className="font-semibold hover:text-white" rel="noreferrer">
          Lani Ohye
        </a>{' '}
        for these precious photos, and{' '}
        <a
          href="https://www.twentyeightoc.com/"
          target="_blank"
          className="font-semibold hover:text-white"
          rel="noreferrer">
          Twenty Eight OC
        </a>{' '}
        for a beautiful venue.
      </footer>
    </>
  );
};

export default Home;

export async function getStaticProps() {
  const results = await getResults();

  let reducedResults: ImageProps[] = [];
  let i = 0;
  for (let result of results.resources) {
    const { height, width, public_id, format } = result;
    reducedResults.push({
      id: i,
      height,
      width,
      public_id,
      format,
    });
    i++;
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image);
  });
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises);

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i];
  }

  return {
    props: {
      images: reducedResults,
    },
  };
}
