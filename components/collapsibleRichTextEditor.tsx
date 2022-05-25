import React, { useState } from "react";
import RichTextEditor, { RichTextEditorProps } from "./richTextEditor";
import { SxProps } from "@mui/material";

const MAX_TOOLBAR_HEIGHT = 300;
const TOOLBAR_BOTTOM_MARGIN = 20;
const TRANSITION_TIME = "2s";

type CollapsibleRichTextEditorProps = {
  // Props to pass to RichTextEditor
  // Note that editorOptions cannot be passed
  innerProps: Omit<RichTextEditorProps, "editorOptions">;
}

// A rich text editor that is small and hides tools until it is focused
// When focused, it expands and reveals tools with an animation
const CollapsibleRichTextEditor: React.FC<CollapsibleRichTextEditorProps> = ({
  innerProps
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const onFocus = React.useCallback(() => {
    setCollapsed(false);
  }, [setCollapsed])

  const onBlur = React.useCallback(() => {
    setCollapsed(true);
  }, [setCollapsed]);

  const toolbarSx: SxProps = {
    transition: `max-height ${TRANSITION_TIME}, margin ${TRANSITION_TIME}`,
    transitionTimingFunction: "ease-in-out",
    overflow: "hidden",
    maxHeight: `${MAX_TOOLBAR_HEIGHT}px`,
    marginBottom: "0px"
  };

  if (collapsed) {
    toolbarSx.maxHeight = "0px";
    toolbarSx.marginBottom = `${TOOLBAR_BOTTOM_MARGIN}px`;
  }

  return (
    <RichTextEditor
      {...innerProps}
      editorOptions={{
        onFocus: onFocus,
        onBlur: onBlur,
        toolbarSx: toolbarSx,
        attributes: {
          // Ensures that the toolbar opens down, not up
          style: "overflow-anchor: none"
        }
      }}
    />
  )
}

export default CollapsibleRichTextEditor;