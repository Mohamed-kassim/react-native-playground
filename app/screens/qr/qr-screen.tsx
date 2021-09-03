import React, { useState, useMemo, useCallback, useRef } from "react"
import { observer } from "mobx-react-lite"
import { StyleSheet, ViewStyle } from "react-native"
import { Screen, Text } from "../../components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "../../models"
import { color } from "../../theme"
import { Camera, PhotoFile, useCameraDevices, useFrameProcessor } from "react-native-vision-camera"
import { useIsFocused } from "@react-navigation/native"
import { useIsForeground } from "../../utils/hooks/useIsForeground"
import { useSharedValue } from "react-native-reanimated"
import ControlButtonsComponent from "./control-buttons-component"
import { StatusBarBlurBackground } from "./StatusBarBlurBackground"
import { CaptureButton } from "./captureButton"

const ROOT: ViewStyle = {
  backgroundColor: color.palette.black,
  flex: 1,
}
export const MAX_ZOOM_FACTOR = 20

export const QrScreen = observer(function QrScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()
  const camera = useRef<Camera>(null)
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">("back")
  const [flash, setFlash] = useState<"off" | "on">("off")
  const [torch, setTorch] = useState<"off" | "on">("off")
  const isPressingButton = useSharedValue(false)
  const zoom = useSharedValue(0)
  const [isCameraInitialized, setIsCameraInitialized] = useState(false)
  const [isCameraHasError, setIsCameraHasError] = useState(false)
  const isFocussed = useIsFocused()
  const isForeground = useIsForeground()
  const isActive = isFocussed && isForeground
  const devices = useCameraDevices()
  const device = devices[cameraPosition]

  const supportsCameraFlipping = useMemo(() => devices.back != null && devices.front != null, [
    devices.back,
    devices.front,
  ])
  const supportsFlash = useMemo(() => device?.hasFlash ?? false, [device?.hasFlash])
  const supportsTorch = useMemo(() => device?.hasTorch ?? false, [device?.hasTorch])
  const onPressFlipCamera = useCallback(() => {
    setCameraPosition((p) => (p === "back" ? "front" : "back"))
  }, [])
  const onPressFlash = useCallback(() => {
    setFlash((f) => (f === "off" ? "on" : "off"))
  }, [])
  const onPressTorch = useCallback(() => {
    setTorch((t) => (t === "off" ? "on" : "off"))
  }, [])

  const onInitialized = useCallback(() => {
    console.log("Camera initialized!")
    setIsCameraInitialized(true)
  }, [])
  const onError = useCallback(() => {
    console.log("Camera Error!")
    setIsCameraHasError(true)
  }, [])
  const frameProcessor = useFrameProcessor((frame) => {
    "worklet"
    console.log(`frame`, frame)
  }, [])
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton
    },
    [isPressingButton],
  )
  const minZoom = device?.minZoom ?? 1
  const maxZoom = Math.min(device?.maxZoom ?? 1, MAX_ZOOM_FACTOR)
  const onMediaCaptured = useCallback(async (media: PhotoFile) => {
    console.log(`Media captured! ${JSON.stringify(media)}`)
  }, [])
  return (
    <Screen
      style={ROOT}
      preset="scroll"
      statusBarProps={{
        translucent: true,
        backgroundColor: "transparent",
      }}
    >
      {device != null && (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive && !isCameraHasError}
          onInitialized={onInitialized}
          onError={onError}
          torch={torch}
          photo
          frameProcessor={frameProcessor}
          frameProcessorFps={1}
        />
      )}
      <StatusBarBlurBackground />
      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : "off"}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />
      <ControlButtonsComponent
        onPressFlash={onPressFlash}
        onPressTorch={onPressTorch}
        onPressFlipCamera={onPressFlipCamera}
        flash={flash}
        torch={torch}
        supportsCameraFlipping={supportsCameraFlipping}
        supportsFlash={supportsFlash}
        supportsTorch={supportsTorch}
      />
    </Screen>
  )
})
const styles = StyleSheet.create({
  captureButton: {
    alignSelf: "center",
    bottom: 20,
    position: "absolute",
  },
})
