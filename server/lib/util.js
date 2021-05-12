import Cors from 'cors';

export const cors = Cors({
  methods: ['GET', 'HEAD', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
})

export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export const createValidator = (schema, property) => {
  return async (req, res , next ) => {
    schema.validate(req[property], {strict: false, abortEarly: false}).then((value) => {
      next();
    }).catch((error) => {
      res.status(422).send({error: error?.errors.join(". ")});
    })
  }
}

