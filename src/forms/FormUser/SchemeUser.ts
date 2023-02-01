import Joi from 'joi'
import { joiCustomValidFirstCapital, joiCustomValidPhone } from '../../utils/validations'

export const schemaUser = Joi.object<iSchemaUser>({
  basicInfo: Joi.object<iSchemaUser['basicInfo']>({
    subject: Joi.string().required(),
    titleBefore: Joi.string().empty(''),
    name: Joi.string().required().custom(joiCustomValidFirstCapital),
    name2: Joi.string().empty('').custom(joiCustomValidFirstCapital),
    surname: Joi.string().required().custom(joiCustomValidFirstCapital),
    titleAfter: Joi.string().empty(''),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } }),
    phone: Joi.string().required().custom(joiCustomValidPhone),
    login: Joi.string().required(),
    note: Joi.string().empty(''),
    position: Joi.string().empty(''),
  }),
  stateBox: Joi.object<iSchemaUser['stateBox']>({
    state: Joi.string().empty(''),
    activeFrom: Joi.string().empty(''),
    // suspendedTo: Joi.string(),
  }),
  roleBox: Joi.object<iSchemaUser['roleBox']>({
    role: Joi.string().required(),
  }),
})

export type iSchemaUser = {
  basicInfo: {
    subject: string
    titleBefore?: string
    name: string
    name2?: string
    surname: string
    titleAfter?: string
    email: string
    phone: string
    login: string
    note?: string
    position?: string
  }
  stateBox?: {
    state?: string
    activeFrom?: string
    // suspendedTo: string,
  }
  roleBox?: {
    role: string
  }
}
