module.exports = {
  env: {
    FIREBASE_APIKEY: "AIzaSyCNZHbgh37PoB_nl06nuuvt0B6D2kJNEbk",
    FIREBASE_AUTHDOMAIN: "mylife-stories.firebaseapp.com",
    FIREBASE_PROJECTID: "mylife-stories",
    FIREBASE_STORAGEBUCKET: "mylife-stories.appspot.com",
    FIREBASE_MESSAGINGSENDERID: "571594077037",
    FIREBASE_APPID: "1:571594077037:web:318879812ca7da827aa064",
    API_URL: "http://localhost:5001/mylife-stories/us-central1/api",
    FIREBASE_PROJECTID: "mylife-stories",
    FIREBASE_PRIVATEKEY: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC6UZfE4IFXH/aF\n+A93ANYLx6b7EQHbpa4TKDCSBXcd1DxSfyJ2EtMKKlG1HuiNglqv3RUvyOtqMTfK\nP6eLaBTKtS9/ZceEvPr3VzBaNrjTF9CGwYp57vWCpPWPUyGJ2PyAfMkRpBT3uAe8\nckL7icgWuGr9usbcJyCWrSj+UekJSYCGZV/Q72K6bRlXxlEWdYbB1geUwGkghhfZ\njnVPmhmaqqJFBs4wFNrEyzuiBHG4HAquCp+wWzCF35BSS1fQ0Q/s8Lu9kSTk9CAE\njwHeB0v2yb8djShp6SOoFuNf+s85u2/oaZbq/hvC5rgHRiDmuFVGQckjMgJ7dY8U\no7kNau33AgMBAAECggEAM/WSKhzj5QysXsMFaQ4KI0Hb7tNY3czQBValaOtuQxrP\nccAzt5LbWM/hdm22s9QA/19by7Yv9K7iHJxw2H8/oSIzK0eSgxGCuZyOhvIQzAmt\npQ7vU77Qp8ziEETCKyOgkyJ5nlpQYJ7pRWPmCyjq7G8kozrFv1qIC40hy/7CysxC\n3VyGa3mJYdks0oyu/a5kTV4bEbK+mBoZeQO0+h5inAPmCPb7lDqvrvIAhw2Z/pu/\nuI6PTzqrmqt/EXcYUF6IwnclRl5MexjUo3rTGqz6BMyR8yV0wb75JQvOFRbKL2zf\nH0VuZ3HX5gdd951hFjmoGe7BxYzcgcKOn9NWoEKmDQKBgQDvqGp6JIAyaUKYEiD+\nmYxAUhnOVKpZHDS7deEZL5duFW3ixcnOjMM6uQLP0PQTotMWAti+HoW6VdxToA+3\nljMdRyblieF5w0vdJelDfZV01XQnNt+XBQKp9HG5hK+dJSWLhs7B3lSzAkrF06wg\nl7hK32mpxnKrrq9zEFe/XvED0wKBgQDHBhAUMrFN1qqgCRCvjX9KfOVrVdd9K0TL\npyArOMp02/ufG4y/Rcanxq0thP1jJM0oIFpbPOjJZ91IGTevncEKbLJtdPjZuGzF\nGl32m6pXk/zlreNAWLJppj26ATZu7lo6d3ZK1/Mhao2Ww4TsvUDYwmyi8LdTg3eP\nOfq2y+TqzQKBgHLQR3qOpBACl5HNFZuDqkpiStSrgRTBy42HcrijMTPe9k7vHLhk\nfV9TpUI0Q8podiIUaQvkCYL0gWJay0zTm1dKcBsFjEzOQDkJYZAgyQo4/LWQt1td\nXiJX5mfPZmatligbBFCimAdOcM4Hk23l4beVAsUAOo1/WbSRPsiCzopbAoGANDV6\n8lF6AZlWmTTHk8Xipn+tD0MtjEBVg7cL0UrMkWtDzrFDcsmzG0AbHd3NOrzktKoI\nCfcoee0tN0SmPwN7KGjrRZtxzGt83RfVnmOng+Hmbbn362FZLC3X83tt9BvCv6Om\n/Gs59IInMm2H6TKcWEBojzXmYZoTOxdSlbFXE+ECgYEAwtuH1iRZte5sl7t8sNBZ\nYPC5CARYxdls4GXR8unAkOa+R5TsdkdjQJ11WQqvn+KGh9HdsiA8lCDzsKazeQ6v\nOIAZ+zJanytIzzbUh8JM/jRYqyYhLo1umtb2KjuDO44pmb2t+7iwMc4pxZ08xsme\nU9UJj+hiWYbETIc038wDZ3c=\n-----END PRIVATE KEY-----\n",
    FIREBASE_CLIENTEMAIL: "firebase-adminsdk-46bv6@mylife-stories.iam.gserviceaccount.com"
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
}
