export const taskStatus = {
  // PREDPUNJEN: 5,
  STVOREN: 10,
  PREUZET: 20,
  DOSTAVLJEN_NA_LOKACIJU: 30,
  PREUZET_NA_LOKACIJI: 40,
  VRACEN_KLIJENTU: 50,
  ZAVRSEN: 60,
  // ARHIVIRAN: 70,
  OTKAZAN: 90,
}

export const taskTODO = {
  // PREDPUNJEN: 5,
  PREUZETI: 10,
  DOSTAVITI_NA_LOKACIJU: 20,
  PREUZETI_NA_LOKACIJI: 30,
  VRATITI_KLIJENTU: 40,
  VRACEN: 50,
  ZAVRSEN: 60,
  // ARHIVIRAN: 70,
  OTKAZAN: 90,
}

export const taskStatusName = {
  // PREDPUNJEN: 5,
  '10': 'Stvoreno',
  '20': 'Preuzeto',
  '30': 'Dostavljeno',
  '40': 'Obradjeno',
  '50': 'Vraceno',
  '60': 'Zavrseno',
  // '70': ARHIVIRAN,
  '90': 'Otkazano',
}

export const taskStatusColor = {
  // PREDPUNJEN: 5,
  '10': '#9E9E9E',
  '20': '#2196f3',
  '30': '#673ab7',
  '40': '#ff9800',
  '50': '#607d8b',
  '60': '#009688',
  // '70': ARHIVIRAN,
  '90': 'Red',
}

export const taskStatusTODOName = {
  '10': 'Preuzeti',
  '20': 'Dostaviti na lokaciju',
  '30': 'Preuzeti na lokaciji',
  '40': 'Vratiti',
}

export function getIcon(status) {
  switch (status) {
    case taskTODO.PREUZETI:
      return 'ios-undo'
    case taskTODO.PREUZETI_NA_LOKACIJI:
      return 'md-timer'
    case taskTODO.VRATITI_KLIJENTU:
      return 'md-archive'
    case taskTODO.ZAVRSEN:
      return 'md-done-all'
    default:
      return 'md-help'
  }
}

export function getStatusNameHr(status) {
  if (taskStatusName[status] !== undefined) {
    return taskStatusName[status]
  }
  return ''
}

export function getStatusColor(status) {
  if (taskStatusColor[status] !== undefined) {
    return taskStatusColor[status]
  }
  return ''
}
