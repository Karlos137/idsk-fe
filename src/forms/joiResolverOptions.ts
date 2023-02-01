export const joiResolverOptions = {
  abortEarly: false,
  messages: {
    'string.empty': 'Políčko je povinné', //zadejte prosim hodnotu
    'string.base': 'Vyberte hodnotu',
    'string.email': 'Zadejte validní e-mail',
    'any.required': 'Políčko je povinné',
    'string.phone': 'Zadejte validní telefoní číslo',
    'string.firstCapital': 'První znak musí být velké písmeno',
    // 'any.invalid': 'Valore non valido',
    // 'domain.invalid': 'Dominio non valido',
    // 'phoneNumber.invalid': 'Numero di telefono non valido',
    // 'array.unique': 'Valore duplicato',
    // 'custom.max11char': 'Massimo 11 caratteri alfanumerici. Iniziare con una lettera'
  },
}
