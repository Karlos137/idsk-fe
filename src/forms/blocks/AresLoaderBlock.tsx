import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { toast } from 'react-toastify'
import IamApi from '../../api/IamApi'
import ButtonGov from '../../components/Btns/ButtonGov'

const AresLoaderBlock = () => {
  const methods = useFormContext()
  const ico = methods.watch('basicInfo.ic')

  const [loading, setLoading] = useState(false)

  const clickAres = () => {
    if (ico.length !== 8) {
      toast.error('IČ musí mít 8 číslic')
      return
    }
    setLoading(true)

    IamApi.ares(ico)
      .then((data: any) => {
        const parser = new DOMParser()
        // const doc = parser.parseFromString(data, "application/xml");
        const doc = parser.parseFromString(data, 'text/xml')

        const parseElement = (name: string) => doc.getElementsByTagName(name)[0]?.textContent || ''
        // doc.getElementsByTagName(val)[0].[0].childNodes[0].nodeValue

        const pocetZaznamu = parseElement('are:Pocet_zaznamu')
        if (pocetZaznamu === '0') {
          toast.error('Zadané IČ nemá záznam v ARES')
          return
        }

        const values = {
          nazev: parseElement('are:Obchodni_firma'),
          obec: parseElement('dtt:Nazev_obce'),
          ulice: parseElement('dtt:Nazev_ulice'),
          cisloDomovni: parseElement('dtt:Cislo_domovni'),
          cisloOrientacni: parseElement('dtt:Cislo_orientacni'),
          psc: parseElement('dtt:PSC'),
        }
        console.log('values', values)

        methods.setValue('basicInfo.name', values.nazev)
        methods.trigger('basicInfo.name')

        methods.setValue('address', {
          municipality: values.obec,
          street: values.ulice,
          landRegistryNumber: values.cisloDomovni,
          houseNumber: values.cisloOrientacni,
          psc: values.psc,
          stateCode: 'cz',
        })
        methods.trigger('address')

        toast.success('Název a adresa subjektu načtena z ARES')
      })
      .catch((err) => {
        console.error('ARES chyba', err)
        toast.error('Chyba vyhledání v ARES')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <ButtonGov disabled={!ico || loading} variant='primary' onClick={clickAres} loading={loading}>
      Vyhledat v ARES
    </ButtonGov>
  )
}

export default AresLoaderBlock
