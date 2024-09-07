import { SxProps, Theme, Typography } from "@mui/material";
import React from "react";

import sanitizeHtmlRichText from "../helpers/sanitizeHtmlRichText";

interface RichTextFieldProps {
  value: string;
  sx?: SxProps<Theme>;
}

const RichTextField: React.FC<RichTextFieldProps> = ({
  value,
  sx,
}) => {
  /***********************************************************
   DO NOT EDIT THIS SECTION UNLESS YOU KNOW WHAT YOU ARE DOING
   AND USE EXTREME CAUTION EVEN IF YOU DO
   ***********************************************************/
  return (
    <Typography
      sx={{ lineHeight: "1.5rem", ...sx }}
      component="div"
      dangerouslySetInnerHTML={{ __html: sanitizeHtmlRichText(value) }}
    />
  );
  /***********************************************************
   ***********************************************************/
};

export default RichTextField;
