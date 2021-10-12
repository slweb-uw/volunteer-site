import React from "react";

interface Props {
  href: string;
  className: any;
  children?: React.ReactNode;
}

const ResourceLink: React.FC<Props> = ({ href, className, children }) => {
  return (
    <a href={href} className={className} target="_blank">
      {children}
    </a>
  );
};

export default ResourceLink;
