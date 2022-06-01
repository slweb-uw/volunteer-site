import React from "react";
import sanitizeHtmlRichText from "../helpers/sanitizeHtmlRichText";

type RichTextFieldProps = {
  value: string;
  removeTopMargin: boolean;
}

const RichTextField: React.FC<RichTextFieldProps> = ({
  value,
  removeTopMargin
}) => {
  const style : any = {}
  if (removeTopMargin) {
    style.marginTop = "-1em";
  }
  /***********************************************************
   DO NOT EDIT THIS SECTION UNLESS YOU KNOW WHAT YOU ARE DOING
   AND USE EXTREME CAUTION EVEN IF YOU DO
   ***********************************************************/
  return <div style={style} dangerouslySetInnerHTML={{ __html: sanitizeHtmlRichText(value) }} />
  /***********************************************************
   ***********************************************************/
}

export default RichTextField;