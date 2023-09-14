import { Express } from 'express'
import swaggerUi from 'swagger-ui-express'

import swaggerDocument from './swagger.json'

export function swaggerDocs(app: Express, port: number) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  console.info(`Docs available at http://localhost:${port}/api-docs`)
}
