import { Image } from 'expo-image';
import { ImageSourcePropType } from 'react-native';

type Props = {
  imgSource: ImageSourcePropType;
  selectedImage?: string;
};

export default function ImageViewer({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;
  return (
    <Image
      source={imageSource}
      className="h-[440] w-[320] rounded-2xl border border-white"
      style={{ borderWidth: 2, borderColor: 'white', height: 440, width: 320, borderRadius: 20 }}
    />
  );
}
