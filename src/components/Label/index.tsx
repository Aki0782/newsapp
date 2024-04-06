import React, { ReactNode } from "react";
import { StyleSheet, Text, TextProps } from "react-native";

import { Color } from "@Constants/Colors";

interface LabelProps extends TextProps {
  children: ReactNode;
}

const Label: React.FC<LabelProps> = ({ children, style, ...rest }) => {
  return (
    <Text style={[{ ...styles.text }, style]} {...rest}>
      {children}
    </Text>
  );
};

export default Label;

const styles = StyleSheet.create({
  text: {
    color: Color.White
  }
});
