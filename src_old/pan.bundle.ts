import * as pan from "./pan";

Object.keys(pan).forEach((key) => (window[key] = pan[key]));
