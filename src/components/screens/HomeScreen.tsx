import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Button from '../Button';
import CircleButton from '../CircleButton';
import EmojiList from '../EmojiList';
import EmojiPicker from '../EmojiPicker';
import EmojiSticker from '../EmojiSticker';
import IconButton from '../IconButton';
import ImageViewer from '../ImageViewer';
const PlaceholderImage = require('../assets/images/background-image.png');
function HomeScreen() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [showAppOptions, setShowAppOptions] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pickEmoji, setPickEmoji] = useState<ImageSourcePropType | undefined>();
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert('You did not select any image.');
    }
  };
  const onReset = () => {
    setShowAppOptions(false);
    setPickEmoji(undefined);
  };

  const onAddSticker = () => {
    setIsModalVisible(true);
  };

  const onSaveImageAsync = async () => {
    // we will implement this later
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View
        className="flex-1 items-center justify-center bg-black"
        style={{ justifyContent: 'center', alignItems: 'center' }}>
        <View className="flex-1 items-center">
          <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
          {pickEmoji && <EmojiSticker imageSize={40} stickerSource={pickEmoji} />}
        </View>
        {showAppOptions ? (
          <View className="absolute bottom-16">
            <View className="flex-row items-center">
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
            </View>
          </View>
        ) : (
          <View className="items-center" style={{ flex: 1 / 3 }}>
            <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
            <Button label="Use this photo" onPress={() => setShowAppOptions(true)} />
          </View>
        )}
        <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      </View>
    </GestureHandlerRootView>
  );
}

export default HomeScreen;
