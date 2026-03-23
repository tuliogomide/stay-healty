import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { StyleSheet } from 'react-native';
import { Content, TextSection, TitleSection } from './style';

export default function Trainings() {
  return (
    <Content>
      <TitleSection>
        <IconSymbol
          size={35}
          name="figure.run.circle.fill"
          color={Colors.light.tint}
        />
        <TextSection>Training</TextSection>
      </TitleSection>
    </Content>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
