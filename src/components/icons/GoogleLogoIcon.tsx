import * as React from "react";
import type { SVGProps } from "react";

const GoogleLogoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 26" {...props}>
    <g xmlns="http://www.w3.org/2000/svg">
      <path fill="#F4B400" d="m5.762 15.712-.905 3.379-3.308.07A12.95 12.95 0 0 1 0 13c0-2.156.524-4.189 1.454-5.979l2.945.54 1.29 2.928A7.7 7.7 0 0 0 5.272 13c0 .954.173 1.869.49 2.712" />
      <path fill="#4285F4" d="M25.773 10.571Q25.998 11.753 26 13c0 .931-.098 1.839-.284 2.714a13 13 0 0 1-4.578 7.424v-.001l-3.71-.189-.524-3.277a7.76 7.76 0 0 0 3.333-3.957h-6.951v-5.143h7.052z" />
      <path fill="#0F9D58" d="m21.137 23.137.001.001A12.94 12.94 0 0 1 12.999 26c-4.95 0-9.255-2.767-11.45-6.839l4.213-3.449a7.73 7.73 0 0 0 11.141 3.959z" />
      <path fill="#DB4437" d="m21.298 2.993-4.211 3.448A7.732 7.732 0 0 0 5.69 10.489L1.455 7.021h-.001A13 13 0 0 1 13 0c3.155 0 6.047 1.124 8.298 2.993" />
    </g>
  </svg>
);

GoogleLogoIcon.displayName = "GoogleLogoIcon";

export default GoogleLogoIcon;