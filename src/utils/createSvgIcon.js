// src/utils/createSvgIcon.js
import React from "react";

/**
 * Factory function to create SVG icon components
 * Eliminates boilerplate when creating multiple icons
 * 
 * @param {string} iconName - Display name for the icon component
 * @param {string} pathData - SVG path d attribute
 * @param {object} options - Configuration options
 * @returns {React.ForwardRefComponent} Icon component
 */
export const createSvgIcon = (iconName, pathData, options = {}) => {
  const {
    viewBox = "0 0 24 24",
    defaultSize = 24,
    fillRule = "evenodd",
    clipRule = "evenodd",
  } = options;

  const Component = React.forwardRef(
    (
      {
        size = defaultSize,
        color = "currentColor",
        className = "",
        style = {},
        title = `${iconName.toLowerCase()}-icon`,
        pathProps = {},
        ...svgProps
      },
      ref
    ) => {
      const children = [];
      if (title) {
        children.push(React.createElement("title", { key: "title" }, title));
      }
      children.push(
        React.createElement("path", {
          key: "path",
          fillRule,
          clipRule,
          d: pathData,
          fill: color,
          ...pathProps,
        })
      );

      return React.createElement(
        "svg",
        {
          ref,
          width: size,
          height: size,
          viewBox,
          fill: "none",
          xmlns: "http://www.w3.org/2000/svg",
          role: "img",
          "aria-label": title,
          className,
          style,
          ...svgProps,
        },
        ...children
      );
    }
  );

  Component.displayName = `${iconName}Icon`;
  return Component;
};

export default createSvgIcon;
