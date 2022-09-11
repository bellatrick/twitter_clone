/** @type {import('next').NextConfig} */
const intercept = require("intercept-stdout")
module.exports = {
  reactStrictMode: true,
  images:{
    domains:['rb.gy','images.pexels.com']
  }
}


// safely ignore recoil warning messages in dev (triggered by HMR)
function interceptStdout(text) {
  if (text.includes("Duplicate atom key")) {
    return ""
  }
  return text
}

if (process.env.NODE_ENV === "development") {
  intercept(interceptStdout)
}