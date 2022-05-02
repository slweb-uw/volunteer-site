import React, {useEffect} from "react";
import sanitizeHtmlRichText from "../helpers/sanitizeHtmlRichText";

// Material imports
import {
  Paper,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Grid,
  Popover,
  TextField,
  DialogContent,
  DialogActions,
  Button
} from "@mui/material";

// TipTap Imports
import {
  useEditor,
  EditorContent,
  Editor,
  Mark,
  mergeAttributes
} from "@tiptap/react"
// TipTap Extensions
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import HardBreak from "@tiptap/extension-hard-break";
import OrderedList from "@tiptap/extension-ordered-list";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import GapCursor from "@tiptap/extension-gapcursor";
import DropCursor from "@tiptap/extension-dropcursor";
import History from "@tiptap/extension-history";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";

// Icons
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import LinkOffIcon from "@mui/icons-material/LinkOff";

type ToolbarProps = {
  editor: Editor;
}

const FormatTools: React.FC<ToolbarProps> = ({
  editor
}) => {
  const checkFormats = ["bold", "italic", "underline", "strike"];
  const formats: string[] = [];
  for (const format of checkFormats) {
    if (editor.isActive(format)) {
      formats.push(format);
    }
  }

  const setFormats = (newFormats: string[]) => {
    for (const format of checkFormats) {
      if (newFormats.includes(format)) {
        editor.chain().focus().setMark(format).run();
      } else {
        editor.chain().focus().unsetMark(format).run();
      }
    }
  }

  return (
    <ToggleButtonGroup
      aria-label="text formatting"
      size="small"
      value={formats}
      onChange={(event, newFormats: string[]) => { setFormats(newFormats); }}
    >
      <ToggleButton value="bold">
        <Tooltip title="Bold text" placement="top">
          <FormatBoldIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="italic">
        <Tooltip title="Italicize text" placement="top">
          <FormatItalicIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="underline">
        <Tooltip title="Underline text" placement="top">
          <FormatUnderlinedIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="strike">
        <Tooltip title="Strikethrough text" placement="top">
          <StrikethroughSIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

const AlignmentTools: React.FC<ToolbarProps> = ({
  editor
}) => {
  const setFormat = (newFormat: string) => {
    editor.chain().focus().setTextAlign(newFormat).run()
  }

  return (
    <ToggleButtonGroup
      aria-label="text alignment"
      size="small"
      value={editor.getAttributes("paragraph")?.textAlign}
      exclusive
      onChange={(event, newFormat: string | null) => { if (newFormat) { setFormat(newFormat); } }}
    >
      <ToggleButton value="left">
        <Tooltip title="Left align" placement="top">
          <FormatAlignLeftIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="center">
        <Tooltip title="Center align" placement="top">
          <FormatAlignCenterIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="right">
        <Tooltip title="Right align" placement="top">
          <FormatAlignRightIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="justify">
        <Tooltip title="Justify text" placement="top">
          <FormatAlignJustifyIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

const ListTools: React.FC<ToolbarProps> = ({
  editor
}) => {
  const checkFormats = ["bulletList", "orderedList"];

  let activeFormat = "";
  for (const format of checkFormats) {
    if (editor.isActive(format)) {
      activeFormat = format;
      break;
    }
  }

  const setFormat = (newFormat: string) => {
    editor.chain().focus().toggleList(newFormat, "listItem").run();
  }

  return (
    <ToggleButtonGroup
      aria-label="list type"
      size="small"
      value={activeFormat}
      exclusive
      onChange={(event, newFormat: string | null) => {
        if (!newFormat || checkFormats.includes(newFormat)) {
          setFormat(newFormat ?? activeFormat);
        }
      }}
    >
      <ToggleButton value="bulletList">
        <Tooltip title="Bulleted list" placement="top">
          <FormatListBulletedIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="orderedList">
        <Tooltip title="Numbered list" placement="top">
          <FormatListNumberedIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().sinkListItem("listItem").run()}
        disabled={!editor.can().sinkListItem("listItem")}
        value="increase"
      >
        <Tooltip title="Increase indent" placement="top">
          <FormatIndentIncreaseIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().liftListItem("listItem").run()}
        disabled={!editor.can().liftListItem("listItem")}
        value="decrease"
      >
        <Tooltip title="Decrease indent" placement="top">
          <FormatIndentDecreaseIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

const HistoryTools: React.FC<ToolbarProps> = ({
  editor
}) => {
  return (
    <ToggleButtonGroup
      aria-label="history tools"
      size="small"
    >
      <ToggleButton
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
        value="undo"
      >
        <Tooltip title="Undo" placement="top">
          <UndoIcon />
        </Tooltip>
      </ToggleButton>
      <ToggleButton
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
        value="redo"
      >
        <Tooltip title="Redo" placement="top">
          <RedoIcon />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

const LinkTools: React.FC<ToolbarProps> = ({
  editor
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [url, setUrl] = React.useState<string | null>(null);
  const [urlErr, setUrlErr] = React.useState<boolean>(false);

  const allowedSchemes = ["http://", "https://", "mailto:", "tel:"];

  const getSelectedUrl = () => editor.getAttributes("link").href;

  useEffect(() => {
    setUrl(getSelectedUrl());
  }, [getSelectedUrl()])

  const setLink = () => {
    if (!url) {
      setUrlErr(true);
      return;
    }

    let usesAllowedScheme = false;
    for (const scheme of allowedSchemes) {
      if (url.startsWith(scheme)) {
        usesAllowedScheme = true;
        break;
      }
    }

    if (!usesAllowedScheme) {
      setUrlErr(true);
      return;
    }

    // Note: rel attribute currently set automatically by TipTap
    // rel MUST be "noopener noreferrer nofollow" per sanitizeHtmlRichText
    editor.chain().focus().extendMarkRange("link").setLink({href: url, target: "_blank"}).run();
    closePopover();
  }

  const closePopover = () => {
    setUrlErr(false);
    setAnchorEl(null);
    setUrl(getSelectedUrl());
    editor.chain().focus().unsetMark("textSelection").run();
  }

  const openPopover = (event: React.MouseEvent<HTMLElement>) => {
    editor.chain().focus().setMark("textSelection").blur().run();
    setAnchorEl(event.currentTarget);
  }

  return (
    <div>
      <ToggleButtonGroup
        aria-label="link tools"
        size="small"
      >
        <ToggleButton
          onClick={openPopover}
          value="link"
        >
          <Tooltip title="Add link" placement="top">
            <InsertLinkIcon />
          </Tooltip>
        </ToggleButton>
        <ToggleButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          value="unlink"
        >
          <Tooltip title="Remove link" placement="top">
            <LinkOffIcon />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
      <Popover
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            width: "250px"
          }
        }}
      >
        <DialogContent sx={{ paddingBottom: 0 }}>
          <TextField
            value={url}
            error={urlErr}
            helperText={"URL must start with one of the following:\n" + allowedSchemes.join(", ")}
            onFocus={() => { setUrlErr(false); }}
            onChange={(event) => { setUrl(event.currentTarget.value); }}
            label="Link URL"
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={setLink}>
            Set Link
          </Button>
        </DialogActions>
      </Popover>
    </div>
  )
}

const Toolbar: React.FC<ToolbarProps> = ({
  editor
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item>
        <FormatTools editor={editor} />
      </Grid>
      <Grid item>
        <AlignmentTools editor={editor} />
      </Grid>
      <Grid item>
        <ListTools editor={editor} />
      </Grid>
      <Grid item>
        <LinkTools editor={editor} />
      </Grid>
      <Grid item sx={{ marginLeft: "auto" }}>
        <HistoryTools editor={editor} />
      </Grid>
    </Grid>
  )
}

// A custom mark that allows us to highlight a text selection even when the editor is not focused
// This is used to highlight selected text even when we are adding a link URL and focus changes
const TextSelection = Mark.create({
  name: "textSelection",

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { style: "background-color: #c7e0ff;" }), 0];
  }
})

type RichTextEditorProps = {
  // An HTML string representing the initial content of the editor, will be sanitized
  initialContent: string;
  // A callback that is called with the text editor contents as an HTML string
  // If the editor is empty, content is null
  output: (content: string | null) => void;
  // Placeholder text that is displayed in the text box when the content is empty
  placeholder: string;
}

// Rich text editor built on TipTap
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent,
  output,
  placeholder
}) => {
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      HardBreak,
      OrderedList,
      BulletList,
      ListItem,
      Bold,
      Italic,
      Strike,
      Underline,
      TextAlign.configure({
        types: ["paragraph"],
      }),
      GapCursor,
      DropCursor,
      History,
      Placeholder.configure({ placeholder }),
      Link.configure({
        openOnClick: false,
        autolink: false
      }),
      TextSelection
    ],
    editorProps: {
      attributes: {
        style: "min-height: 250px"
      }
    },
    /***********************************************************
     DO NOT EDIT THIS SECTION UNLESS YOU KNOW WHAT YOU ARE DOING
     AND USE EXTREME CAUTION EVEN IF YOU DO
     ***********************************************************/
    content: sanitizeHtmlRichText(initialContent)
    /***********************************************************
     ***********************************************************/
  })

  React.useEffect(() => {
    if (editor) {
      if (editor.isEmpty) {
        output(null);
      } else {
        output(editor.getHTML());
      }
    }
  })

  return (
    <Paper
      variant="outlined"
      sx={{
        margin: "10px",
        padding: "10px",
      }}
    >
      {editor && <Toolbar editor={editor} />}
      <style global jsx>{`
        .ProseMirror-focused:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <EditorContent
        editor={editor}
      />
    </Paper>
  )
}

export default RichTextEditor
