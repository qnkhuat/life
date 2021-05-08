const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  env: {
    FIREBASE_APIKEY: "AIzaSyCNZHbgh37PoB_nl06nuuvt0B6D2kJNEbk",
    FIREBASE_AUTHDOMAIN: "mylife-stories.firebaseapp.com",
    FIREBASE_STORAGEBUCKET: "mylife-stories.appspot.com",
    FIREBASE_MESSAGINGSENDERID: "571594077037",
    FIREBASE_APPID: "1:571594077037:web:318879812ca7da827aa064",
    FIREBASE_PROJECTID: "mylife-stories",
    FIREBASE_PRIVATEKEY: process.env.FIREBASE_PRIVATKEY,
    FIREBASE_CLIENTEMAIL: "firebase-adminsdk-46bv6@mylife-stories.iam.gserviceaccount.com",
    BASE_URL: "https://life-server.vercel.app"
  },
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty'
      }
    }

    return config
  }
})
