export const isErrorResponseUserExist = (err?: any) =>
  err?.response?.status === 422 &&
  err?.response?.data?.violations?.some((v: any) => v.code === '23bd9dbf-6b9b-41cd-a99e-4844bcf3077f')
