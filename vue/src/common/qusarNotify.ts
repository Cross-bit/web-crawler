import { Notify } from 'quasar'

export const error = (message: string) => {
    Notify.create({
        color: 'red-5',
        textColor: 'white',
        icon: 'warning',
        position: 'top',
        message: message
    })
}

export const warning = (message: string) => {
    Notify.create({
        color: 'orange-5',
        textColor: 'white',
        icon: 'warning',
        position: 'top',
        message: message
    })
}

export default (message: string) => {
    Notify.create({
        message: message,
        position: 'top',
        color: 'blue-5',
    })
}


