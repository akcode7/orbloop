import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
const SavedIcon = (props: SvgProps) => (
  <Svg
    id="Layer_1"
    data-name="Layer 1"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M20.5,0H3.5C2.122,0,1,1.121,1,2.5V23.996L12,13.053l11,10.943V2.5c0-1.379-1.122-2.5-2.5-2.5Zm1.5,21.59L12,11.643,2,21.59V2.5c0-.827,.673-1.5,1.5-1.5H20.5c.827,0,1.5,.673,1.5,1.5V21.59Z" />
  </Svg>
);
export default SavedIcon;
