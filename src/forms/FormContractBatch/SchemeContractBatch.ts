import Joi from 'joi'

export const schemaContractBatch = Joi.object<iSchemaContractBatch>({
  davkaInfo: Joi.object<iSchemaContractBatch['davkaInfo']>({
    nazev: Joi.string().required(),
    datumPlatnostiOd: Joi.string().empty(''),
    cisloUsneseniKraj: Joi.string().empty(''),
    datumUsneseniKraj: Joi.string().empty(''),
  }),
})

export type iSchemaContractBatch = {
  davkaInfo: {
    nazev: string
    datumPlatnostiOd: string
    cisloUsneseniKraj: string
    datumUsneseniKraj: string
  }
  smlouvy: string[]
  pomocnaSmlouvyStornovat?: string[]
  pomocnaSmlouvyPrepracovat?: string[]
  pomocnaSmlouvyRevokovat?: string[]
}
