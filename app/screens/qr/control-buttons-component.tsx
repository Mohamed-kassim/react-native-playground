import React from "react"
import { StyleSheet, View } from "react-native"
import { PressableOpacity } from "react-native-pressable-opacity"
import IonIcon from "react-native-vector-icons/Ionicons"
import { spacing } from "../../theme"

const ControlButton = ({ iconName, color, size, ...props }) => (
  <PressableOpacity style={styles.button} disabledOpacity={0.4} {...props}>
    <IonIcon name={iconName} color={color} size={size} />
  </PressableOpacity>
)
const ControlButtonsComponent = ({
  flash,
  onPressFlash,
  torch,
  onPressTorch,
  onPressFlipCamera,
  supportsCameraFlipping,
  supportsFlash,
  supportsTorch,
}) => {
  return (
    <View style={styles.rightButtonRow}>
      {supportsCameraFlipping && (
        <ControlButton
          onPress={onPressFlipCamera}
          disabledOpacity={0.4}
          iconName="camera-reverse"
          color="white"
          size={24}
        />
      )}
      {supportsFlash && (
        <PressableOpacity style={styles.button} onPress={onPressFlash} disabledOpacity={0.4}>
          <IonIcon name={flash === "on" ? "flash" : "flash-off"} color="white" size={24} />
        </PressableOpacity>
      )}
      {supportsTorch && (
        <PressableOpacity style={styles.button} onPress={onPressTorch} disabledOpacity={0.4}>
          <IonIcon
            name={torch === "on" ? "flashlight" : "flashlight-outline"}
            color="white"
            size={24}
          />
        </PressableOpacity>
      )}
    </View>
  )
}
const BUTTON_SIZE = 40
const BUTTON_COLOR = "rgba(140, 140, 140, 0.3)"
export default ControlButtonsComponent
const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: BUTTON_COLOR,
    borderRadius: BUTTON_SIZE / 2,
    height: BUTTON_SIZE,
    justifyContent: "center",
    marginBottom: spacing[2],
    width: BUTTON_SIZE,
  },
  rightButtonRow: {
    position: "absolute",
    right: spacing[2],
    top: spacing[2],
  },
})
