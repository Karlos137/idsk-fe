import Joi from 'joi'
import { joiCustomValidFirstCapital, joiCustomValidPhone } from '../../utils/validations'

export const schemaSubject = Joi.object<iSchemaSubject>({
  basicInfo: Joi.object<iSchemaSubject['basicInfo']>({
    subjectType: Joi.string().required(),
    ic: Joi.string().required(),
    name: Joi.string().required(),
    note: Joi.string().empty(''),
  }),
  address: Joi.object<iSchemaSubject['address']>({
    street: Joi.string().required(),
    landRegistryNumber: Joi.string().required(),
    houseNumber: Joi.string().empty(''),
    psc: Joi.string().required(),
    municipality: Joi.string().required(),
    stateCode: Joi.string().required(),
  }),
  contactPersons: Joi.array().items({
    isStatutory: Joi.boolean(),
    isMainContact: Joi.boolean(),
    titleBefore: Joi.string().empty(''),
    name: Joi.string().required().custom(joiCustomValidFirstCapital),
    name2: Joi.string().empty('').custom(joiCustomValidFirstCapital),
    surname: Joi.string().required().custom(joiCustomValidFirstCapital),
    titleAfter: Joi.string().empty(''),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    phone: Joi.string().required().custom(joiCustomValidPhone),

    establishAccount: Joi.boolean(), // jen pokud isStatutory je true
    login: Joi.string().when('establishAccount', {
      is: true,
      then: Joi.string().required(),
      otherwise: Joi.string().empty(''),
    }),
  }),
})

export type iSchemaSubject = {
  basicInfo: {
    subjectType: string
    ic: string
    name: string
    note?: string
  }
  address?: {
    street?: string
    landRegistryNumber?: string
    houseNumber?: string
    psc?: string
    municipality?: string
    stateCode?: string
  }
  contactPersons?: {
    isStatutory?: boolean
    isMainContact?: boolean
    titleBefore?: string
    name?: string
    name2?: string
    surname?: string
    titleAfter?: string
    email?: string
    phone?: string
    establishAccount?: boolean
    login?: string
  }[]
}
