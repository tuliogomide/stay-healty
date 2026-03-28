import React from 'react';

import { Colors } from '@/constants/theme';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { DynamicColorIOS } from 'react-native';

export default function TabLayout() {

  return (
    <NativeTabs
      labelStyle={{
        // For the text color
        selected: {
          color: DynamicColorIOS({
            dark: Colors.light.tint,
            light: Colors.light.tint,
          }),
        },
      }}
      tintColor={Colors.light.tint}
    >
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon sf="house.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="exercises">
        <Label>Training</Label>
        <Icon sf="figure.run.circle.fill" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="diets">
        <Icon sf="leaf.fill" drawable="custom_settings_drawable" />
        <Label>Diet</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings/index">
        <Icon sf="gear" drawable="custom_settings_drawable" />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
