import Joi from 'joi'

export const schemaContract = Joi.object<iSchemaContract>({
  pomocnaPocetPodpisu: Joi.number().empty('').default(0),
  pomocnaHodnotyPropsany: Joi.boolean().empty('').default(false),
  varianta: Joi.string().required(),
  pocetStran: Joi.string().required(),
  typ: Joi.string().required(),
  jeFinancniKontrola: Joi.boolean(),
  rodicovskaSmlouva: Joi.string(),
  smlouvaInfo: Joi.object<iSchemaContract['smlouvaInfo']>({
    nazev: Joi.string().required(),
    poznamka: Joi.string().empty(''),
  }),
  subjektStranyA: Joi.object<iSchemaContract['subjektStranyA']>({
    id: Joi.string().required(),
    nazev: Joi.string().required(),
    ic: Joi.string().required(),
    cisloSmlouvyStranyA: Joi.string().empty(''),
  }).required(),
  subjektStranyB: Joi.object<iSchemaContract['subjektStranyB']>({
    id: Joi.string().required(),
    nazev: Joi.string().required(),
    ic: Joi.string().required(),
    pocetPodepisujicichStranyB: Joi.number().required(),
    cisloSmlouvyStranyB: Joi.string().empty(''),
  }).required(),
  subjektStranyC: Joi.object<iSchemaContract['subjektStranyC']>({
    id: Joi.string().required(),
    nazev: Joi.string().required(),
    ic: Joi.string().required(),
    cisloSmlouvyStranyC: Joi.string().empty(''),
  }), //todo required pokud je tristranna
  schvaleni: Joi.object<iSchemaContract['schvaleni']>({
    obec: Joi.object<iSchemaContract['schvaleni']['obec']>({
      datumUsneseniObec: Joi.string().empty(''),
      cisloUsneseniObec: Joi.string().empty(''),
    }),
    kraj: Joi.object<iSchemaContract['schvaleni']['kraj']>({
      datumUsneseniKraj: Joi.string().empty(''),
      cisloUsneseniKraj: Joi.string().empty(''),
    }),
  }),
  financniKontrola: Joi.object<iSchemaContract['financniKontrola']>({
    datumFinancniKontroly: Joi.string().empty(''),
    vysledekFinancniKontroly: Joi.string().empty(''),
    poznamkaFinancniKontroly: Joi.string().empty(''),
  }),
  // jePublikovano: Joi.boolean(),
})

export type iSchemaContract = {
  pomocnaPocetPodpisu: number
  pomocnaHodnotyPropsany: boolean
  varianta: string
  pocetStran: string
  typ: string
  jeFinancniKontrola: boolean
  rodicovskaSmlouva: string
  smlouvaInfo?: {
    nazev: string
    poznamka?: string
  }
  subjektStranyA?: {
    id: string
    nazev: string
    ic: string
    cisloSmlouvyStranyA?: string
  }
  subjektStranyB?: {
    id: string
    nazev: string
    ic: string
    pocetPodepisujicichStranyB: number
    cisloSmlouvyStranyB?: string
  }
  subjektStranyC?: {
    id: string
    nazev: string
    ic: string
    cisloSmlouvyStranyC?: string
  }
  schvaleni: {
    obec?: {
      datumUsneseniObec?: string
      cisloUsneseniObec?: string
    }
    kraj?: {
      datumUsneseniKraj?: string
      cisloUsneseniKraj?: string
    }
  }
  financniKontrola?: {
    datumFinancniKontroly: string
    vysledekFinancniKontroly: string
    poznamkaFinancniKontroly: string
  }
  davkaId?: string
  // jePublikovano: boolean,
}
