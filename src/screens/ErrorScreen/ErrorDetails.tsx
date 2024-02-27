import React, { ErrorInfo } from "react";
import {
  Button,
  ScrollView,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { colors, spacing } from "../../theme";

export interface ErrorDetailsProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  onReset(): void;
}

export function ErrorDetails(props: ErrorDetailsProps) {
  return (
    <View
      // preset="fixed"
      // safeAreaEdges={['top', 'bottom']}
      style={$contentContainer}
    >
      {/* <View style={$topSection}>
        <Icon icon="ladybug" size={64} />
        <Text style={$heading} preset="subheading" tx="errorScreen.title" />
        <Text tx="errorScreen.friendlySubtitle" />
      </View> */}

      <ScrollView
        style={$errorSection}
        contentContainerStyle={$errorSectionContentContainer}
      >
        <Text style={$errorContent}>{`${props.error}`.trim()}</Text>
        <Text selectable style={$errorBacktrace}>
          {`${props.errorInfo?.componentStack ?? ""}`.trim()}
        </Text>
      </ScrollView>

      <Button onPress={props.onReset} title="Reset" />
    </View>
  );
}

const $contentContainer: ViewStyle = {
  alignItems: "center",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.xl,
  flex: 1,
};

// const $topSection: ViewStyle = {
//   flex: 1,
//   alignItems: 'center',
// };

// const $heading: TextStyle = {
//   color: colors.error,
//   marginBottom: spacing.md,
// };

const $errorSection: ViewStyle = {
  flex: 2,
  backgroundColor: colors.background(),
  marginVertical: spacing.md,
  borderRadius: 6,
};

const $errorSectionContentContainer: ViewStyle = {
  padding: spacing.md,
};

const $errorContent: TextStyle = {
  color: colors.palette.error(),
};

const $errorBacktrace: TextStyle = {
  marginTop: spacing.md,
  color: colors.palette.textSecondary(),
};

// const $resetButton: ViewStyle = {
//   backgroundColor: colors.error,
//   paddingHorizontal: spacing.xxl,
// };
