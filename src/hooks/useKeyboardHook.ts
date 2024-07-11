import { useEffect } from "react";
import { Keyboard, KeyboardEventListener } from "react-native";

interface Props {
  willShow?: KeyboardEventListener;
  willHide?: KeyboardEventListener;
  didShow?: KeyboardEventListener;
  didHide?: KeyboardEventListener;
}

export const useKeyboardHook = (props: Props) => {
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      "keyboardWillShow",
      (event) => {
        if (props.willShow) props.willShow(event);
      }
    );
    const keyboardWillHideListener = Keyboard.addListener(
      "keyboardWillHide",
      (event) => {
        if (props.willHide) props.willHide(event);
      }
    );
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        if (props.didShow) props.didShow(event);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      (event) => {
        if (props.didHide) props.didHide(event);
      }
    );

    return () => {
      keyboardWillHideListener.remove();
      keyboardWillShowListener.remove();
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
};
