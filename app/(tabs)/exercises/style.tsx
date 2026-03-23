import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

// types.ts ou no mesmo arquivo do componente
interface ListItemProps {
  /** Indica se este é o último item da lista. */
  isLastItem: Boolean;
  isFirstItem: Boolean;
}

export const Content = styled.ScrollView`
  flex: 1;
  padding-left: 20px;
  padding-right: 20px;
  background-color: #DEDEDE;
  paddin-bottom: 600px;
`

export const Card = styled.View`
  width: 100%;
  background-color: #d3d2d2;
  border-radius: 20px;
`

export const TitleSection = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 20px;
`

export const TextSection = styled.Text`
  color: black;
  margin-left: 5px;
  font-weight: bold;
  font-size: 20px;
`

export const DeleteButton = styled.TouchableOpacity<ListItemProps>`
    width: 80;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: #c7240ed3;
    border-top-right-radius: ${props => (props.isFirstItem ? '20px' : '0')};
    border-bottom-right-radius: ${props => (props.isLastItem ? '20px' : '0')};
`

export const ItemTraining = styled.View<ListItemProps>`
  width: 100%;
  display: flex;
  padding-left: 20px;
  padding-right: 20px;
  border-top-left-radius: ${props => (props.isFirstItem ? '20px' : '0')};
  border-top-right-radius: ${props => (props.isFirstItem ? '20px' : '0')};
  border-bottom-left-radius:  ${props => (props.isLastItem ? '20px' : '0')};
  border-bottom-right-radius: ${props => (props.isLastItem ? '20px' : '0')};
  background-color: #d3d2d2;
  flex-direction: row;
`

export const ContentItemTraining = styled.View<ListItemProps>`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  padding-top: 20px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-bottom-color: ${props => (props.isLastItem ? 'transparent' : '#7a7979bc')};
`
