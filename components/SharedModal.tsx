import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUturnLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { variants } from '../utils/animationVariants';
import downloadPhoto from '../utils/downloadPhoto';
import type { SharedModalProps } from '../utils/types';
import { DOWNLOAD_PHOTO_IMG_PREFIX } from '../utils/constants';

export default function SharedModal({
  index,
  images,
  changePhotoId,
  closeModal,
  navigation,
  currentPhoto,
  direction,
}: SharedModalProps) {
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (index < images?.length - 1) {
        changePhotoId(index + 1);
      }
    },
    onSwipedRight: () => {
      if (index > 0) {
        changePhotoId(index - 1);
      }
    },
    trackMouse: true,
  });

  let currentImage = images ? images[index] : currentPhoto;
  const isHorizontal = currentImage.width > currentImage.height;

  return (
    <MotionConfig
      transition={{
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}>
      <div className="relative z-50 flex h-full w-full max-w-7xl items-center object-contain" {...handlers}>
        {/* Main image */}
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute">
              <img
                src={`https://res.cloudinary.com/${
                  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
                }/image/upload/c_scale,${navigation ? 'w_1280' : 'w_1920'}/${currentImage.public_id}.${
                  currentImage.format
                }`}
                width={isHorizontal ? (navigation ? 1280 : 1920) : navigation ? 853 : 1280}
                height={isHorizontal ? (navigation ? 853 : 1280) : navigation ? 1280 : 853}
                alt={`Lucy's Dohl photo ${currentImage.id}`}
                className="object-contain"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Buttons + bottom nav bar */}
        <div className="absolute inset-0 mx-auto flex max-w-7xl items-center justify-center">
          {/* Buttons */}
          <div className="relative h-full w-full">
            {navigation && (
              <>
                {index > 0 && (
                  <button
                    className="absolute left-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                    style={{ transform: 'translate3d(0, 0, 0)' }}
                    onClick={() => changePhotoId(index - 1)}>
                    <ChevronLeftIcon className="h-6 w-6" />
                  </button>
                )}
                {index + 1 < images.length && (
                  <button
                    className="absolute right-3 top-[calc(50%-16px)] rounded-full bg-black/50 p-3 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white focus:outline-none"
                    style={{ transform: 'translate3d(0, 0, 0)' }}
                    onClick={() => changePhotoId(index + 1)}>
                    <ChevronRightIcon className="h-6 w-6" />
                  </button>
                )}
              </>
            )}
            <div className="absolute right-0 top-0 flex items-center gap-2 p-3 text-white">
              <a
                href={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`}
                className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                target="_blank"
                title="Open fullsize version"
                rel="noreferrer">
                <ArrowTopRightOnSquareIcon className="h-5 w-5" />
              </a>
              <button
                onClick={() =>
                  downloadPhoto(
                    `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentImage.public_id}.${currentImage.format}`,
                    `${DOWNLOAD_PHOTO_IMG_PREFIX}${index}.jpg`
                  )
                }
                className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white"
                title="Download fullsize version">
                <ArrowDownTrayIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="absolute left-0 top-0 flex items-center gap-2 p-3 text-white">
              <button
                onClick={() => closeModal()}
                className="rounded-full bg-black/50 p-2 text-white/75 backdrop-blur-lg transition hover:bg-black/75 hover:text-white">
                {navigation ? <XMarkIcon className="h-5 w-5" /> : <ArrowUturnLeftIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
