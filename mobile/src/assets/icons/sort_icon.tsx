import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const SortIcon = (props: SvgProps) => (
  <Svg
    width="800px"
    height="800px"
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path
      d="M22 7L2 7"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      opacity={0.5}
      d="M19 12L5 12"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M16 17H8"
      stroke="#1C274C"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </Svg>
);
export default SortIcon;
